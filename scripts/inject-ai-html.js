/**
 * scripts/inject-ai-html.js — 把 AI 咨询悬浮球注入到所有 .html 文件（本地文件级注入）
 *
 * 背景：生产 Nginx 直接以静态文件方式提供 .html（不经过 node 的 server.js HTML 注入），
 * 且服务器 nginx 未编译 sub_filter 模块，无法在 Nginx 层做响应替换。
 * 因此把 `<link rel="stylesheet" href="/css/ai.css">` + `<script src="/js/ai-assistant.js" defer></script>`
 * 直接写进每个 .html 的 </body> 前。
 *
 * 幂等：已包含 /js/ai-assistant.js 的文件跳过；无 </body> 的跳过；黑名单跳过。
 * 用法：node scripts/inject-ai-html.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARK = '/js/ai-assistant.js';
const INJECT =
  '<link rel="stylesheet" href="/css/ai.css">\n' +
  '<script src="/js/ai-assistant.js" defer></script>\n';

// 黑名单：admin / recover 后台类页面不注入
const BLACKLIST = new Set(['admin.html', 'recover.html']);

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    let st;
    try { st = fs.statSync(fp); } catch (e) { continue; }
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git' || name === 'uploads') continue;
      walk(fp, out);
    } else if (name.endsWith('.html')) {
      out.push(fp);
    }
  }
  return out;
}

const files = walk(ROOT, []);
let injected = 0, skipped = 0;
for (const fp of files) {
  const base = path.basename(fp);
  if (BLACKLIST.has(base)) { skipped++; continue; }
  let html;
  try { html = fs.readFileSync(fp, 'utf-8'); } catch (e) { skipped++; continue; }
  if (html.indexOf(MARK) !== -1) { skipped++; continue; } // 已注入
  const m = html.search(/<\/body>/i);
  if (m === -1) { skipped++; continue; }
  const out = html.slice(0, m) + INJECT + '</body>' + html.slice(m + 7);
  fs.writeFileSync(fp, out, 'utf-8');
  console.log('[inject]', path.relative(ROOT, fp));
  injected++;
}
console.log(`完成：注入 ${injected} 个文件，跳过 ${skipped} 个。`);
