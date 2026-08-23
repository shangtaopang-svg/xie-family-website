/**
 * server/ai/lineage.js
 * 确定性世系引擎：所有世系/辈分/亲属结论优先由交付版独立世系图 data.js 的 father_id 链计算，
 * 不经过大模型 —— 从根上杜绝"编造族谱数据"。上册/下册作为同等级文献依据进入 AI 检索上下文。
 *
 * 数据常驻内存（Map<id,Person> + Map<name,id[]>），每次查询前按 mtime 检测，
 * 管理后台修改族谱后即时生效。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const deliverySource = require('./delivery-source.js');

const LEGACY_DATA_FILE = path.join(__dirname, '..', '..', 'data', 'genealogy.json');

let byId = null;
let byName = null;
let mtimeMs = -1;
let loadedSource = '';
let adoptionPairs = [];

function loadAdoptionPairs() {
  adoptionPairs = [];
  const appFile = path.join(__dirname, '..', '..', '交付_下枫槎谢氏世系图', 'app.js');
  let src = '';
  try { src = fs.readFileSync(appFile, 'utf-8'); } catch (e) { return; }
  const re = /registerExplicitPair\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(['"])(.*?)\4\s*,\s*(?:true|false)\s*\)/g;
  let m;
  while ((m = re.exec(src))) {
    adoptionPairs.push({ outId: Number(m[1]), adoptiveId: Number(m[2]), adoptiveParentId: Number(m[3]), source: m[5] });
  }
}

function ensureLoaded() {
  const deliveryList = deliverySource.ensureLoaded();
  const usingDelivery = Array.isArray(deliveryList) && deliveryList.length > 0;
  const sourceFile = usingDelivery ? deliverySource.getFilePath() : LEGACY_DATA_FILE;
  let stat = null;
  try { stat = fs.statSync(sourceFile); } catch (e) { stat = null; }
  const mtime = usingDelivery ? deliverySource.getMtimeMs() : (stat ? stat.mtimeMs : -1);
  if (byId && mtime === mtimeMs && sourceFile === loadedSource) return;
  mtimeMs = mtime;
  loadedSource = sourceFile;
  let list = [];
  if (usingDelivery) {
    list = deliveryList;
  } else {
    try { list = JSON.parse(fs.readFileSync(LEGACY_DATA_FILE, 'utf-8')); } catch (e) { list = []; }
  }
  byId = new Map();
  byName = new Map();
  for (const p of list) {
    byId.set(Number(p.id), p);
    if (p.name) {
      (byName.get(p.name) || byName.set(p.name, []).get(p.name)).push(p);
    }
  }
  loadAdoptionPairs();

  // 交付版数据已经包含当前核对后的父子关系和人工修正，必须原样使用；
  // 下方旧版后台数据的内存修补只作为缺少交付数据时的兼容回退。
  if (usingDelivery) return;

  // ===== 同名同人合并（仅内存，不改数据文件）=====
  // 同一人在不同分支/批次被录入成两条记录时（如「在纲之子小四」=「石马始祖小四(石马)」），
  // 特征：A 有父亲但名下无子女，同名 B 无父亲但名下子女成群 → 两个记录"咬合"成同一个人。
  // 此时把 B 的全部子女改挂到 A 名下，使全库世系信息综合贯通（血缘/世系/炎帝到你的世系均生效）。
  // 已对全库 1249 人扫描：仅此一例（小四 1206↔1207），其余同名者均为真不同人（都有父亲、各有子女）。
  const peopleArr = Array.from(byId.values());
  const baseName = (n) => String(n || '').replace(/[（(].*?[）)]/g, '').trim();
  const groups = new Map();
  for (const p of peopleArr) {
    const b = baseName(p.name);
    if (!b) continue;
    (groups.get(b) || groups.set(b, []).get(b)).push(p);
  }
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const childOf = (id) => peopleArr.some(c => c.father_id !== undefined && c.father_id !== null && Number(c.father_id) === Number(id));
    // A：有父亲、名下无子女（等着接子女的半条）
    const A = list.filter(p => p.father_id && Number(p.father_id) !== Number(p.id) && !childOf(p.id));
    // B：无父亲、名下有子女（等着接父亲的半条）
    const B = list.filter(p => !p.father_id && childOf(p.id));
    if (A.length !== 1 || B.length === 0) continue;
    const target = A[0];
    for (const bb of B) {
      for (const c of peopleArr) {
        if (Number(c.father_id) === Number(bb.id)) c.father_id = target.id;
      }
    }
    console.log('[lineage] 同名同人合并：' + B.map(b => b.id + ' ' + b.name).join('、') + ' 的子女 → 挂到 ' + target.id + ' ' + target.name);
  }

  // ===== 世系贯通：把后台全部世系分类综合成一条完整父链（仅内存，不改数据文件）=====
  // 背景：data/genealogy.json 里远古/申伯/东山/临海四大段彼此断开（炎帝只连到临魁、申伯无父、
  //       东山根「万」自指、申伯世系中段只有同名枫槎人无古世系记录）。
  // 依据（均为权威数据，非编造）：
  //   1) 管理后台族谱页面古世系权威父链（pages/genealogy.html getAncientGenealogyData，
  //      炎帝1→临魁2→榆罔10→帝柱11→祝融15→吕尚54→佐55→申伯65→弘66→广67→列宗68→骘69→预70→
  //      昌后71→达72→子民73→秩74→雍75→林76→涣77→旺78→珽79→国辉80→宁81→福82→杨贞83→平和84→
  //      文85→武86→秉槐87→堂88→瑛89→文轩90→福郎91→宜礼92→逵93→简94→瑰95→懿96→鳅97→当/景秀98→
  //      缵99→衡100→裒101→奕/据/安/万102→琰103→混104→密105→庄106→飏107→…→闓122→…→在纲129→
  //      小四130→丹一131→文杲132）。
  //   2) genealogy.json 中人物 bio 明示的父子（「衡之子」「裒之子」「安之子」「琰之子」「混之子」「鳅之后」）。
  // 处理两类：
  //   (1) 远古/东山段真实记录的错链 father_id → 按权威链重指；
  //   (2) 申伯世系中段（广67世…宜礼的父福郎91世）在 data 里没有古世系记录（只有同名枫槎人，
  //       如协#11/列宗#14/福郎#1025 等都是文杲后代）→ 按权威链注入合成记录（id 8xxxx）补齐缺口。
  // 枫槎同名人一律不动，保持其在文杲树中的真实身份。
  {
    // (1) 真实记录重指：[子id, 父id]
    const ANCIENT_REPOINT = [
      // 远古顶链：炎帝(1)→临魁(2)→榆罔(10)→帝柱(11)→祝融(15)→吕尚(54)→佐(55)→宏道(64)→申伯(65)。
      // 注意：1—65 世不是“数组相邻即父子”。榆罔、帝柱、祝融之间存在世次跳跃；
      // 宏道（64世）是佐之子，且谱载为申伯、申甫之父，不能把申伯直接挂到佐(55)名下。
      [3, 2], [4, 3], [5, 4], [1184, 5], [6, 1255],
      // 弘(8)/猛(9) 是申伯之子；申甫(7) 是宏道之子。
      [8, 6], [9, 6], [7, 1255],
      // 东山段错链重指（bio 依据）：鳅→懿、当/景秀→鳅、缵/显/顼→景秀、衡→缵
      [1150, 1146], [1152, 1150], [1124, 1150], [1126, 1124], [1127, 1124], [1128, 1124], [1130, 1126],
      // 逵→宜礼、简→逵、瑰→简、懿→瑰
      [1131, 1125], [1135, 1131], [1143, 1135], [1146, 1143],
      // 鲲/裒/广→衡（「衡之子」）；奕/据/安/万/淮/石/铁→裒（「裒之子」）
      [1132, 1130], [1133, 1130], [1134, 1130],
      [1136, 1133], [1137, 1133], [1138, 1133], [1139, 1133], [1140, 1133], [1141, 1133], [1142, 1133],
      // 瑶/琰→安（「安之子」）；肇/峻/混→琰（「琰之子」）；密→混（「混之子」）
      [1144, 1138], [1145, 1138], [1147, 1145], [1148, 1145], [1149, 1145], [1151, 1149],
      // 延甫(85) 的 branch 字段即「朝乐之子」，且朝乐(78) bio「子二廷相廷甫」互证
      [85, 78],
    ];
    for (const [cid, pid] of ANCIENT_REPOINT) {
      const c = byId.get(cid);
      if (c) c.father_id = pid;
    }

    // (2) 注入申伯世系中段合成记录 [世次, 名, 父世次(0=弘#8)]
    // 父世次按「父行先于子行」顺序可解；0 表示父是真实记录弘(8)。
    const SYN_GAP = [
      [67, '广', 66], [67, '协', 66],          // 弘之子（66 即真实 弘#8）
      [68, '列宗', 67], [68, '穆宗', 67],      // 广之子
      [69, '骘', 68], [70, '预', 69], [71, '昌后', 70],
      [72, '达', 71], [72, '守礼', 71],
      [73, '子民', 72], [74, '秩', 73], [75, '雍', 74], [76, '林', 75],
      [77, '涣', 76], [78, '旺', 77], [79, '珽', 78], [80, '国辉', 79],
      [81, '宁', 80], [82, '福', 81], [83, '杨贞', 82],
      [84, '平和', 83], [84, '平利', 83], [84, '平祖', 83],
      [85, '文', 84], [85, '翠', 84], [85, '利', 84],
      [86, '武', 85], [87, '秉槐', 86], [88, '堂', 87], [89, '瑛', 88],
      [90, '文轩', 89], [90, '文昂', 89],
      [91, '福郎', 90], [91, '丙郎', 90], [91, '应郎', 90],
    ];
    const synByShi = new Map();   // 世次→该世次唯一直系合成 id（取父世次=世次-1 的直系）
    const synByName = new Map();  // 名→最近创建的合成 id
    const findSynByShi = (shi) => {
      const id = synByShi.get(shi);
      return id !== undefined ? byId.get(id) : null;
    };
    for (let si = 0; si < SYN_GAP.length; si++) {
      const [shi, nm, fshi] = SYN_GAP[si];
      const sid = 80000 + si + 1;
      let fid = null;
      if (fshi === 66) { fid = 8; }                                  // 弘(真实)
      else if (fshi === 0) { fid = 8; }
      else {
        const f = findSynByShi(fshi);
        if (f) fid = f.id;
      }
      const rec = { id: sid, name: nm, gender: '男', generation_num: shi, generation: String(shi),
        branch: '申伯世系', father_id: fid, spouse_ids: '', is_alive: '否', biography: '' };
      byId.set(sid, rec);
      (byName.get(nm) || byName.set(nm, []).get(nm)).push(rec);
      // 直系标记：父世次=世次-1（且该名首次出现）→ 作为该世次的直系 id
      const isDirect = fshi === shi - 1;
      if (isDirect && !synByShi.has(shi)) synByShi.set(shi, sid);
      synByName.set(nm, sid);
    }
    // 宜礼(1125)/宜乐(1129) 的父 = 合成福郎(91世)
    const synFuLang = synByName.get('福郎');
    if (synFuLang) {
      const yl = byId.get(1125); if (yl) yl.father_id = synFuLang;
      const yle = byId.get(1129); if (yle) yle.father_id = synFuLang;
    }
    console.log('[lineage] 世系贯通：注入申伯中段合成记录 ' + SYN_GAP.length + ' 条，重指远古/东山错链 ' + ANCIENT_REPOINT.length + ' 条');
  }
}

function adoptionContextsFor(personId) {
  ensureLoaded();
  const chainIds = new Set(getAncestorList(personId, true).map(p => Number(p.id)));
  const contexts = [];
  for (const rel of adoptionPairs) {
    if (!chainIds.has(rel.outId) && !chainIds.has(rel.adoptiveId)) continue;
    const outPerson = byId.get(rel.outId);
    const adoptedPerson = byId.get(rel.adoptiveId);
    const adoptiveParent = byId.get(rel.adoptiveParentId);
    if (!outPerson || !adoptedPerson || !adoptiveParent) continue;

    let biologicalParent = outPerson.father_id ? byId.get(Number(outPerson.father_id)) : null;
    const sourceFather = String(rel.source || '').match(/^(.+?)之(?:子|女)/);
    if (sourceFather) {
      const candidates = byName.get(sourceFather[1]) || [];
      biologicalParent = candidates.find(p => Number(p.generation_num) === Number(outPerson.generation_num) - 1) || candidates[0] || biologicalParent;
    }
    const bpGrand = biologicalParent && biologicalParent.father_id ? byId.get(Number(biologicalParent.father_id)) : null;
    const apGrand = adoptiveParent.father_id ? byId.get(Number(adoptiveParent.father_id)) : null;
    const commonAncestorName = bpGrand && apGrand && bpGrand.name === apGrand.name ? bpGrand.name : '';
    const parentGen = Number(adoptiveParent.generation_num) || Number(biologicalParent && biologicalParent.generation_num) || 0;
    const siblings = [];
    if (commonAncestorName) {
      const grandRecords = byName.get(commonAncestorName) || [];
      const grandIds = new Set(grandRecords.map(p => Number(p.id)));
      for (const p of byId.values()) {
        if (grandIds.has(Number(p.father_id)) && Number(p.generation_num) === parentGen &&
            !siblings.some(x => x.name === p.name)) siblings.push({ id: Number(p.id), name: p.name, shi: Number(p.generation_num) || '' });
      }
    }
    contexts.push({
      source: rel.source,
      commonAncestor: commonAncestorName ? { name: commonAncestorName, shi: Number(bpGrand.generation_num) || Number(apGrand.generation_num) || '' } : null,
      siblings,
      biologicalParent: biologicalParent ? { id: Number(biologicalParent.id), name: biologicalParent.name, shi: Number(biologicalParent.generation_num) || '' } : null,
      adoptiveParent: { id: Number(adoptiveParent.id), name: adoptiveParent.name, shi: Number(adoptiveParent.generation_num) || '' },
      person: { id: Number(adoptedPerson.id), name: adoptedPerson.name, shi: Number(adoptedPerson.generation_num) || '', outId: rel.outId },
      target: Number(adoptedPerson.id) === Number(personId) ? null : (byId.get(Number(personId)) ? { id: Number(personId), name: byId.get(Number(personId)).name, shi: Number(byId.get(Number(personId)).generation_num) || '' } : null)
    });
  }
  return contexts;
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

  const ancestorTerm = (person, n) => {
    const female = String(person.gender || '').includes('女');
    if (n === 1) return female ? '母亲' : '父亲';
    if (n === 2) return female ? '祖母/外祖母' : '祖父';
    if (n === 3) return female ? '曾祖母' : '曾祖父';
    if (n === 4) return female ? '高祖母' : '高祖父';
    return `第${n}代祖先`;
  };
  if (aAnc.some(p => Number(p.id) === Number(b.id))) {
    const n = aAnc.findIndex(p => Number(p.id) === Number(b.id)) + 1;
    return `${a.name}称${b.name}为${ancestorTerm(b, n)}（实际父系链相隔${n}层）`;
  }
  if (bAnc.some(p => Number(p.id) === Number(a.id))) {
    const n = bAnc.findIndex(p => Number(p.id) === Number(a.id)) + 1;
    return `${b.name}称${a.name}为${ancestorTerm(a, n)}（实际父系链相隔${n}层）`;
  }
  // 共同祖先：aAnc 是 近→远（索引0=父亲），从【最近端】找第一个交集 = 最近公共祖先(LCA)。
  // 注意：不能从远端找，否则亲兄弟会被误判为「共同祖先是最远祖」，如大四/小四共父在纲却报「共祖广，距63代」。
  const aSet = new Set(aAnc.map(p => Number(p.id)));
  const bSet = new Set(bAnc.map(p => Number(p.id)));
  let lca = null, la = -1, lb = -1;
  for (let i = 0; i < aAnc.length; i++) {
    if (bSet.has(Number(aAnc[i].id))) { lca = aAnc[i]; la = i; break; }
  }
  if (!lca) return `${a.name} 与 ${b.name} 未查到共同祖先`;
  lb = bAnc.findIndex(p => Number(p.id) === Number(lca.id));
  const da = la + 1, db = lb + 1; // 各自离 LCA 的代数
  const lcaName = lca.name || ('ID ' + lca.id);
  if (da === 1 && db === 1) return `${a.name}与${b.name}为同父兄弟/姐妹，彼此称兄弟或姐妹（共同父亲：${lcaName}）`;
  if (da === 1 && db > 1) return `${b.name}称${a.name}为叔伯/姑母辈（共同父系：${lcaName}）`;
  if (db === 1 && da > 1) return `${a.name}称${b.name}为叔伯/姑母辈（共同父系：${lcaName}）`;
  if (da === db) return `${a.name}与${b.name}为同辈旁系亲属，彼此称堂兄弟/堂姐妹（共同父系：${lcaName}）`;
  return `${a.name}与${b.name}为旁系亲属，不能仅凭世次数字确定具体称谓（共同父系：${lcaName}，父系链距离${da}/${db}层）`;
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

/**
 * 主回答入口：根据提问 + 本人 id 生成确定性文本。
 * forcedTargetId：前端同名确认后携带的明确目标 id（已确认查哪个同名者），
 * 提供时跳过人名解析直接定位目标。
 */
