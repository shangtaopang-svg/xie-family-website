/**
 * server/ai/delivery-source.js
 *
 * 交付版独立世系图的唯一结构化读取入口。
 * 交付页面使用 data.js（window.GENEALOGY_DATA = [...]），服务端不执行页面脚本，
 * 只安全提取其中的 JSON 数组并按文件 mtime 自动重载。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', '..', '交付_下枫槎谢氏世系图', 'data.js');

let data = [];
let mtimeMs = -1;

function parseDataJs(text) {
  const match = String(text || '').match(/window\.GENEALOGY_DATA\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/);
  if (!match) throw new Error('未找到 window.GENEALOGY_DATA 数组');
  const parsed = JSON.parse(match[1]);
  if (!Array.isArray(parsed)) throw new Error('交付版世系数据不是数组');
  return parsed;
}

function ensureLoaded() {
  let stat = null;
  try { stat = fs.statSync(DATA_FILE); } catch (e) { stat = null; }
  const nextMtime = stat ? stat.mtimeMs : -1;
  if (nextMtime === mtimeMs) return data;
  mtimeMs = nextMtime;
  if (!stat) {
    data = [];
    return data;
  }
  try {
    data = parseDataJs(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    data = [];
    console.warn('[delivery-source] 读取交付版世系数据失败:', e.message);
  }
  return data;
}

function getFilePath() { return DATA_FILE; }
function getMtimeMs() { ensureLoaded(); return mtimeMs; }

module.exports = { ensureLoaded, getFilePath, getMtimeMs, parseDataJs };
