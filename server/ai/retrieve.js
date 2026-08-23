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
 * 未验证访客可见的文档前缀（白名单）：
 * 公开村史/文化礼堂/宣传片/功德名录/村务消息。其余（bio 族谱生平、book1/2 宗谱扫描、
 * extract/analysis 族谱整理解析、zuren 族人介绍）均含族人个人信息 → 访客一律不可见。
 * 用白名单而非黑名单：新增文档类型默认即隐私。
 */
const PUBLIC_PREFIXES = ['seed', 'wenhua', 'juben', 'koubo', 'fang4', 'fangxq', 'jieqi', 'ronghe', 'merit', 'merit-ext', 'merit-fund', 'merit-soc', 'merit-tpl', 'news'];

// 世系链图谱：人名-人名-人名… 连字符两侧均为汉字（含 · / （ ）等），连续 4 段以上。
// 即使落在公开前缀里（如文化礼堂资料的「房派示意简图」wenhua:0015~0018），
// 因是族人世系数据，访客也不可见。markdown 表格线（|---|---|）、标题分隔（---##）、
// dB 电平（|-20~-15dB|）、英文连字符（edge-tts）两侧非汉字，不会命中。
const LINEAGE_CHART_RE = /(?:[一-鿿·／（()）、]{1,10}[-－]){4,}[一-鿿·／（()）、]{1,10}/;

/** 该文档未验证访客是否可见：公开前缀白名单内，且非世系链图谱。 */
function isPublicForVisitor(doc) {
  const p = String(doc.id).slice(0, String(doc.id).indexOf(':'));
  if (!PUBLIC_PREFIXES.includes(p)) return false;
  if (LINEAGE_CHART_RE.test(String(doc.text || '').replace(/\s/g, ''))) return false;
  return true;
}

// 谱书/PDF 派生文档前缀（上册/下册 PDF 及其分代整理/解析）。
// 上册/下册现在与交付版独立世系图同为原始依据。保留该过滤能力供特殊内部调用，
// 但正常世系问答不再传入 excludePdf，因此会同时检索交付版结构化记录和谱书原文。
const PDF_LINEAGE_PREFIXES = ['book1', 'book2', 'extract', 'analysis'];

function isPdfDerived(doc) {
  const p = String(doc.id).slice(0, String(doc.id).indexOf(':'));
  return PDF_LINEAGE_PREFIXES.includes(p);
}

/**
 * @param {string} query
 * @param {{top?:number, maxChars?:number, publicOnly?:boolean, excludePdf?:boolean}} opts
 *   publicOnly=true：只返回访客可见文档（公开前缀白名单内，且非世系链图谱），
 *   用于未验证访客——保证其 AI 上下文不含任何族人的个人信息（含世系脉络）。
 *   excludePdf=true：仅在特殊内部调用时剔除 PDF 文档；正常世系问答不使用该选项。
 * @returns {{id:string, ref:string, text:string, score:number}[]}
 */
function search(query, opts) {
  const data = ensureLoaded();
  const q = String(query || '').trim();
  if (!q) return [];
  const top = (opts && opts.top) || 4;
  const maxChars = (opts && opts.maxChars) || 3000;
  const publicOnly = !!(opts && opts.publicOnly);
  const excludePdf = !!(opts && opts.excludePdf);

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
    .filter(r => !publicOnly || isPublicForVisitor(r.doc))
    .filter(r => !excludePdf || !isPdfDerived(r.doc))
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

module.exports = { search, ensureLoaded, isPdfDerived, PDF_LINEAGE_PREFIXES };
