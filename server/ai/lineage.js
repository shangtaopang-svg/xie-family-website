/**
 * server/ai/lineage.js
 * 确定性世系引擎：所有世系/辈分/亲属结论完全由 data/genealogy.json 的 father_id 链计算得出，
 * 不经过大模型 —— 从根上杜绝"编造族谱数据"。
 *
 * 数据常驻内存（Map<id,Person> + Map<name,id[]>），每次查询前按 mtime 检测，
 * 管理后台修改族谱后即时生效。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'genealogy.json');

let byId = null;
let byName = null;
let mtimeMs = -1;

function ensureLoaded() {
  let stat = null;
  try { stat = fs.statSync(DATA_FILE); } catch (e) { stat = null; }
  const mtime = stat ? stat.mtimeMs : -1;
  if (byId && mtime === mtimeMs) return;
  mtimeMs = mtime;
  let list = [];
  try { list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); } catch (e) { list = []; }
  byId = new Map();
  byName = new Map();
  for (const p of list) {
    byId.set(Number(p.id), p);
    if (p.name) {
      (byName.get(p.name) || byName.set(p.name, []).get(p.name)).push(p);
    }
  }
}

function getPerson(id) { ensureLoaded(); return byId.get(Number(id)) || null; }

function getPeopleByName(name) { ensureLoaded(); return byName.get(name) || []; }

/** 沿 father_id 上溯祖先链（含自己？不含），返回 祖先(远)→近；带自引用/环保护 */
function getAncestorList(personId, includeSelf, maxDepth) {
  ensureLoaded();
  const out = [];
  let cur = byId.get(Number(personId));
  const seen = new Set();
  let depth = 0;
  while (cur) {
    if (seen.has(cur.id)) break; // 环路保护（如"万"的 father_id 指向自己）
    seen.add(cur.id);
    out.push(cur);
    depth++;
    if (maxDepth && depth >= maxDepth) break;
    if (!cur.father_id || Number(cur.father_id) === Number(cur.id)) break;
    cur = byId.get(Number(cur.father_id));
  }
  return includeSelf ? out : out.slice(1);
}

/** 后代按代 BFS（father_id 树），返回 [[第1代], [第2代], ...] */
function getDescendantLevels(personId, depth) {
  ensureLoaded();
  const levels = [];
  let frontier = [Number(personId)];
  const visited = new Set(frontier);
  for (let d = 0; d < depth; d++) {
    const next = [];
    for (const id of frontier) {
      const p = byId.get(id);
      if (!p) continue;
      for (const [cid, cp] of byId) {
        if (cp.father_id && Number(cp.father_id) === Number(id) && !visited.has(cid)) {
          visited.add(cid);
          next.push(cp);
        }
      }
    }
    if (!next.length) break;
    levels.push(next);
    frontier = next.map(p => Number(p.id));
  }
  return levels;
}

/** 同辈：与本人 generation_num 相同的人（有限条） */
function getSameGeneration(personId, limit) {
  ensureLoaded();
  const self = byId.get(Number(personId));
  if (!self || self.generation_num === undefined || self.generation_num === null) return { list: [] };
  const g = self.generation_num;
  const list = [];
  for (const p of byId.values()) {
    if (Number(p.id) === Number(personId)) continue;
    if (p.generation_num === g) list.push(p);
  }
  return { list: list.slice(0, limit || 20), total: list.length };
}

/** a 是否为 b 的直系祖先 */
function isAncestorOf(aId, bId) {
  return getAncestorList(bId, false).some(p => Number(p.id) === Number(aId));
}