function answerLineage(query, selfId, forcedTargetId) {
  ensureLoaded();
  const q = String(query || '').trim();
  const self = byId.get(Number(selfId));
  if (!self) return '未找到您的族谱记录，请重新验证身份。';

  // 尝试提取问题中的指名人物（优先 ≥2 字人名，找不到再匹配单字名，如「衡」）
  let target = self;
  if (forcedTargetId !== undefined && forcedTargetId !== null && String(forcedTargetId) !== '') {
    const ft = byId.get(Number(forcedTargetId));
    if (ft) target = ft;
  } else if (!/我/.test(q)) {
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
function answerFullLineage(query, selfId, forcedTargetId) {
  ensureLoaded();
  const hc = require('./historical-chain.js');
  const q = String(query || '').trim();
  // 解析被查询族人：含「我/本人」→ 查自己；否则从提问中按名字解析（跳过提问框架里的始祖名）
  let targetId = Number(selfId);
  let foundName = false;
  if (forcedTargetId !== undefined && forcedTargetId !== null && String(forcedTargetId) !== '') {
    targetId = Number(forcedTargetId);
    foundName = true;
  } else if (!/我|本人/.test(q)) {
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
  // 完整直线世系中不能把承嗣链伪装成普通父子链。凡目标祖链经过出继/入继人物，
  // 直接在对应节点附上亲生父亲、承嗣父亲和谱载原文，供前端在树中就地展开。
  const adoptionContexts = adoptionContextsFor(targetId);
  adoptionContexts.forEach((ctx) => {
    const node = nodes.find(n => n.name === ctx.person.name && Number(n.shi) === Number(ctx.person.shi));
    if (!node) return;
    node.adopt = ctx.source || '出继 / 入继';
    node.adoptionDetail = {
      biologicalParent: ctx.biologicalParent,
      adoptiveParent: ctx.adoptiveParent,
      source: ctx.source,
      commonAncestor: ctx.commonAncestor,
      siblings: ctx.siblings,
      person: ctx.person,
      target: ctx.target
    };
  });
  const ownerIsSelf = Number(targetId) === Number(selfId);
  return { text: hc.formatChainText(nodes, target.name, ownerIsSelf), tree: nodes, ownerIsSelf, targetName: target.name };
}

/* ---------------- 血缘最近 N 人（基因共享率 r，遗传学亲等，最高 50%，越高越亲） ---------------- */
/* 模型（#75，用户确认）：直系 r=2^-d（父/子/女 50%、祖父 25%、曾祖 12.5%）；
   旁系 r=2^-(da+db-1)（共祖为一对夫妻、默认同父同母：亲兄弟/姐妹 50%、叔侄 25%、堂兄弟 12.5%）。
   数据限制：族谱仅父系 father_id 链、无母亲字段，故「同父异母(25%)」与「同父同母(50%)」无法区分，
   一律按同父同母计；姐妹在有记录时按同规则自动计入（当前数据无女性记录）。 */
const CLOSE_ANCESTOR_REL = ['父亲', '祖父', '曾祖父', '高祖父'];
const CLOSE_DESCENDANT_REL_M = ['儿子', '孙子', '曾孙'];
const CLOSE_DESCENDANT_REL_F = ['女儿', '孙女', '曾孙女'];

function relAncestor(n) {
  return n <= CLOSE_ANCESTOR_REL.length ? CLOSE_ANCESTOR_REL[n - 1] : '第' + n + '代祖';
}
function relDescendant(n, gender) {
  const names = gender === '女' ? CLOSE_DESCENDANT_REL_F : CLOSE_DESCENDANT_REL_M;
  return n <= names.length ? names[n - 1] : '第' + n + '代孙';
}
function relCousin(da, db, lca, gender) {
  const gs = gender === '女';
  if (da === 1 && db === 1) return gs ? '亲姐妹' : '亲兄弟';
  if (da === 1 && db === 2) return gs ? '侄女' : '侄子';
  if (da === 2 && db === 1) return gs ? '姑辈' : '叔伯辈';
  if (da === 2 && db === 2) return gs ? '堂姐妹' : '堂兄弟';
  if (da === 1 && db === 3) return gs ? '侄孙女' : '侄孙';
  if (da === 3 && db === 1) return gs ? '姑祖母辈' : '叔祖辈';
  return '同宗（共祖' + (lca && lca.name || '') + '）';
}

/* 血缘树（#82）：固定家族结构模板 + 填入真实人名，供前端画树。
   结构对照用户提供的 ASCII：曾祖父(12.5%)→祖父(25%)→父亲(50%)，父亲下分 亲姑妈/你/亲伯父叔父(25%)；
   同辈 亲姐妹/你本人/亲兄弟(50%)；你本人下 儿女(50%)→孙女孙子(25%)；亲兄弟下 亲侄女亲侄子(25%)。
   槽位按 rel 分类（relCousin 已按性别区分：姑辈=父之姐妹、叔伯辈=父之兄弟、侄女/侄子等），
   people 为空时前端显示「暂无记录」占位；tree 用全部 rows（含排名 10 名开外的曾祖父），不只 top10。
   targetName：本人节点标注。查自己传「您」→ 显示「你（本人）」；查他人传其姓名 → 节点直接显示该姓名。 */
function buildClosestTree(rows, self, targetName) {
  const selfLabel = (targetName && targetName !== '您') ? '本人' : '你（本人）';
  var slot = function (pred) {
    return rows.filter(pred).map(function (r) {
      var p = byId.get(r.id);
      return { name: r.name, alive: !!(p && p.is_alive === '是') };
    });
  };
  var s = {
    zeng: slot(function (r) { return r.rel === '曾祖父'; }),
    zu: slot(function (r) { return r.rel === '祖父'; }),
    fu: slot(function (r) { return r.rel === '父亲'; }),
    guma: slot(function (r) { return r.rel === '姑辈'; }),
    boshu: slot(function (r) { return r.rel === '叔伯辈'; }),
    jiemei: slot(function (r) { return r.rel === '亲姐妹'; }),
    xiongdi: slot(function (r) { return r.rel === '亲兄弟'; }),
    nver: slot(function (r) { return r.rel === '女儿'; }),
    erzi: slot(function (r) { return r.rel === '儿子'; }),
    sunnv: slot(function (r) { return r.rel === '孙女'; }),
    sunzi: slot(function (r) { return r.rel === '孙子'; }),
    zhinv: slot(function (r) { return r.rel === '侄女'; }),
    zhizi: slot(function (r) { return r.rel === '侄子'; })
  };
  return {
    selfName: self.name,
    root: {
      rel: '曾祖父', shared: 12.5, tier: 3, people: s.zeng,
      children: [{
        rel: '祖父', shared: 25, tier: 2, people: s.zu,
        children: [
          { rel: '亲姑妈', shared: 25, tier: 2, people: s.guma, note: '父亲的姐妹' },
          {
            rel: '父亲', shared: 50, tier: 1, people: s.fu,
            children: [
              { rel: '亲姐妹', shared: 50, tier: 1, people: s.jiemei },
              {
                rel: selfLabel, tier: 0, self: true, people: [{ name: self.name, alive: true }],
                children: [{
                  rel: '女儿 / 儿子', shared: 50, tier: 1, people: s.nver.concat(s.erzi),
                  children: [{ rel: '孙女 / 孙子', shared: 25, tier: 2, people: s.sunnv.concat(s.sunzi) }]
                }]
              },
              {
                rel: '亲兄弟', shared: 50, tier: 1, people: s.xiongdi,
                children: [{ rel: '亲侄女 / 亲侄子', shared: 25, tier: 2, people: s.zhinv.concat(s.zhizi) }]
              }
            ]
          },
          { rel: '亲伯父 / 叔父', shared: 25, tier: 2, people: s.boshu, note: '父亲的兄弟' }
        ]
      }]
    }
  };
}

/**
 * 解析血缘/最亲问题中的目标族人：含「我/本人」→ 本人；否则按提问中的姓名匹配（优先 ≥2 字，再单字名如「沦」）。
 * 找不到 → 回退本人。返回 { id, name, self }。
 */
/**
 * 从提问中提取目标人名（不含「我/本人」的自指）。
 * 候选评分：名字越长越好；紧跟在「和/与」后的名字（如「和庆三最亲」→庆三 而非 和庆）额外加分；
 * 单字名最后兜底，避免误命中普通字。返回匹配的名字字符串，找不到返回 null。
 */
function extractTargetName(q) {
  const BOUNDARY_AFTER = /[\s，。？！,.?!:：、;；的(（[）\]"”'']/;
  const REL_START = /^[最血亲缘近]/; // 名字后紧跟「最亲/血缘/亲近…」也算边界
  let bestName = null, bestScore = -1;
  for (const n of byName.keys()) {
    if (n.length < 2) continue; // 单字名最后兜底，避免误命中普通字
    let idx = q.indexOf(n);
    while (idx !== -1) {
      const after = q.charAt(idx + n.length);
      const boundaryOk = !after || BOUNDARY_AFTER.test(after) || REL_START.test(after);
      if (boundaryOk) {
        const before = q.charAt(idx - 1);
        let score = n.length * 100;
        if (before === '和' || before === '与') score += 50; // 紧跟连词 → 明确指向目标
        else score += Math.max(0, 12 - idx);                 // 位置靠左略加分
        if (score > bestScore) { bestScore = score; bestName = n; }
      }
      idx = q.indexOf(n, idx + 1);
    }
  }
  if (bestName) return bestName;

  // 单字名兜底：优先紧跟「和/与」的
  for (const n of byName.keys()) {
    if (n.length !== 1) continue;
    const idx = q.indexOf(n);
    if (idx === -1) continue;
    if (q.charAt(idx - 1) === '和' || q.charAt(idx - 1) === '与') return n;
  }
  for (const n of byName.keys()) {
    if (n.length === 1 && q.includes(n)) return n;
  }
  return null;
}

/**
 * 同名预检：解析提问中的目标人名，返回所有同名候选（含区分信息），供前端弹窗确认。
 * 返回 { name, candidates }；查询本人/无人名 → { name:null, candidates:[] }。
 * 前端从候选里选定后，把选中的 personId 作为 resolvedId 携带，服务端用 forcedTargetId 直查。
 */
function resolveNameCandidates(query, selfId) {
  ensureLoaded();
  const q = String(query || '').trim();
  if (/我|本人/.test(q)) return { name: null, candidates: [] };
  const name = extractTargetName(q);
  if (!name) return { name: null, candidates: [] };
  const cands = (byName.get(name) || []).map(p => {
    const fid = Number(p.father_id);
    const f = fid > 0 && byId.has(fid) ? byId.get(fid) : null;
    const adoption = adoptionPairs.find(rel => rel.outId === Number(p.id) || rel.adoptiveId === Number(p.id));
    let adoptionRole = '';
    let biologicalFatherName = '';
    let adoptiveFatherName = '';
    let relationSource = '';
    if (adoption) {
      const outPerson = byId.get(adoption.outId);
      const biologicalFather = outPerson && outPerson.father_id ? byId.get(Number(outPerson.father_id)) : null;
      const adoptiveFather = byId.get(adoption.adoptiveParentId);
      adoptionRole = adoption.outId === Number(p.id) ? 'biological' : 'adoptive';
      biologicalFatherName = biologicalFather ? biologicalFather.name : '';
      adoptiveFatherName = adoptiveFather ? adoptiveFather.name : '';
      relationSource = adoption.source || '';
    }
    return {
      id: Number(p.id),
      name: p.name,
      desc: describePerson(p),
      fatherName: f ? f.name : null,
      brief: (p.biography || '').slice(0, 40),
      isSelf: Number(p.id) === Number(selfId),
      adoptionRole,
      biologicalFatherName,
      adoptiveFatherName,
      relationSource,
    };
  });
  return { name, candidates: cands };
}

function resolveClosestTarget(message, selfId, forcedTargetId) {
  ensureLoaded();
  if (forcedTargetId !== undefined && forcedTargetId !== null && String(forcedTargetId) !== '') {
    const fp = byId.get(Number(forcedTargetId));
    if (fp) return { id: Number(fp.id), name: fp.name, self: Number(fp.id) === Number(selfId) };
  }
  const q = String(message || '');
  if (/我|本人/.test(q)) return { id: Number(selfId), name: null, self: true };

  const pick = (name) => {
    const candidates = byName.get(name) || [];
    // 同一出继/入继人物可能有两条同名记录；最亲查询按亲生记录计算血缘，
    // adoptionContextsFor 会同时把承嗣父及 0% 关系补到结果图中。
    const cand = candidates.find((p) => adoptionPairs.some((rel) => Number(rel.outId) === Number(p.id))) || candidates[0];
    if (!cand) return null;
    const id = Number(cand.id);
    return { id, name: cand.name, self: id === Number(selfId) };
  };

  const name = extractTargetName(q);
  if (name) { const r = pick(name); if (r) return r; }
  return { id: Number(selfId), name: null, self: true };
}

/**
 * 血缘最近的人列表：按基因共享率 r 排序（直系 2^-d；旁系 2^-(da+db-1)，同父同母假设）。
 * 父/子/女/亲兄弟/亲姐妹 50% 同列第一档，祖父/孙/叔侄 25% 第二档，堂兄弟 12.5% 第三档。
 * 覆盖直系长辈/晚辈与父系旁系；无共同祖先（数据断链）的排除。
 * targetName：展示用名（本人传「您」，查他人传其姓名），决定答案文本与树的「本人」节点标注。
 * 返回 { text, list, tree }，tree.targetName 供前端标题/口播用。
 */
function answerClosest(personId, limit, targetName) {
  ensureLoaded();
  limit = Math.max(3, Math.min(20, limit || 10));
  const self = byId.get(Number(personId));
  if (!self) return { text: '未找到该族人的族谱记录，请重新验证身份。', list: null };
  const displayName = (targetName === undefined || targetName === null) ? '您' : targetName;
  const selfId = Number(personId);
  const selfAnc = getAncestorList(selfId, true); // 含自己，近→远
  const selfGen = Number(self.generation_num) || 0;
  const rows = [];
  for (const p of byId.values()) {
    const pid = Number(p.id);
    if (pid === selfId) continue;
    const pg = Number(p.generation_num) || 0;
    const g = p.gender;
    // 直系长辈：p 是 self 的祖先（selfAnc[ai]，ai=第 ai 代祖 → r=2^-ai）
    const ai = selfAnc.findIndex(x => Number(x.id) === pid);
    if (ai > 0) { rows.push({ id: pid, name: p.name, shared: Math.pow(0.5, ai), rel: relAncestor(ai), shi: pg, branch: p.branch }); continue; }
    // 直系晚辈：self 是 p 的祖先（pAnc[si]，si=第 si 代孙 → r=2^-si）
    const pAnc = getAncestorList(pid, true);
    const si = pAnc.findIndex(x => Number(x.id) === selfId);
    if (si > 0) { rows.push({ id: pid, name: p.name, shared: Math.pow(0.5, si), rel: relDescendant(si, g), shi: pg, branch: p.branch }); continue; }
    // 旁系：共祖。从【近端】扫最近公共祖先（亲兄弟勿从最远端找，见 kinshipText 修复），da=self 到 LCA 代数，db=p 到 LCA 代数
    const pAncNoSelf = pAnc.slice(1);
    const pSet = new Set(pAncNoSelf.map(x => Number(x.id)));
    let lca = null, da = -1;
    for (let i = 1; i < selfAnc.length; i++) {
      if (pSet.has(Number(selfAnc[i].id))) { lca = selfAnc[i]; da = i; break; }
    }
    if (!lca) continue; // 无共同祖先（数据断链），排除
    const db = pAncNoSelf.findIndex(x => Number(x.id) === Number(lca.id)) + 1;
    // 旁系共享一对共祖（同父同母假设）：r = 2×2^-(da+db) = 2^-(da+db-1)。亲兄弟 da=db=1 → 50%，叔侄 → 25%，堂兄弟 → 12.5%
    rows.push({ id: pid, name: p.name, shared: Math.pow(0.5, da + db - 1), rel: relCousin(da, db, lca, g), shi: pg, branch: p.branch });
  }
  // 排序：基因共享率降序（越高越亲）→ 与本人世代差小者优先（同辈靠前）→ 姓名
  rows.sort(function (a, b) {
    if (a.shared !== b.shared) return b.shared - a.shared;
    const ga = Math.abs(a.shi - selfGen), gb = Math.abs(b.shi - selfGen);
    if (ga !== gb) return ga - gb;
    return String(a.name).localeCompare(String(b.name), 'zh');
  });
  // 竞争式并列排名：共享率相同则同排名（父/亲兄弟都第1名，祖父/叔伯第N名）
  let rank = 0;
  rows.forEach(function (r, i) {
    if (i === 0 || rows[i - 1].shared !== r.shared) rank = i + 1;
    r.rank = rank;
  });
  const list = rows.slice(0, limit);
  const lines = list.map(r => `${r.rank}. ${r.name}（${r.rel}，基因共享 ${Math.round(r.shared * 100)}%）`);
  const text = `与${displayName}血缘最近的 ${list.length} 位族人（基因共享率越高越亲，最高 50%）：\n${lines.join('\n')}`;
  const tree = buildClosestTree(rows, self, displayName);
  tree.targetName = displayName;
  tree.adoptions = adoptionContextsFor(personId);
  return { text, list, tree };
}

module.exports = {
  ensureLoaded, getPerson, getPeopleByName,
  getAncestorList, getDescendantLevels, getSameGeneration,
  isAncestorOf, kinshipText, getDirectChain, describePerson,
  resolveNameCandidates, extractTargetName,
  answerLineage, answerFullLineage, answerClosest, resolveClosestTarget, adoptionContextsFor,
};
