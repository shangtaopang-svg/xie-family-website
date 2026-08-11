/**
 * scripts/inject-ai-html.js — 把 AI 咨询悬浮球注入到所有 .html 文件（本地文件级注入）
 *
 * 背景：生产 Nginx 直接以静态文件方式提供 .html（不经过 node 的 server.js HTML 注入），
 * 且服务器 nginx 未编译 sub_filter 模块，无法在 Nginx 层做响应替换。
 * 因此把 `<link rel="stylesheet" href="/css/ai.css">` + `<script src="/js/ai-assistant.js" defer></script>`
 * 直接写进每个 .html 的 </body> 前。
 *
 * 幂等：已包含 js/ai-assistant.js?v=当前版本 的文件跳过；无 </body> 的跳过；黑名单跳过。
 * 版本号：改样式/脚本后把 VERSION 数字 +1，强制手机端浏览器/SW 拉新资源（用户遇到旧缓存）。
 * 迁移：旧的无版本号标签 / 旧的任意版本号标签(?v=N) 都会自动升级为当前版本号，避免重复注入。
 * 用法：node scripts/inject-ai-html.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VERSION = 17;
const MARK = 'js/ai-assistant.js?v=' + VERSION;
const NEW_LINK = 'href="/css/ai.css?v=' + VERSION + '"';
const NEW_SCRIPT = 'src="/js/ai-assistant.js?v=' + VERSION + '"';
const INJECT =
  '<link rel="stylesheet" ' + NEW_LINK + '>\n' +
  '<script ' + NEW_SCRIPT + ' defer></script>\n';

// 匹配任意版本号或无版本号的 AI 标签（用于迁移升级）
const RE_LINK = /href="\/css\/ai\.css(?:\?v=[0-9]+)?"/g;
const RE_SCRIPT = /src="\/js\/ai-assistant\.js(?:\?v=[0-9]+)?"/g;

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
let injected = 0, migrated = 0, skipped = 0;
for (const fp of files) {
  const base = path.basename(fp);
  if (BLACKLIST.has(base)) { skipped++; continue; }
  let html;
  try { html = fs.readFileSync(fp, 'utf-8'); } catch (e) { skipped++; continue; }
  if (html.indexOf(MARK) !== -1) { skipped++; continue; } // 已是当前版本
  // 迁移：任意旧版本号 / 无版本号标签 → 升级为当前版本
  const up = html.replace(RE_LINK, NEW_LINK).replace(RE_SCRIPT, NEW_SCRIPT);
  if (up !== html) {
    fs.writeFileSync(fp, up, 'utf-8');
    console.log('[migrate]', path.relative(ROOT, fp));
    migrated++;
    continue;
  }
  const m = html.search(/<\/body>/i);
  if (m === -1) { skipped++; continue; }
  const out = html.slice(0, m) + INJECT + '</body>' + html.slice(m + 7);
  fs.writeFileSync(fp, out, 'utf-8');
  console.log('[inject]', path.relative(ROOT, fp));
  injected++;
}
console.log(`完成：注入 ${injected} 个，迁移 ${migrated} 个，跳过 ${skipped} 个。`);