/** 简单的亲属关系描述 */
function kinshipText(aId, bId) {
  ensureLoaded();
  const a = byId.get(Number(aId));
  const b = byId.get(Number(bId));
  if (!a || !b) return '未找到相关记录';
  if (Number(a.id) === Number(b.id)) return '是同一个人';

  const aAnc = getAncestorList(aId, false); // a 的祖先（远→近）
  const bAnc = getAncestorList(bId, false);

  if (aAnc.some(p => Number(p.id) === Number(b.id))) {
    const n = aAnc.findIndex(p => Number(p.id) === Number(b.id)) + 1; // b 是 a 的第 n 代祖
    return `${a.name} 是 ${b.name} 的第 ${n} 代直系后代`;
  }
  if (bAnc.some(p => Number(p.id) === Number(a.id))) {
    const n = bAnc.findIndex(p => Number(p.id) === Number(a.id)) + 1;
    return `${b.name} 是 ${a.name} 的第 ${n} 代直系后代`;
  }
  // 共同祖先
  const aSet = new Set(aAnc.map(p => Number(p.id)));
  const bSet = new Set(bAnc.map(p => Number(p.id)));
  let lca = null, la = -1, lb = -1;
  for (let i = aAnc.length - 1; i >= 0; i--) {
    if (bSet.has(Number(aAnc[i].id))) { lca = aAnc[i]; la = i; break; }
  }
  if (!lca) return `${a.name} 与 ${b.name} 未查到共同祖先`;
  lb = bAnc.findIndex(p => Number(p.id) === Number(lca.id));
  const da = la + 1, db = lb + 1; // 各自离 LCA 的代数
  const lcaName = lca.name || ('ID ' + lca.id);
  if (da === 1 && db === 1) return `${a.name} 与 ${b.name} 是亲兄弟/同父关系（共同父亲：${lcaName}）`;
  if (da === 2 && db === 2) return `${a.name} 与 ${b.name} 是堂兄弟/堂亲（共同祖父：${lcaName}）`;
  return `${a.name} 与 ${b.name} 是共祖的族人，共同祖先为 ${lcaName}（${a.name} 距其 ${da} 代、${b.name} 距其 ${db} 代）`;
}

/** 代数通俗表述：正数→「第N世」（族谱通用说法）；负数（远古炎帝世系）→「远古世系」；空→「未知」 */
function generationLabel(g) {
  if (g === undefined || g === null || g === '') return '未知';
  const n = Number(g);
  if (n >= 1) return '第' + n + '世';
  if (n < 0) return '远古世系';
  return String(g);
}

/** 人名字段：代数/分支（注：genealogy 的 generation 字段是 CSV 世代号，不是字辈字，故不显示） */
function describePerson(p) {
  const parts = [p.name];
  const g = Number(p.generation_num);
  // 正数世次 → 「第N世」；负数（远古炎帝世系）不显示代数，branch 已标明「炎帝世系」
  if (p.generation_num !== undefined && p.generation_num !== null && p.generation_num !== '' && g >= 1) {
    parts.push('第' + g + '世');
  }
  if (p.branch && p.branch !== '—' && p.branch !== '') parts.push(p.branch);
  return parts.join(' · ');
}

/** 直系世系链排版：1世(最远) → ... → 您 */
function formatChain(chain, selfId) {
  const lines = [];
  chain.forEach((p, i) => {
    const isSelf = Number(p.id) === Number(selfId);
    lines.push(`${i + 1}世  ${describePerson(p)}${isSelf ? '  ← 您' : ''}`);
  });
  return lines.join('\n');
}

/** 直系世系（含自己，向上最多 total-1 代，即共 total 世） */
function getDirectChain(selfId, total) {
  const anc = getAncestorList(selfId, true, total); // 含自己，最多 total 人
  return anc.reverse(); // 最远→自己
}

/* 直接亲属称谓 → 上溯代数（长辈，如 太爷爷=曾祖=第3代祖）或下溯代数（晚辈） */
const KINSHIP_ANCESTOR = [
  { re: /高祖父|高祖|太太爷爷/, label: '高祖', gen: 4 },
  { re: /曾祖父|曾祖|太爷爷/, label: '太爷爷（曾祖父）', gen: 3 },
  { re: /爷爷|祖父|阿公/, label: '爷爷（祖父）', gen: 2 },
  { re: /父亲|爸爸|爹爹|爹|家父/, label: '父亲', gen: 1 },
];
const KINSHIP_DESCENDANT = [
  { re: /曾孙|重孙/, label: '曾孙', gen: 3 },
  { re: /孙子|孙儿/, label: '孙子', gen: 2 },
  { re: /儿子/, label: '儿子', gen: 1 },
];

