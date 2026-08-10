/**
 * scripts/build-ai-knowledge.js
 * 构建 AI 咨询知识库 → data/ai/knowledge.json（gitignored）。
 * 幂等，可重复运行：node scripts/build-ai-knowledge.js
 * 亦可被 server.js 启动时调用（knowledge.json 缺失或过期则自动重建）。
 *
 * 输入：
 *   data/genealogy.json                → nameIndex + 生平检索块
 *   上册_竖排提取.txt / 下册_竖排提取.txt → 按"第N页"分块
 *   data/parsed_entries.json           → 谱名条目索引（出继/入赘/分支）
 *   data/genealogy_book_extract.txt、data/genealogy_analysis.txt → 附加文献块
 *   scripts/ai-seeds.js                → 村史/字辈/术语种子
 */
'use strict';
const fs = require('fs');
const path = require('path');
const seeds = require('./ai-seeds.js');

const ROOT = path.resolve(__dirname, '..');

function readJson(rel) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf-8')); }
  catch (e) { console.warn('[build-ai] 读取失败(跳过):', rel, e.message); return null; }
}
function readText(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf-8'); }
  catch (e) { console.warn('[build-ai] 读取失败(跳过):', rel, e.message); return null; }
}

/** 按段落分块，单块 ≤ maxLen，超出则带 overlap 硬切 */
function chunkText(text, maxLen, overlap) {
  const paras = String(text).split(/\n+/).map(s => s.trim()).filter(s => s.length > 0);
  const chunks = [];
  let cur = '';
  for (const para of paras) {
    if ((cur + para).length <= maxLen) {
      cur += (cur ? '\n' : '') + para;
    } else {
      if (cur) chunks.push(cur);
      cur = para;
      while (cur.length > maxLen) {
        chunks.push(cur.slice(0, maxLen));
        cur = cur.slice(maxLen - overlap);
      }
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

/** 上册/下册按"===== 第N页 =====" 分页后分块，ref 保留页码 */
function chunkBook(text, bookName, bookLabel, maxLen, overlap) {
  const pageRe = /=====\s*第(\d+)页\s*=====/g;
  const pages = [];
  let m, curPage = 0, lastIdx = 0;
  while ((m = pageRe.exec(text))) {
    const seg = text.slice(lastIdx, m.index);
    if (seg.trim()) pages.push({ page: curPage, text: seg });
    curPage = parseInt(m[1], 10);
    lastIdx = pageRe.lastIndex;
  }
  const tail = text.slice(lastIdx);
  if (tail.trim()) pages.push({ page: curPage, text: tail });

  const chunks = [];
  let cur = '', curPages = [];
  for (const pg of pages) {
    const paras = pg.text.split(/\n+/).map(s => s.trim()).filter(Boolean);
    for (const para of paras) {
      if ((cur + para).length <= maxLen) {
        cur += (cur ? '\n' : '') + para;
        if (curPages[curPages.length - 1] !== pg.page) curPages.push(pg.page);
      } else {
        if (cur) chunks.push({ text: cur, pages: curPages });
        cur = para; curPages = [pg.page];
        while (cur.length > maxLen) {
          chunks.push({ text: cur.slice(0, maxLen), pages: [pg.page] });
          cur = cur.slice(maxLen - overlap);
        }
      }
    }
  }
  if (cur) chunks.push({ text: cur, pages: curPages });
  return chunks.map((c, i) => ({
    id: bookName + ':' + String(i).padStart(4, '0'),
    ref: bookLabel + ' 第' + c.pages.join('、') + '页',
    text: c.text
  }));
}

/** 中文二元组集合（去空白/标点/符号） */
function bigramsOf(text) {
  const clean = String(text).replace(/[\s\p{P}\p{S}]/gu, '');
  const set = new Set();
  for (let i = 0; i < clean.length - 1; i++) set.add(clean.slice(i, i + 2));
  return set;
}

/** 构建知识库；返回统计信息 */
function buildKnowledge() {
  const genealogy = readJson('data/genealogy.json') || [];
  const parsedEntries = readJson('data/parsed_entries.json') || [];
  const book1Text = readText('上册_竖排提取.txt');
  const book2Text = readText('下册_竖排提取.txt');
  const extractTxt = readText('data/genealogy_book_extract.txt');
  const analysisTxt = readText('data/genealogy_analysis.txt');

  const nameIndex = {};
  const documents = [];
  let bioCount = 0;

  for (const p of genealogy) {
    if (!p.name) continue;
    (nameIndex[p.name] = nameIndex[p.name] || []).push({
      id: p.id, branch: p.branch, generation: p.generation, generation_num: p.generation_num
    });
    if (p.biography && String(p.biography).trim()) {
      bioCount++;
      documents.push({ id: 'bio:' + p.id, ref: '族谱·' + p.name, text: String(p.biography).trim() });
    }
  }

  // 谱名条目索引（出继/入赘/分支），只收录像人名的字段
  const entryIndex = {};
  let entryCount = 0;
  for (const e of parsedEntries) {
    const n = e && e.name;
    if (typeof n !== 'string') continue;
    const nn = n.trim();
    if (nn.length < 2 || nn.length > 10) continue;
    if (/[，。、；：""''《》（）0-9\s]/.test(nn)) continue;
    (entryIndex[nn] = entryIndex[nn] || []).push({
      generation: e.generation, branch: e.branch, line: e.line,
      adopted_in: e.adopted_in, adopted_out: e.adopted_out, ruzhui: e.ruzhui,
      ref: '谱书'
    });
    entryCount++;
  }

  // 上册/下册分块
  const MAX = 700, OVLP = 80;
  if (book1Text) documents.push(...chunkBook(book1Text, 'book1', '上册', MAX, OVLP));
  if (book2Text) documents.push(...chunkBook(book2Text, 'book2', '下册', MAX, OVLP));

  // 附加文献
  if (extractTxt) {
    chunkText(extractTxt, MAX, OVLP).forEach((t, i) =>
      documents.push({ id: 'extract:' + String(i).padStart(4, '0'), ref: '族谱书·分代整理', text: t }));
  }
  if (analysisTxt) {
    chunkText(analysisTxt, MAX, OVLP).forEach((t, i) =>
      documents.push({ id: 'analysis:' + String(i).padStart(4, '0'), ref: '族谱书·解析', text: t }));
  }

  // 村史种子
  seeds.villageHistory.forEach((t, i) =>
    documents.push({ id: 'seed:hist' + i, ref: '村史', text: t }));

  // 字辈种子
  documents.push({
    id: 'seed:zibei',
    ref: '字辈诗',
    text: '吾族行第字辈自第十九世起，依次为：' + seeds.ZIBEI_CHARS.join('、') + '，凡十六字，周而复始。'
      + Object.entries(seeds.zibeiByGen).map(([g, c]) => g + '世=' + c).join('；')
      + '。今已传至"天"字辈。'
  });

  // 二元组倒排索引
  const bigramIndex = {};
  for (const doc of documents) {
    for (const bg of bigramsOf(doc.text)) {
      (bigramIndex[bg] = bigramIndex[bg] || []).push(doc.id);
    }
  }
  // 去重
  for (const k in bigramIndex) bigramIndex[k] = [...new Set(bigramIndex[k])];

  const knowledge = {
    schemaVersion: 1,
    builtAt: new Date().toISOString(),
    source: {
      genealogyCount: genealogy.length,
      bioCount,
      entryCount,
      book1Chars: book1Text ? book1Text.length : 0,
      book2Chars: book2Text ? book2Text.length : 0
    },
    nameIndex,
    entryIndex,
    terms: seeds.terms,
    documents,
    bigramIndex
  };

  const outPath = path.join(ROOT, 'data', 'ai', 'knowledge.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(knowledge));

  return {
    outPath,
    written: true,
    stats: {
      persons: genealogy.length,
      bioCount,
      entryCount,
      documents: documents.length,
      bigrams: Object.keys(bigramIndex).length,
      sizeKB: Math.round(JSON.stringify(knowledge).length / 1024)
    }
  };
}

// 直接运行：node scripts/build-ai-knowledge.js
if (require.main === module) {
  const res = buildKnowledge();
  console.log('[build-ai] 知识库已生成:', res.outPath);
  console.log('[build-ai] 统计:', JSON.stringify(res.stats));
}

module.exports = { buildKnowledge };
