/**
 * server/ai/retrieve.js
 * 文献检索：加载 data/ai/knowledge.json（mtime 检测自动重载），
 * 按「中文二元组倒排」计算重叠分，另加：
 *   - 命中站内人名 → 对应生平块 +50
 *   - 命中术语词（字辈/始祖/村史等）→ 种子文档 +30
 * 返回 top K 检索块，总字符受控，供注入大模型上下文。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const KB_FILE = path.join(__dirname, '..', '..', 'data', 'ai', 'knowledge.json');

let kb = null;
let kbMtime = -1;

function ensureLoaded() {
  let stat = null;
  try { stat = fs.statSync(KB_FILE); } catch (e) { stat = null; }
  const mtime = stat ? stat.mtimeMs : -1;
  if (kb && mtime === kbMtime) return kb;
  kbMtime = mtime;
  try { kb = JSON.parse(fs.readFileSync(KB_FILE, 'utf-8')); }
  catch (e) { kb = { nameIndex: {}, terms: {}, documents: [], bigramIndex: {} }; }
  return kb;
}

function bigramsOf(text) {
  const clean = String(text).replace(/[\s\p{P}\p{S}]/gu, '');
  const set = new Set();
  for (let i = 0; i < clean.length - 1; i++) set.add(clean.slice(i, i + 2));
  return set;
}

/**
 * @param {string} query
 * @param {{top?:number, maxChars?:number}} opts
 * @returns {{id:string, ref:string, text:string, score:number}[]}
 */
function search(query, opts) {
  const data = ensureLoaded();
  const q = String(query || '').trim();
  if (!q) return [];
  const top = (opts && opts.top) || 4;
  const maxChars = (opts && opts.maxChars) || 3000;

  const qBigrams = bigramsOf(q);
  const scores = new Map(); // docId -> score

  // 1) 二元组重叠分
  for (const bg of qBigrams) {
    const ids = data.bigramIndex[bg] || [];
    for (const id of ids) scores.set(id, (scores.get(id) || 0) + 1);
  }

  // 2) 人名命中 → 生平块加权
  if (data.nameIndex) {
    for (const name of Object.keys(data.nameIndex)) {
      if (name.length >= 2 && q.includes(name)) {
        for (const rec of data.nameIndex[name]) {
          const bioId = 'bio:' + rec.id;
          scores.set(bioId, (scores.get(bioId) || 0) + 50);
        }
      }
    }
  }

  // 3) 术语命中 → 种子文档加权
  if (data.terms) {
    for (const term of Object.keys(data.terms)) {
      if (q.includes(term)) {
        for (const doc of data.documents) {
          if (doc.id.indexOf('seed:') === 0) {
            scores.set(doc.id, (scores.get(doc.id) || 0) + 30);
          }
        }
      }
    }
  }

  const byId = new Map(data.documents.map(d => [d.id, d]));
  const ranked = [...scores.entries()]
    .map(([id, score]) => ({ id, score, doc: byId.get(id) }))
    .filter(r => r.doc)
    .sort((a, b) => b.score - a.score);

  const out = [];
  let total = 0;
  for (const r of ranked) {
    if (out.length >= top) break;
    if (total + r.doc.text.length > maxChars) break;
    out.push({ id: r.id, ref: r.doc.ref, text: r.doc.text, score: r.score });
    total += r.doc.text.length;
  }
  return out;
}

module.exports = { search, ensureLoaded };
