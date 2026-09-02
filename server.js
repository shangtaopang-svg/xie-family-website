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
      path.join(__dirname, 'scripts', 'build-ai-knowledge.js'),
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
// 管理员手机号仅以 SHA-256 哈希保存；可通过 .env 中的 ADMIN_PHONE_SHA256 覆盖。
// 默认值对应管理员当前登记手机号，不在前端页面或返回结果中暴露原号码。
const ADMIN_PHONE_SHA256 = process.env.ADMIN_PHONE_SHA256 || '01b878db43fe3a747ca56288dfd443c04fb7247772607cafe8bc088c2d408474';
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(__dirname, 'data', 'backups');
const ACCESS_AUDIT_PATH = path.join(DATA_DIR, 'access-audit.json');
const PUBLIC_ACCESS_COOKIE = 'xie_public_access_v2';
const PUBLIC_ACCESS_CONSENT_VERSION = 'privacy-v4-20260827';
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// 下册第62页已核定的伟中一家资料。伟中(707)的配偶是金小块，
// 张佳蕾是其子信科(829)的配偶，不能从子女条目反挂到伟中名下。
function repairKnownGenealogyFacts(list) {
  if (!Array.isArray(list)) return false;
  let changed = false;
  const person = list.find(item => String(item && item.id) === '707');
  if (person) {
    const birth = String(person.birth_date || '').trim();
    if (!birth || birth === '未详') {
      person.birth_date = '生一九五七年丁酉二月廿四日戌时';
      changed = true;
    }
    const spouse = String(person.spouse_record || '').trim();
    if (!spouse || spouse.includes('张佳蕾')) {
      person.spouse_record = '配上金村金小块：生一九六○年庚子二月初五日酉时';
      changed = true;
    }
  }
  const son = list.find(item => String(item && item.id) === '829');
  if (son && !String(son.spouse_record || '').trim()) {
    son.spouse_record = '配张佳蕾：大学生，农信总行任职，邑城人';
    changed = true;
  }

  // 上册核定关系：善尊之子道贤出继善美为嗣。
  // 921 是亲生侧出继记录，922 是善美名下的入继记录，不能把 921
  // 的亲生父亲误写成同名的善美（731/732）。
  const daoXianOut = list.find(item => String(item && item.id) === '921');
  if (daoXianOut && String(daoXianOut.name || '').trim() === '道贤') {
    if (String(daoXianOut.father_id) !== '730') {
      daoXianOut.father_id = 730;
      changed = true;
    }
    if (String(daoXianOut.adoption_status || '').trim() !== 'out') {
      daoXianOut.adoption_status = 'out';
      changed = true;
    }
    if (String(daoXianOut.adopt_note || '').trim() !== '善尊之子道贤，出继善美为嗣') {
      daoXianOut.adopt_note = '善尊之子道贤，出继善美为嗣';
      changed = true;
    }
  }
  const daoXianIn = list.find(item => String(item && item.id) === '922');
  if (daoXianIn && String(daoXianIn.name || '').trim() === '道贤') {
    if (String(daoXianIn.father_id) !== '732') {
      daoXianIn.father_id = 732;
      changed = true;
    }
    if (String(daoXianIn.adoption_status || '').trim() !== 'in') {
      daoXianIn.adoption_status = 'in';
      changed = true;
    }
    if (String(daoXianIn.adopt_note || '').trim() !== '善美之嗣道贤') {
      daoXianIn.adopt_note = '善美之嗣道贤';
      changed = true;
    }
  }
  return changed;
}

function repairCanonicalGenealogyFile() {
  const filePath = path.join(DATA_DIR, 'genealogy.json');
  if (!fs.existsSync(filePath)) return;
  try {
    const list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (repairKnownGenealogyFacts(list)) {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
      console.log('[genealogy] 已修复伟中/信科配偶与出生信息');
    }
  } catch (error) {
    console.warn('[genealogy] 确定性资料修复失败:', error.message);
  }
}

repairCanonicalGenealogyFile();

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
// 供 AI 服务复用同一套管理员会话；不把管理员手机号或令牌写入前端数据文件。
global.__xieAdminTokens = adminTokens;
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function normalizePhone(phone) {
  return String(phone || '').replace(/[\s-]/g, '').replace(/^\+86/, '');
}

function isAdminPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!/^1\d{10}$/.test(normalized)) return false;
  const actual = crypto.createHash('sha256').update(normalized).digest('hex');
  const expected = Buffer.from(ADMIN_PHONE_SHA256, 'utf8');
  const received = Buffer.from(actual, 'utf8');
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
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