/** 主回答入口：根据提问 + 本人 id 生成确定性文本 */
function answerLineage(query, selfId) {
  ensureLoaded();
  const q = String(query || '').trim();
  const self = byId.get(Number(selfId));
  if (!self) return '未找到您的族谱记录，请重新验证身份。';

  // 尝试提取问题中的指名人物（优先 ≥2 字人名，找不到再匹配单字名，如「衡」）
  let target = self;
  if (!/我/.test(q)) {
    for (const minLen of [2, 1]) {
      for (const n of byName.keys()) {
        if (n.length >= minLen && q.includes(n)) {
          const cand = byName.get(n)[0];
          if (cand) { target = cand; break; }
        }
      }
      if (target !== self) break;
    }
  }

  const tid = Number(target.id);

  if (/第几代|第几世/.test(q)) {
    const g = target.generation_num;
    const isAncient = g !== undefined && g !== null && g !== '' && Number(g) < 0;
    const genTxt = isAncient
      ? `${target.name} 属远古世系（比始祖早 ${-Number(g)} 世）。`
      : (g === undefined || g === null || g === '' ? `${target.name} 代数未录入。` : `${target.name} ${generationLabel(g)}。`);
    // 同时问"同辈/辈分"时，一并列出同辈示例
    if (/同辈|同一辈|辈分|排行/.test(q)) {
      const { list, total } = getSameGeneration(tid, 30);
      if (list.length) {
        const names = list.slice(0, 15).map(p => p.name + (p.branch && p.branch !== '—' ? '(' + p.branch + ')' : '')).join('、');
        const scope = isAncient ? '远古世系' : generationLabel(g);
        return genTxt + `\n与 ${target.name} 同辈（${scope}）的族人共 ${total} 位，示例：\n${names}`;
      }
    }
    return genTxt;
  }

  if (/同辈|同一辈|辈分|排行/.test(q)) {
    const { list, total } = getSameGeneration(tid, 30);
    if (!list.length) return `未找到与 ${describePerson(target)} 同辈的族人记录。`;
    const g = target.generation_num;
    const isAncient = g !== undefined && g !== null && g !== '' && Number(g) < 0;
    const scope = isAncient ? '远古世系' : generationLabel(g);
    const names = list.slice(0, 15).map(p => p.name + (p.branch && p.branch !== '—' ? '(' + p.branch + ')' : '')).join('、');
    return `与 ${target.name} 同辈（${scope}）的族人共 ${total} 位，示例：\n${names}`;
  }

  if (/后代|子孙|后裔|后辈|子女/.test(q)) {
    const levels = getDescendantLevels(tid, 6);
    if (!levels.length) return `${target.name} 未查到后代记录。`;
    const lines = [`${target.name} 的后代（每代最多列前若干）：`];
    levels.forEach((lv, i) => {
      const names = lv.slice(0, 10).map(p => p.name).join('、');
      lines.push(`第 ${i + 1} 代：${names}${lv.length > 10 ? ' 等' + lv.length + '人' : ''}`);
    });
    return lines.join('\n');
  }

  if (/关系/.test(q)) {
    // 找问题中的第二个名字（支持单字名）
    let other = null;
    for (const minLen of [2, 1]) {
      for (const n of byName.keys()) {
        if (n.length >= minLen && q.includes(n) && n !== target.name) { other = n; break; }
      }
      if (other) break;
    }
    if (other) {
      const otherId = Number(byName.get(other)[0].id);
      return kinshipText(tid, otherId);
    }
    return '请说明想查询与谁的关系，例如「我和谢XX是什么关系」。';
  }

  // 直接亲属问答：问「我的太爷爷/爷爷/父亲/儿子…是谁」→ 只答这一个，不展开其他
  const subj = Number(target.id) === Number(self.id) ? '您' : target.name;
  for (const k of KINSHIP_ANCESTOR) {
    if (k.re.test(q)) {
      const anc = getAncestorList(tid, true, k.gen + 1); // 含自己，最多 k.gen+1 人
      if (!anc.length || anc.length <= k.gen) {
        return `未在族谱中找到${subj === '您' ? '您的' : subj + '的'}${k.label}记录。`;
      }
      return `${subj}的${k.label}是：${anc[k.gen].name}。`;
    }
  }
  for (const k of KINSHIP_DESCENDANT) {
    if (k.re.test(q)) {
      const levels = getDescendantLevels(tid, k.gen);
      const people = levels.length >= k.gen ? levels[k.gen - 1] : [];
      if (!people.length) {
        return `未在族谱中找到${subj === '您' ? '您的' : subj + '的'}${k.label}记录。`;
      }
      const names = people.map(p => p.name).join('、');
      return `${subj}的${k.label}是：${names}。`;
    }
  }

  // 默认：祖先/直系/世系链
  const total = /(\d{1,2})\s*代/.test(q) ? Math.max(3, Math.min(20, parseInt(RegExp.$1, 10))) : 10;
  const chain = getDirectChain(tid, total);
  if (!chain.length) return '未找到相关世系记录。';
  return `—— ${target.name} 的直系世系（共 ${chain.length} 世）——\n` + formatChain(chain, tid);
}

