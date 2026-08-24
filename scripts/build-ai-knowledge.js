/**
 * scripts/build-ai-knowledge.js
 * 构建 AI 咨询知识库 → data/ai/knowledge.json（gitignored）。
 * 幂等，可重复运行：node scripts/build-ai-knowledge.js
 * 亦可被 server.js 启动时调用（knowledge.json 缺失或过期则自动重建）。
 *
 * 输入：
 *   data/genealogy.json                 → 族谱管理后台 canonical 人物/世系数据（唯一结构化来源）
 *   上册_竖排提取.txt / 下册_竖排提取.txt → 按"第N页"分块
 *   data/parsed_entries.json           → 谱名条目索引（出继/入赘/分支）
 *   data/genealogy_book_extract.txt、data/genealogy_analysis.txt → 附加文献块
 *   scripts/ai-seeds.js                → 村史/字辈/术语种子
 */
'use strict';
const fs = require('fs');
const path = require('path');
const seeds = require('./ai-seeds.js');
const deliverySource = require('../server/ai/delivery-source.js');

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
  const genealogy = deliverySource.ensureLoaded();
  const parsedEntries = readJson('data/parsed_entries.json') || [];
  const book1Text = readText('上册_竖排提取.txt');
  const book2Text = readText('下册_竖排提取.txt');
  const extractTxt = readText('data/genealogy_book_extract.txt');
  const analysisTxt = readText('data/genealogy_analysis.txt');
  const wenhuaTxt = readText('data/wenhua_litang.txt'); // 跃龙下枫槎文化礼堂资料（用户 2026-08-11 提供）

  const nameIndex = {};
  const documents = [];
  let bioCount = 0;

  const byId = new Map(genealogy.map(p => [String(p.id), p]));
  for (const p of genealogy) {
    if (!p.name) continue;
    (nameIndex[p.name] = nameIndex[p.name] || []).push({
      id: p.id, branch: p.branch, generation: p.generation, generation_num: p.generation_num,
       source: '族谱管理后台'
    });
    const father = p.father_id !== undefined && p.father_id !== null
      ? byId.get(String(p.father_id))
      : null;
    const details = [
      '人物：' + p.name,
      p.generation_num !== undefined && p.generation_num !== null && p.generation_num !== '' ? '世次：第' + p.generation_num + '世' : '',
      p.branch ? '支系：' + p.branch : '',
      father ? '父亲：' + father.name : '',
      p.gender ? '性别：' + p.gender : '',
      p.is_alive === true || p.is_alive === '是' ? '状态：在世' : (p.is_alive === false || p.is_alive === '否' ? '状态：已故' : ''),
      p.courtesy_name ? '字/号：' + p.courtesy_name : '',
      p.birth_date ? '出生：' + p.birth_date : '',
      p.death_date ? '卒年/卒葬：' + p.death_date : '',
      p.burial_place ? '葬地：' + p.burial_place : '',
      p.spouse_ids ? '配偶：' + p.spouse_ids : '',
      p.spouse_record ? '配偶详细谱载：' + p.spouse_record : '',
      p.source_pages ? '出处页码：' + p.source_pages : '',
      p.vital_source ? '生卒依据：' + p.vital_source : '',
      p.biography ? '谱注：' + String(p.biography).trim() : ''
    ].filter(Boolean).join('；');
    if (details) {
      bioCount++;
      documents.push({ id: 'bio:' + p.id, ref: '交付版独立世系图·' + p.name, text: details });
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
  // 文化礼堂资料（跃龙下枫槎村综合资料）
  if (wenhuaTxt) {
    chunkText(wenhuaTxt, MAX, OVLP).forEach((t, i) =>
      documents.push({ id: 'wenhua:' + String(i).padStart(4, '0'), ref: '文化礼堂资料', text: t }));
  }

  // 全量文本资料：族人介绍 / 圆谱纪录片脚本 / 宣传片文案与方案 / 村宣传片口播稿
  const extraTxtSources = [
    { file: 'data/族人介绍.txt',                    prefix: 'zuren',  ref: '族人介绍' },
    { file: 'data/脚本.txt',                        prefix: 'juben',  ref: '圆谱纪录片脚本' },
    { file: '宣传片口播稿_圆谱版.txt',               prefix: 'koubo',  ref: '圆谱宣传片口播稿' },
    { file: '宣传片拍摄方案_下枫槎村_4分钟.md',      prefix: 'fang4',  ref: '村宣传片方案·4分钟' },
    { file: '宣传片拍摄制作方案_下枫槎村_详细版.md', prefix: 'fangxq', ref: '村宣传片制作方案·详细版' },
    { file: '宣传片文案_接地气版.md',                prefix: 'jieqi',  ref: '村宣传片文案·接地气版' },
    { file: '宣传片文案_融合版.md',                  prefix: 'ronghe', ref: '村宣传片文案·融合版' },
  ];
  for (const s of extraTxtSources) {
    const t = readText(s.file);
    if (!t) continue;
    chunkText(t, MAX, OVLP).forEach((tx, i) =>
      documents.push({ id: s.prefix + ':' + String(i).padStart(4, '0'), ref: s.ref, text: tx }));
  }

  // 功德/捐款名录（merit*.json，五类：修谱/外迁宗亲/族人筹款/社会助款/修祠堂）
  const meritFiles = [
    { file: 'data/merit.json',             prefix: 'merit',     ref: '功德名录' },
    { file: 'data/merit-external.json',    prefix: 'merit-ext', ref: '功德名录·外迁宗亲' },
    { file: 'data/merit-fundraising.json', prefix: 'merit-fund',ref: '功德名录·族人筹款' },
    { file: 'data/merit-social.json',      prefix: 'merit-soc', ref: '功德名录·社会助款' },
    { file: 'data/merit-temple.json',      prefix: 'merit-tpl', ref: '功德名录·修祠堂' },
  ];
  for (const mf of meritFiles) {
    const arr = readJson(mf.file);
    if (!Array.isArray(arr) || !arr.length) continue;
    const lines = [];
    for (const r of arr) {
      const name = (r.name || r.person || '').toString().trim();
      if (!name) continue;
      const amt = (r.amount || r.money || r.donation || '').toString().trim();
      const cat = (r.category || r.type || '').toString().trim();
      const note = [r.biography, r.tribute, r.note, r.remark, r.project]
        .filter(v => v && v.toString().trim())
        .map(v => v.toString().replace(/\s+/g, '')).join('；');
      let s = '功德名录（' + (cat || mf.ref) + '）：' + name;
      if (amt) s += '，捐资' + amt;
      if (note) s += '，' + note;
      lines.push(s);
    }
    if (!lines.length) continue;
    chunkText(lines.join('。\n'), MAX, OVLP).forEach((tx, i) =>
      documents.push({ id: mf.prefix + ':' + String(i).padStart(4, '0'), ref: mf.ref, text: tx }));
  }

  // 村务消息（news.json）
  const newsArr = readJson('data/news.json');
  if (Array.isArray(newsArr)) {
    newsArr.forEach((n, i) => {
      const title = (n.title || '').toString().trim();
      const date = (n.date || '').toString().trim();
      const content = (n.content || '').toString().trim();
      if (!content) return;
      const text = (title ? title + '。' : '') + (date ? '（发布于' + date + '）' : '') + content;
      chunkText(text, MAX, OVLP).forEach((tx, j) =>
        documents.push({ id: 'news:' + String(i).padStart(3, '0') + ':' + String(j).padStart(3, '0'), ref: '村务消息', text: tx }));
    });
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
      canonicalCount: genealogy.length,
      structuredSource: 'data/genealogy.json（交付版基线 + 族谱管理后台最终保存数据）',
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