// 入口验证成功后由服务端写入同源会话 Cookie。
// 族谱页只需要读取这个非敏感会话标记，不再依赖某个页面的 sessionStorage。
function sendPublicAccessJson(req, res, status, data, session) {
  if (session && status >= 200 && status < 300) {
    const expiresAt = Number(session.expiresAt) || (Date.now() + 12 * 3600e3);
    const maxAge = Math.max(60, Math.floor((expiresAt - Date.now()) / 1000));
    const cookieValue = encodeURIComponent(JSON.stringify({
      role: session.role,
      name: session.name || '',
      personId: session.personId || null,
      sessionId: session.sessionId || '',
      consentVersion: PUBLIC_ACCESS_CONSENT_VERSION,
      provider: session.provider || 'phone',
      expiresAt
    }));
    res.setHeader('Set-Cookie', PUBLIC_ACCESS_COOKIE + '=' + cookieValue + '; Max-Age=' + maxAge + '; Path=/; SameSite=Lax');
  }
  return sendJson(req, res, status, data);
}

function publicAuthConfig() {
  return {
    phone: Boolean(process.env.SMS_PROVIDER_URL && process.env.SMS_PROVIDER_KEY),
    wechat: Boolean(process.env.WECHAT_APPID && process.env.WECHAT_APPSECRET),
  };
}

function normalizeLineageName(value) {
  return String(value == null ? '' : value).replace(/[\s\u3000]+/g, '').trim();
}

function findMemberByLineage(name, fatherName, grandpaName) {
  const filePath = path.join(DATA_DIR, 'genealogy.json');
  if (!fs.existsSync(filePath)) return { error: '族谱数据暂未加载' };
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const recordsById = new Map(data.map(person => [String(person.id), person]));
  const targetName = normalizeLineageName(name);
  const targetFatherName = normalizeLineageName(fatherName);
  const targetGrandpaName = normalizeLineageName(grandpaName);

  // 族谱核验必须使用明确的结构化父系关系。除亲生父系外，
  // 仅补充谱中明确登记为“入继/承嗣”的父系，不能按姓名或文本模糊猜测。
  function parentIdsOf(person) {
    const ids = [];
    if (person && person.father_id != null && person.father_id !== '') ids.push(String(person.father_id));
    return ids;
  }

  function grandparentCandidatesOf(father) {
    const candidates = new Set();
    parentIdsOf(father).forEach(parentId => {
      const parent = recordsById.get(parentId);
      if (!parent) return;
      candidates.add(parentId);

      // 例如：世常（入继）记录挂在绍让名下。其子伟中的“祖父”
      // 既可按直系父系世常核验，也可按谱载承嗣父绍让核验。
      if (parent.adoption_status === 'in' && parent.adoption_adoptive_parent_id != null) {
        const adoptiveParentId = String(parent.adoption_adoptive_parent_id);
        if (recordsById.has(adoptiveParentId)) candidates.add(adoptiveParentId);
      }
    });
    return candidates;
  }

  const matches = data.filter(person => {
    if (normalizeLineageName(person.name) !== targetName || person.father_id == null || person.father_id === '') return false;
    const father = recordsById.get(String(person.father_id));
    if (!father || normalizeLineageName(father.name) !== targetFatherName) return false;
    return Array.from(grandparentCandidatesOf(father)).some(parentId => {
      const parent = recordsById.get(parentId);
      return parent && normalizeLineageName(parent.name) === targetGrandpaName;
    });
  });
  return { data, matches };
}