/**
 * 「从炎帝神农氏开始」的完整世系：权威主链（历史段）衔接真实 father_id 链（本人段）。
 * 支持查询自己（「我的世系图」）或查询其他族人（「呈现XX的世系图」）。
 * 返回 { text, tree, ownerIsSelf, targetName }：text 用于答案+朗读，tree 供前端画树。
 * 懒加载 historical-chain.js 以避免顶层循环 require。
 */
function answerFullLineage(query, selfId) {
  ensureLoaded();
  const hc = require('./historical-chain.js');
  const q = String(query || '').trim();
  // 解析被查询族人：含「我/本人」→ 查自己；否则从提问中按名字解析（跳过提问框架里的始祖名）
  let targetId = Number(selfId);
  let foundName = false;
  if (!/我|本人/.test(q)) {
    const skip = new Set(['炎帝神农氏', '炎帝']);
    // 优先匹配 ≥2 字的人名，避免单字误命中提问框架里的字；找不到再降级匹配单字名（如「衡」）
    for (const minLen of [2, 1]) {
      for (const n of byName.keys()) {
        if (skip.has(n)) continue;
        if (n.length >= minLen && q.includes(n)) {
          targetId = Number(byName.get(n)[0].id);
          foundName = true;
          break;
        }
      }
      if (foundName) break;
    }
    if (!foundName) {
      return { text: '族谱中未找到您想查询的族人，请确认姓名是否正确（例如「请从炎帝神农氏开始，呈现敬乙的世系图」）。', tree: null, ownerIsSelf: true, targetName: '' };
    }
  }
  const target = byId.get(targetId);
  const nodes = hc.buildFullChain(targetId);
  if (!nodes || !target) return { text: '未找到该族人的族谱记录，请重新验证身份。', tree: null, ownerIsSelf: true, targetName: '' };
  const ownerIsSelf = Number(targetId) === Number(selfId);
  return { text: hc.formatChainText(nodes, target.name, ownerIsSelf), tree: nodes, ownerIsSelf, targetName: target.name };
}

module.exports = {
  ensureLoaded, getPerson, getPeopleByName,
  getAncestorList, getDescendantLevels, getSameGeneration,
  isAncestorOf, kinshipText, getDirectChain, describePerson, answerLineage, answerFullLineage,
};
