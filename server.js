const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = parseInt(process.env.PORT, 10) || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');

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
        const body = await collectBody(req);
        // Validate it's a valid JSON array (or object)
        const data = JSON.parse(body);
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

  // === Static file serving ===
  if (url === '/') url = '/index.html';

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
          return gzipSend(req, res, 200, { 'Content-Type': 'text/html;charset=utf-8' }, data2);
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
