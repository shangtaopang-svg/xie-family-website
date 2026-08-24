const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { exec } = require('child_process');

// 零依赖 .env 读取器：存在 .env 则把 KEY=VALUE 载入 process.env（已存在的环境变量优先）
(function loadEnvFile() {
  try {
    const envFile = path.join(__dirname, '.env');
    if (fs.existsSync(envFile)) {
      const lines = fs.readFileSync(envFile, 'utf-8').split(/\r?\n/);
      for (const line of lines) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (m && process.env[m[1]] === undefined) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch (e) { /* .env 不存在或读取失败则忽略 */ }
})();

// AI 咨询模块
const aiToken = require('./server/ai/token.js');
const { buildKnowledge } = require('./scripts/build-ai-knowledge.js');
const { normalizeLifeStatus } = require('./server/life-status.js');

// 启动时确保 AI 知识库存在且不早于任一源文件（重建约 1s，幂等）
setTimeout(() => {
  try {
    const kbPath = path.join(DATA_DIR, 'ai', 'knowledge.json');
    const sources = [
      path.join(DATA_DIR, 'genealogy.json'),
      path.join(DATA_DIR, 'parsed_entries.json'),
      path.join(DATA_DIR, 'genealogy_book_extract.txt'),
      path.join(DATA_DIR, 'genealogy_analysis.txt'),
      path.join(__dirname, '上册_竖排提取.txt'),
      path.join(__dirname, '下册_竖排提取.txt'),
      path.join(__dirname, 'scripts', 'ai-seeds.js'),
    ];
    const need = !fs.existsSync(kbPath)
      || sources.some(s => !fs.existsSync(s) || fs.statSync(s).mtimeMs > fs.statSync(kbPath).mtimeMs);
    if (need) {
      const r = buildKnowledge();
      console.log('[ai] 知识库已重建:', JSON.stringify(r.stats));
    }
  } catch (e) { console.warn('[ai] 知识库检查失败:', e.message); }
}, 2000);

const PORT = parseInt(process.env.PORT, 10) || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(__dirname, 'data', 'backups');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// Periodic auto-backup every 30 minutes
setInterval(() => {
  const modules = ['genealogy', 'members', 'news', 'activities', 'honors', 'reports', 'photos', 'videos', 'merit', 'merit-fundraising', 'merit-external', 'merit-social'];
  modules.forEach(mod => {
    const src = path.join(DATA_DIR, mod + '.json');
    if (fs.existsSync(src)) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const dst = path.join(BACKUP_DIR, `${mod}_${ts}.json`);
      try {
        fs.copyFileSync(src, dst);
        // Keep only last 20 backups per module
        const files = fs.readdirSync(BACKUP_DIR)
          .filter(f => f.startsWith(mod + '_'))
          .sort()
          .reverse();
        files.slice(20).forEach(f => {
          try { fs.unlinkSync(path.join(BACKUP_DIR, f)); } catch(e) {}
        });
      } catch(e) {}
    }
  });
}, 30 * 60 * 1000);

// Also backup on startup
setTimeout(() => {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const src = path.join(DATA_DIR, 'genealogy.json');
  if (fs.existsSync(src)) {
    const dst = path.join(BACKUP_DIR, `genealogy_startup_${ts}.json`);
    try { fs.copyFileSync(src, dst); } catch(e) {}
  }
}, 5000);

// In-memory admin tokens (expire on server restart — acceptable for this scale)
const adminTokens = new Set();
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

const MIME = {
  '.html': 'text/html;charset=utf-8',
  '.css': 'text/css;charset=utf-8',
  '.js': 'application/javascript;charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch (e) {}
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function sendJson(req, res, status, data) {
  const body = JSON.stringify(data);
  gzipSend(req, res, status, { 'Content-Type': 'application/json' }, body);
}

// TTS 朗读限流：每 IP 滑动窗口 20 次/分钟
const ttsHits = new Map();
function ttsRateOk(ip) {
  const now = Date.now();
  const arr = (ttsHits.get(ip) || []).filter(t => now - t < 60000);
  if (arr.length >= 20) { ttsHits.set(ip, arr); return false; }
  arr.push(now);
  ttsHits.set(ip, arr);
  if (ttsHits.size > 500) { ttsHits.clear(); }
  return true;
}

const GZIP_MIN = 1024; // only gzip responses larger than 1KB

function gzipSend(req, res, status, headers, data) {
  const accept = req.headers['accept-encoding'] || '';
  if (accept.includes('gzip') && Buffer.byteLength(data) > GZIP_MIN) {
    zlib.gzip(data, (err, compressed) => {
      if (err) {
        // fallback to uncompressed
        headers['Content-Length'] = Buffer.byteLength(data);
        res.writeHead(status, headers);
        return res.end(data);
      }
      headers['Content-Encoding'] = 'gzip';
      headers['Content-Length'] = compressed.length;
      res.writeHead(status, headers);
      res.end(compressed);
    });
  } else {
    headers['Content-Length'] = Buffer.byteLength(data);
    res.writeHead(status, headers);
    res.end(data);
  }
}

// === AI 咨询窗口 HTML 注入（在 gzipSend 之前对 .html 做字符串替换） ===
const AI_INJECT_BLACKLIST = new Set(['/admin.html', '/recover.html']);
const AI_INJECT_MARK = '/js/ai-assistant.js';
function injectAiHtml(buf) {
  const html = buf.toString('utf-8');
  if (html.indexOf(AI_INJECT_MARK) !== -1) return buf; // 已注入过，跳过
  const m = html.search(/<\/body>/i);
  if (m === -1) return buf; // 无 body（HTML 片段）则跳过
  const inject =
    '<link rel="stylesheet" href="/css/ai.css">\n' +
    '<script src="/js/ai-assistant.js" defer></script>\n';
  return Buffer.from(html.slice(0, m) + inject + '</body>' + html.slice(m + 7), 'utf-8');
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let url = req.url.split('?')[0];

  // === API: File upload (binary or base64) ===
  if (url === '/api/upload' && req.method === 'POST') {
    try {
      const body = await collectBody(req);
      const { name, data } = JSON.parse(body);
      const matches = data.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return sendJson(req, res, 400, { error: 'Invalid data URL' });
      }
      const mimeType = matches[1];
      const raw = matches[2];
      const buffer = Buffer.from(raw, 'base64');
      const extMap = {
        'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif',
        'image/webp': '.webp', 'image/svg+xml': '.svg',
        'video/mp4': '.mp4', 'video/webm': '.webm',
        'audio/mpeg': '.mp3',
        'application/pdf': '.pdf',
      };
      const ext = extMap[mimeType] || '.bin';
      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = safeName + '_' + Date.now() + ext;
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFile(filePath, buffer, err => {
        if (err) {
          return sendJson(req, res, 500, { error: 'Write failed' });
        }
        sendJson(req, res, 200, { url: '/uploads/' + filename });
      });
      return;
    } catch (e) {
      return sendJson(req, res, 400, { error: e.message });
    }
  }

  // === API: Binary file upload (more efficient, no base64) ===
  if (url.startsWith('/api/upload/bin/') && req.method === 'POST') {
    try {
      const name = decodeURIComponent(url.replace('/api/upload/bin/', ''));
      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = safeName + '_' + Date.now();
      const filePath = path.join(UPLOADS_DIR, filename);

      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        // Detect file type from magic bytes
        let ext = '.bin';
        if (buffer[0] === 0xFF && buffer[1] === 0xD8) ext = '.jpg';
        else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) ext = '.png';
        else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) ext = '.gif';
        else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) ext = '.webp';
        else if (buffer.length >= 8 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) ext = '.mp4'; // ftyp box at byte 4 (bytes 0-3 are box size)
        else if (buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3) ext = '.webm'; // EBML header
        else if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ext = '.mp3'; // ID3v2 tag
        else if (buffer[0] === 0xFF && (buffer[1] === 0xFB || buffer[1] === 0xF3 || buffer[1] === 0xF2)) ext = '.mp3'; // MPEG sync

        const finalPath = filePath + ext;
        fs.writeFile(finalPath, buffer, err => {
          if (err) {
            return sendJson(req, res, 500, { error: 'Write failed' });
          }
          sendJson(req, res, 200, { url: '/uploads/' + path.basename(finalPath) });
        });
      });
      return;
    } catch (e) {
      return sendJson(req, res, 400, { error: e.message });
    }
  }

  // === API: File delete ===
  const deleteMatch = url.match(/^\/api\/upload\/(.+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const filename = decodeURIComponent(deleteMatch[1]);
    const filePath = path.join(UPLOADS_DIR, path.basename(filename));
    fs.unlink(filePath, () => {
      sendJson(req, res, 200, { ok: true });
    });
    return;
  }

  // === API: Admin login (server-side auth) ===
  if (url === '/api/login' && req.method === 'POST') {
    try {
      const body = await collectBody(req);
      const { password } = JSON.parse(body);
      if (password === ADMIN_PASSWORD) {
        const token = generateToken();
        adminTokens.add(token);
        return sendJson(req, res, 200, { ok: true, token });
      } else {
        return sendJson(req, res, 401, { ok: false, error: '密码错误' });
      }
    } catch (e) {
      return sendJson(req, res, 400, { error: e.message });
    }
  }

  // === API: Verify admin token ===
  if (url === '/api/verify' && req.method === 'GET') {
    const auth = req.headers['authorization'] || '';
    const token = auth.replace('Bearer ', '');
    if (adminTokens.has(token)) {
      return sendJson(req, res, 200, { ok: true });
    }
    return sendJson(req, res, 401, { ok: false });
  }

  // === API: 族人验证 ===
  if (url === '/api/verify-member' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, fatherName, grandpaName } = JSON.parse(body);
        if (!name || !fatherName) {
          return sendJson(req, res, 200, { verified: false, message: '请输入姓名和父亲名字' });
        }
        const filePath = path.join(DATA_DIR, 'genealogy.json');
        if (!fs.existsSync(filePath)) {
          return sendJson(req, res, 200, { verified: false, message: '族谱数据暂未加载' });
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const idMap = {};
        data.forEach(p => idMap[p.id] = p.name);
        const matches = data.filter(p => {
          if (p.name !== name) return false;
          if (!p.father_id) return false;
          const fName = idMap[parseInt(p.father_id)];
          if (!fName || fName !== fatherName) return false;
          if (grandpaName) {
            const father = data.find(f => f.id === parseInt(p.father_id));
            if (!father || !father.father_id) return false;
            const gName = idMap[parseInt(father.father_id)];
            if (!gName || gName !== grandpaName) return false;
          }
          return true;
        });
        if (matches.length > 0) {
          const p = matches[0];
          const resp = {
            verified: true,
            message: '验证通过，欢迎回家！',
            personId: p.id,
            name: p.name,
            token: aiToken.signPersonToken(p),
            expiresAt: Date.now() + 7 * 864e5
          };
          // 同名同父（多匹配）时附带候选信息，供前端提示补充祖父名
          if (matches.length > 1) {
            resp.ambiguous = true;
            resp.candidates = matches.map(m => ({ id: m.id, name: m.name, branch: m.branch }));
          }
          return sendJson(req, res, 200, resp);
        } else {
          return sendJson(req, res, 200, { verified: false, message: '信息不符，请核对或联系管理员' });
        }
      } catch(e) {
        return sendJson(req, res, 200, { verified: false, message: '请求数据错误' });
      }
    });
    return;
  }

  // === API: Data read/write (local JSON storage, replaces Supabase) ===
  const dataMatch = url.match(/^\/api\/data\/([a-zA-Z_]+)$/);
  if (dataMatch) {
    const module = dataMatch[1];
    const filePath = path.join(DATA_DIR, module + '.json');

    if (req.method === 'GET') {
      fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
          return sendJson(req, res, 200, []);
        }
        try {
          var parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            parsed.forEach(function(p) {
              if (!p.branch || p.branch === '—' || p.branch.trim() === '') {
                p.branch = '—';
              }
            });
            if (module === 'genealogy') parsed = normalizeLifeStatus(parsed);
          }
          sendJson(req, res, 200, parsed);
        } catch (e) {
          sendJson(req, res, 200, []);
        }
      });
      return;
    }

    if (req.method === 'POST') {
      try {
        if (module === 'genealogy') {
          const auth = req.headers['authorization'] || '';
          const token = auth.replace(/^Bearer\s+/i, '');
          if (!adminTokens.has(token)) {
            return sendJson(req, res, 401, { error: '族谱数据写入需要管理员权限' });
          }
        }
        const body = await collectBody(req);
        // Validate it's a valid JSON array (or object)
        const data = JSON.parse(body);
        // 数据安全：写入前先把当前文件备份到 backups/（带时间戳），防止覆盖失败/半途出错丢失原数据
        try {
          if (fs.existsSync(filePath)) {
            const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const dst = path.join(BACKUP_DIR, `${module}_prewrite_${ts}.json`);
            fs.copyFileSync(filePath, dst);
            // 每个模块只保留最近 20 个 prewrite 备份，避免无限堆积
            const files = fs.readdirSync(BACKUP_DIR)
              .filter(f => f.startsWith(module + '_prewrite_'))
              .sort()
              .reverse();
            files.slice(20).forEach(f => {
              try { fs.unlinkSync(path.join(BACKUP_DIR, f)); } catch(e) {}
            });
          }
        } catch (be) { /* 备份失败不阻断写入 */ }
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8', err => {
          if (err) {
            return sendJson(req, res, 500, { error: 'Write failed' });
          }
          sendJson(req, res, 200, { ok: true, count: Array.isArray(data) ? data.length : 1 });
        });
      } catch (e) {
        return sendJson(req, res, 400, { error: e.message });
      }
      return;
    }

    return sendJson(req, res, 405, { error: 'Method not allowed' });
  }

  // === API: 保存访客/族人信息 ===
  if (url === '/api/save-visitor' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const filePath = path.join(DATA_DIR, 'visitors.json');
        let visitors = [];
        if (fs.existsSync(filePath)) {
          visitors = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        visitors.push(data);
        fs.writeFileSync(filePath, JSON.stringify(visitors, null, 2));
        return sendJson(req, res, 200, { ok: true });
      } catch(e) {
        return sendJson(req, res, 200, { ok: false });
      }
    });
    return;
  }

  // === API: 获取访客信息（管理员专用） ===
  if (url === '/api/visitors' && req.method === 'GET') {
    const auth = req.headers['authorization'] || '';
    const token = auth.replace('Bearer ', '');
    if (!adminTokens.has(token)) {
      return sendJson(req, res, 401, { error: 'Unauthorized' });
    }
    const filePath = path.join(DATA_DIR, 'visitors.json');
    if (!fs.existsSync(filePath)) {
      return sendJson(req, res, 200, []);
    }
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return sendJson(req, res, 200, data);
    } catch(e) {
      return sendJson(req, res, 200, []);
    }
  }

  // === GitHub webhook for auto-deploy ===
  if (url === '/api/webhook' && req.method === 'POST') {
    const body = await collectBody(req);
    const sig = req.headers['x-hub-signature-256'] || '';
    const secret = process.env.WEBHOOK_SECRET || 'xie-family-deploy-2026';
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    // Use timing-safe comparison
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return sendJson(req, res, 403, { error: 'Invalid signature' });
    }
    // Run deploy asynchronously, don't block response
    const deployScript = path.join(__dirname, 'deploy.sh');
    exec('bash ' + deployScript, { cwd: __dirname }, (err, stdout, stderr) => {
      if (err) {
        console.error('Deploy failed:', stderr);
        return;
      }
      console.log('Deploy success:', stdout);
    });
    return sendJson(req, res, 200, { ok: true, message: 'Deploy started' });
  }

  // === 谢氏集萃数据接口 ===
  if (url === '/api/xie-collection' && req.method === 'GET') {
    const fp = path.join(DATA_DIR, 'xieCollection.json');
    fs.readFile(fp, 'utf-8', function(err, content) {
      if (err) return sendJson(req, res, 200, []);
      try { sendJson(req, res, 200, JSON.parse(content)); }
      catch(e) { sendJson(req, res, 200, []); }
    });
    return;
  }

  // === API: 家族成员公共只读数据 ===
  // 家族成员栏目必须以“族谱管理后台”的 canonical 数据为准。
  // 交付版世系图和 PDF 只作为谱文/来源核对材料，不在这里另起一套成员名单。
  if (url === '/api/genealogy-members' && req.method === 'GET') {
    try {
      const canonicalPath = path.join(DATA_DIR, 'genealogy.json');
      const records = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
      return sendJson(req, res, 200, normalizeLifeStatus(records).map(person => ({ ...person })));
    } catch (e) {
      return sendJson(req, res, 500, { error: '族谱管理后台数据暂时不可用' });
    }
  }

  // === B站封面代理 ===
  if (url === '/api/bilibili-cover' && req.method === 'GET') {
    const bvid = (req.url.match(/[?&]bvid=([^&]+)/) || [])[1];
    if (!bvid) return sendJson(req, res, 400, { error: 'Missing bvid' });
    const apiUrl = 'https://api.bilibili.com/x/web-interface/view?bvid=' + bvid;
    const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; xie-family-bot)' } };
    try {
      const https = require('https');
      https.get(apiUrl, opts, function(apiRes) {
        let data = '';
        apiRes.on('data', function(c) { data += c; });
        apiRes.on('end', function() {
          try {
            const json = JSON.parse(data);
            if (json.code === 0) {
              // 取第一个pic（合集可能有多个）
              const pic = json.data && json.data.pic;
              if (pic) return sendJson(req, res, 200, { cover: pic });
            }
            sendJson(req, res, 404, { error: 'Video not found' });
          } catch(e) { sendJson(req, res, 500, { error: 'Parse failed' }); }
        });
      }).on('error', function(e) { sendJson(req, res, 500, { error: e.message }); });
    } catch(e) { sendJson(req, res, 500, { error: e.message }); }
    return;
  }

  // === AI 咨询窗口 ===
  if (url === '/api/ai/chat') {
    try {
      await require('./server/ai/index.js').handleAiChat(req, res, req.url);
    } catch (e) {
      sendJson(req, res, 500, { ok: false, error: 'AI 服务异常' });
    }
    return;
  }

  // === AI 语音朗读（Edge 神经女声） ===
  if (url === '/api/tts') {
    const tts = require('./server/ai/tts.js');
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }
    if (req.method !== 'POST') {
      sendJson(req, res, 405, { ok: false, error: 'Method Not Allowed' });
      return;
    }
    try {
      const body = JSON.parse((await collectBody(req)) || '{}');
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      const voice = typeof body.voice === 'string' ? body.voice : '';
      if (!text || text.length > 800) {
        sendJson(req, res, 400, { ok: false, error: '文本长度需在 1-800 字之间' });
        return;
      }
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
      if (!ttsRateOk(ip)) {
        sendJson(req, res, 429, { ok: false, error: '朗读太频繁，请稍后再试' });
        return;
      }
      const { buf, boundaries } = await tts.synthesizeCached(text, { voice });
      // 返回 JSON：audio 为 base64 MP3；charTimes 为「逐字符揭示时间轴」（服务端把词级边界对齐到含标点原文），
      // 驱动前端多行卡拉OK字幕精确逐字同步；boundaries 保留兼容旧逻辑。
      const charTimes = tts.buildCharTimes(text, boundaries || []);
      const payload = JSON.stringify({ audio: buf.toString('base64'), boundaries: boundaries || [], charTimes: charTimes || [] });
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Content-Length': Buffer.byteLength(payload),
      });
      res.end(payload);
    } catch (e) {
      sendJson(req, res, 500, { ok: false, error: e.message || '语音合成失败' });
    }
    return;
  }

  // === Static file serving ===
  if (url === '/') url = '/index.html';

  // 历史快照、临时审计文件、旧后台副本和后台原始 JSON 不属于公开网站资源。
  // 它们保留在本地/服务器备份目录供恢复与审计，但不允许通过静态路径输出。
  let decodedUrl = url;
  try { decodedUrl = decodeURIComponent(url); } catch (e) { /* 保持原始路径，后续按普通静态路径处理 */ }
  const isArchivedSnapshot = /(?:^|\/)(?:网站原页面存档_|旧后台族谱管理与世代总览封存_|原始数据备份|全面审查.*备份|.*前备份|.*封存)(?:\/|$)/.test(decodedUrl);
  if (
    url === '/data/genealogy.json' ||
    url === '/data/genealogy_full.json' ||
    url === '/交付_下枫槎谢氏世系图/data.js' ||
    url.startsWith('/backups/') ||
    url.startsWith('/data/backups/') ||
    url === '/_bk.html' ||
    url.startsWith('/_tmp_') ||
    url === '/recover.html' ||
    url === '/pages/recover.html' ||
    isArchivedSnapshot
  ) {
    res.writeHead(404, { 'Content-Length': '9' });
    return res.end('Not Found');
  }

  const filePath = path.join(__dirname, url);
  const ext = path.extname(filePath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  const videoExts = ['.mp4', '.webm', '.mp3'];
  const textExts = ['.html', '.css', '.js', '.json', '.svg'];
  const cacheExts = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.woff', '.woff2', '.mp3', '.mp4', '.pdf'];

  // Support Range headers for video/audio streaming
  if (videoExts.includes(ext)) {
    fs.stat(filePath, (err, stat) => {
      if (err) {
        const msg = '404 Not Found';
        res.writeHead(404, { 'Content-Length': Buffer.byteLength(msg) });
        return res.end(msg);
      }
      const fileSize = stat.size;
      const range = req.headers.range;
      const mimeType = MIME[ext] || 'application/octet-stream';

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        res.writeHead(206, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=604800, immutable',
        });

        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
        stream.on('error', () => { res.end(); });
      } else {
        res.writeHead(200, {
          'Content-Type': mimeType,
          'Accept-Ranges': 'bytes',
          'Content-Length': fileSize,
          'Cache-Control': 'public, max-age=604800, immutable',
        });
        fs.createReadStream(filePath).pipe(res);
      }
    });
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (ext === '.html') {
        return fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Length': '9' });
            return res.end('404 Not Found');
          }
          return gzipSend(req, res, 200, { 'Content-Type': 'text/html;charset=utf-8' }, injectAiHtml(data2));
        });
      }
      const msg = '404 Not Found';
      res.writeHead(404, { 'Content-Length': Buffer.byteLength(msg) });
      return res.end(msg);
    }
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
    };
    if (ext === '.html') {
      headers['Cache-Control'] = 'no-cache';
      if (!AI_INJECT_BLACKLIST.has(url)) data = injectAiHtml(data);
    } else if (cacheExts.includes(ext)) {
      headers['Cache-Control'] = 'public, max-age=604800, immutable';
    }
    if (textExts.includes(ext)) {
      gzipSend(req, res, 200, headers, data);
    } else {
      headers['Content-Length'] = data.length;
      res.writeHead(200, headers);
      res.end(data);
    }
  });
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('Xie Family site running at http://0.0.0.0:' + PORT);
});