function appendAccessAudit(entry) {
  try {
    let rows = [];
    if (fs.existsSync(ACCESS_AUDIT_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(ACCESS_AUDIT_PATH, 'utf-8'));
      if (Array.isArray(parsed)) rows = parsed;
    }
    rows.push({ ...entry, createdAt: new Date().toISOString() });
    fs.writeFileSync(ACCESS_AUDIT_PATH, JSON.stringify(rows.slice(-2000), null, 2), 'utf-8');
  } catch (e) {
    console.warn('[access] 审计记录写入失败:', e.message);
  }
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
const AI_INJECT_BLACKLIST = new Set(['/admin.html', '/recover.html', '/entrance.html']);
const AI_INJECT_MARK = '/js/ai-assistant.js';
const PUBLIC_ACCESS_MARK = '/js/public-access-gate.js';
const PUBLIC_ACCESS_SCRIPT_VERSION = '20260830-access-mobile-01';
const PUBLIC_ACCESS_STYLE_VERSION = '20260830-access-mobile-01';
const MEDIA_PERFORMANCE_MARK = '/js/media-performance.js';
const MEDIA_PERFORMANCE_VERSION = '20260830-media-01';
const PWA_MARK = '/js/pwa.js';
const PWA_VERSION = '20260830-pwa-01';
function injectAiHtml(buf) {
  const source = buf.toString('utf-8');
  const html = source
    .replace(/(?:\.\.\/|\/)js\/public-access-gate\.js\?v=[^"'\s>]+/g, '/js/public-access-gate.js?v=' + PUBLIC_ACCESS_SCRIPT_VERSION)
    .replace(/(?:\.\.\/|\/)?css\/public-access-gate\.css(?:\?v=[^"'\s>]+)?/g, '/css/public-access-gate.css?v=' + PUBLIC_ACCESS_STYLE_VERSION)
    // CSS 使用 immutable 缓存；每次移动端公共样式调整都必须切换版本，避免手机继续使用旧导航布局。
    .replace(/(?:\.\.\/|\/)?css\/style\.css(?:\?v=[^"'\s>]+)?/g, '/css/style.css?v=20260901-entry-switch-06')
    .replace(/(?:\.\.\/|\/)?css\/ai\.css(?:\?v=[^"'\s>]+)?/g, '/css/ai.css?v=20260901-ai-contrast-01')
    .replace(/(?:\.\.\/|\/)?js\/ai-assistant\.js(?:\?v=[^"'\s>]+)?/g, '/js/ai-assistant.js?v=20260901-ai-contrast-01');
  const m = html.search(/<\/body>/i);
  if (m === -1) return buf; // 无 body（HTML 片段）则跳过
  const inject = [];
  if (html.indexOf(AI_INJECT_MARK) === -1) {
    inject.push('<link rel="stylesheet" href="/css/ai.css?v=20260901-ai-contrast-01">');
    inject.push('<script src="/js/ai-assistant.js?v=20260901-ai-contrast-01" defer></script>');
  }
  if (html.indexOf(PUBLIC_ACCESS_MARK) === -1) {
    inject.push('<link rel="stylesheet" href="/css/public-access-gate.css?v=' + PUBLIC_ACCESS_STYLE_VERSION + '">');
    inject.push('<script src="/js/public-access-gate.js?v=' + PUBLIC_ACCESS_SCRIPT_VERSION + '" defer></script>');
  }
  if (html.indexOf(MEDIA_PERFORMANCE_MARK) === -1) {
    inject.push('<script src="/js/media-performance.js?v=' + MEDIA_PERFORMANCE_VERSION + '" defer></script>');
  }
  if (html.indexOf(PWA_MARK) === -1) {
    inject.push('<script src="/js/pwa.js?v=' + PWA_VERSION + '" defer></script>');
  }
  if (!inject.length && html === source) return buf;
  return Buffer.from(html.slice(0, m) + inject.join('\n') + '\n</body>' + html.slice(m + 7), 'utf-8');
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

  // === API: Administrator phone bootstrap login ===
  // 这是管理员快捷入口；正式生产环境可在 .env 配置短信服务后再叠加验证码。
  if (url === '/api/admin/phone-login' && req.method === 'POST') {
    try {
      const body = JSON.parse(await collectBody(req));
      if (!isAdminPhone(body.phone)) {
        return sendJson(req, res, 401, { ok: false, error: '手机号未登记为管理员' });
      }
      const token = generateToken();
      adminTokens.add(token);
      appendAccessAudit({ role: 'admin', provider: 'phone' });
      const session = { role: 'admin', name: '管理员', sessionId: token, provider: 'phone', expiresAt: Date.now() + 12 * 3600e3 };
      return sendPublicAccessJson(req, res, 200, { ok: true, ...session, token, method: 'phone' }, session);
    } catch (e) {
      return sendJson(req, res, 400, { ok: false, error: '请求数据错误' });
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
        const result = findMemberByLineage(name, fatherName, grandpaName || '');
        if (result.error) return sendJson(req, res, 200, { verified: false, message: result.error });
        const { data, matches } = grandpaName
          ? result
          : (() => {
              const filePath = path.join(DATA_DIR, 'genealogy.json');
              const idMap = {};
              data.forEach(p => { idMap[p.id] = p.name; });
              return { data, matches: data.filter(p => p.name === name && p.father_id && idMap[parseInt(p.father_id)] === fatherName) };
            })();
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

  // === API: Public access consent and simplified clan verification ===
  if (url === '/api/public-auth/config' && req.method === 'GET') {
    return sendJson(req, res, 200, { ok: true, providers: publicAuthConfig() });
  }

  if (url === '/api/public-auth/visitor' && req.method === 'POST') {
    try {
      const body = JSON.parse(await collectBody(req));
      const provider = body.provider === 'phone' || body.provider === 'wechat' ? body.provider : 'visitor';
      appendAccessAudit({ role: 'visitor', provider, consentVersion: String(body.consentVersion || 'v1') });
      const session = { role: 'visitor', sessionId: generateToken(), provider, expiresAt: Date.now() + 12 * 3600e3 };
      return sendPublicAccessJson(req, res, 200, { ok: true, ...session }, session);
    } catch (e) {
      return sendJson(req, res, 400, { ok: false, message: '请求数据错误' });
    }
  }

  // === API: 普通访客手机号登录 ===
  // 当前不接入短信验证码服务时，仅建立短期访客会话并记录脱敏审计信息；
  // 不把手机号明文写入页面或族谱数据。配置短信服务后可在此端点叠加验证码校验。
  if (url === '/api/public-auth/visitor-login' && req.method === 'POST') {
    try {
      const body = JSON.parse(await collectBody(req));
      const phone = normalizePhone(body.phone);
      if (!/^1\d{10}$/.test(phone)) {
        return sendJson(req, res, 400, { ok: false, message: '请输入有效的11位手机号' });
      }
      const phoneHash = crypto.createHash('sha256').update(phone).digest('hex');
      appendAccessAudit({ role: 'visitor', provider: body.provider === 'wechat' ? 'wechat' : 'phone', phoneHash, consentVersion: String(body.consentVersion || 'v2') });
      const session = { role: 'visitor', sessionId: generateToken(), provider: body.provider === 'wechat' ? 'wechat' : 'phone', expiresAt: Date.now() + 12 * 3600e3 };
      return sendPublicAccessJson(req, res, 200, { ok: true, ...session }, session);
    } catch (e) {
      return sendJson(req, res, 400, { ok: false, message: '请求数据错误' });
    }
  }

  if (url === '/api/public-auth/verify-member' && req.method === 'POST') {
    try {
      const body = JSON.parse(await collectBody(req));
      const name = String(body.name || '').trim();
      const fatherName = String(body.fatherName || '').trim();
      const grandpaName = String(body.grandpaName || '').trim();
      if (!name || !fatherName || !grandpaName) {
        return sendJson(req, res, 200, { verified: false, message: '请完整填写本人、父亲和祖父姓名' });
      }
      const result = findMemberByLineage(name, fatherName, grandpaName);
      if (result.error) return sendJson(req, res, 200, { verified: false, message: result.error });
      if (!result.matches.length) return sendJson(req, res, 200, { verified: false, message: '未找到完全匹配的族谱记录，请核对姓名' });
      if (result.matches.length > 1) {
        return sendJson(req, res, 200, {
          verified: false,
          ambiguous: true,
          message: '存在多条相同父系记录，请联系管理员进一步核验',
          candidates: result.matches.map(p => ({ id: p.id, name: p.name, branch: p.branch, generation: p.generation }))
        });
      }
      const person = result.matches[0];
      appendAccessAudit({ role: 'clan', provider: body.provider || 'lineage', personId: person.id, consentVersion: String(body.consentVersion || 'v1') });
      const session = { role: 'clan', name: person.name, personId: person.id, provider: body.provider || 'lineage', expiresAt: Date.now() + 7 * 864e5 };
      return sendPublicAccessJson(req, res, 200, {
        verified: true,
        role: 'clan',
        message: '族人身份核验通过',
        personId: person.id,
        name: person.name,
        token: aiToken.signPersonToken(person),
        expiresAt: session.expiresAt
      }, session);
    } catch (e) {
      return sendJson(req, res, 400, { verified: false, message: '请求数据错误' });
    }
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
            if (module === 'genealogy') {
              repairKnownGenealogyFacts(parsed);
              parsed = normalizeLifeStatus(parsed);
            }
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
        if (module === 'genealogy') repairKnownGenealogyFacts(data);
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

  // === 已取消：家族成员公共只读接口 ===
  // 族人资料只通过族谱查询公开功能和管理后台使用，不再提供独立成员栏目接口。
  if (url === '/api/genealogy-members' && req.method === 'GET') {
    return sendJson(req, res, 410, { error: '家族成员页面已取消，请使用族谱查询' });
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

  // 静态路径先解码再解析，否则带中文目录名的管理后台会被错误回退到首页。
  // 同时使用 resolve + 目录边界校验，避免 URL 编码的路径穿越。
  const filePath = path.resolve(__dirname, '.' + decodedUrl);
  const ext = path.extname(filePath);

  if (filePath !== __dirname && !filePath.startsWith(__dirname + path.sep)) {
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
