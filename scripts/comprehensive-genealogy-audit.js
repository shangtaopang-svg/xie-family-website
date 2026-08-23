'use strict';

/**
 * 全面族谱审查：以交付版有效世系、上册/下册谱文和出继入继登记为交叉核对源。
 * 本脚本只生成审查报告，不自动猜测同名人物的父子或配偶关系。
 */
const fs = require('fs');
const path = require('path');
const delivery = require('../server/ai/delivery-source.js');
const lineage = require('../server/ai/lineage.js');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '交付_下枫槎谢氏世系图', '全面审查报告_20260823.md');
const CSV_OUT = path.join(ROOT, '交付_下枫槎谢氏世系图', '全面审查明细_20260823.csv');

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function text(v) { return v === null || v === undefined ? '' : String(v); }
function clean(v) { return text(v).replace(/\s+/g, '').trim(); }
function escReg(v) { return clean(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function nonEmpty(v) { return clean(v) !== ''; }
function recordLabel(p) { return `${p.name || '未命名'}（ID ${p.id}，第${p.generation_num || '—'}世）`; }
function csvEscape(v) {
  const value = text(v).replace(/\r?\n/g, ' ').replace(/"/g, '""');
  return `"${value}"`;
}

function parsePages(raw) {
  const pageRe = /=====\s*第(\d+)页\s*=====/g;
  const pages = [];
  let last = 0, page = 0, m;
  while ((m = pageRe.exec(raw))) {
    const body = raw.slice(last, m.index);
    if (body.trim()) pages.push({ page, body, compact: clean(body) });
    page = Number(m[1]);
    last = pageRe.lastIndex;
  }
  const tail = raw.slice(last);
  if (tail.trim()) pages.push({ page, body: tail, compact: clean(tail) });
  return pages;
}

function sourceMatches(person, pages) {
  const name = clean(person.name);
  if (!name || name.length < 2) return [];
  const re = new RegExp(escReg(name));
  return pages.filter((p) => re.test(p.compact));
}

function extractCourtesy(person, pages) {
  const name = clean(person.name);
  if (!name || name.length < 2) return [];
  const candidates = [];
  // 族谱中“字”通常紧跟一至两个字；不能贪多，否则会把“字汝发，业儒”
  // 误读成“汝发业儒”，也会把“字启祥，系云生公”连成一段。
  const re = new RegExp(`${escReg(name)}(?:公)?字([一-龥]{1,2})(?=(?:公(?:生|卒|配|墓|子|女)|号|生|卒|配|仕|任|居|葬|迁|墓|享|以|业|系|源|，|。))`, 'g');
  for (const page of pages) {
    let m;
    while ((m = re.exec(page.compact))) {
      const value = m[1].replace(/公$/, '');
      if (value && value.length <= 2 && value !== '诰封') candidates.push({ value, page: page.page });
    }
  }
  const values = [...new Set(candidates.map((x) => x.value))];
  return values.map((value) => ({ value, pages: [...new Set(candidates.filter((x) => x.value === value).map((x) => x.page))] }));
}

function sourceHints(person, pages) {
  const name = clean(person.name);
  const re = new RegExp(escReg(name));
  const hits = pages.filter((p) => re.test(p.compact));
  const joined = hits.map((p) => p.compact).join('');
  return {
    pages: [...new Set(hits.map((p) => p.page).filter((p) => p > 0))],
    hasBirth: /生(?:于|民国|乾隆|康熙|雍正|道光|咸丰|同治|光绪|宣统|一九|二〇|二二|甲|乙|丙|丁|戊|己|庚|辛|壬|癸)/.test(joined),
    hasDeath: /卒|殁|早逝|夭折|亡故|享年/.test(joined),
    hasBurial: /墓葬|葬于|葬在|合葬|公葬|墓在|葬/.test(joined),
    hasSpouse: /配|娶|续娶|妻|改适/.test(joined),
    hasCourtesy: /字|号/.test(joined),
    hasAdoption: /出继|入继|出祧|入祧|继子|兼祧|入赘|出赘|承嗣|立嗣/.test(joined),
  };
}

function fieldCount(people, key) {
  return people.filter((p) => nonEmpty(p[key])).length;
}

function detectParentIssues(people) {
  const byId = new Map(people.map((p) => [String(p.id), p]));
  const missingParent = [];
  const backwards = [];
  const gaps = [];
  const cycles = [];
  for (const p of people) {
    if (!nonEmpty(p.father_id)) continue;
    const parent = byId.get(String(p.father_id));
    if (!parent) { missingParent.push(`${recordLabel(p)} → 父ID ${p.father_id}不存在`); continue; }
    const g = Number(p.generation_num), pg = Number(parent.generation_num);
    if (Number.isFinite(g) && Number.isFinite(pg)) {
      if (g < pg) backwards.push(`${recordLabel(p)} → ${recordLabel(parent)}（子代世次低于父代）`);
      if (g - pg !== 1 && g >= 60) gaps.push(`${parent.name}（第${pg}世）→${p.name}（第${g}世），相差${g - pg}世`);
    }
    const seen = new Set([String(p.id)]);
    let cur = parent;
    while (cur && nonEmpty(cur.father_id)) {
      const id = String(cur.id);
      if (seen.has(id)) { cycles.push(recordLabel(p)); break; }
      seen.add(id); cur = byId.get(String(cur.father_id));
    }
  }
  return { missingParent, backwards, gaps, cycles };
}

function adoptionAudit(people) {
  const appText = read('交付_下枫槎谢氏世系图/app.js');
  const pairs = [];
  const pairRe = /registerExplicitPair\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(['"])(.*?)\4\s*,\s*(?:true|false)\s*\)/g;
  let m;
  while ((m = pairRe.exec(appText))) pairs.push({ outId: Number(m[1]), adoptiveId: Number(m[2]), adoptiveParentId: Number(m[3]), source: m[5] });
  const outIds = new Set(pairs.map((p) => String(p.outId)));
  const inIds = new Set(pairs.map((p) => String(p.adoptiveId)));
  const sourceOut = people.filter((p) => /出继|出祧|出嗣/.test([p.name, p.biography, p.adopt_note, p.notes].map(clean).join('')));
  const sourceIn = people.filter((p) => /入继|入祧|继子|祀子/.test([p.name, p.biography, p.adopt_note, p.notes].map(clean).join('')));
  return { pairs, sourceOut, sourceIn, outIds, inIds };
}

function duplicateAudit(people) {
  const byName = new Map();
  for (const p of people) (byName.get(clean(p.name)) || byName.set(clean(p.name), []).get(clean(p.name))).push(p);
  return [...byName.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([name, list]) => ({ name, list }))
    .sort((a, b) => b.list.length - a.list.length || a.name.localeCompare(b.name));
}

function buildReport() {
  const people = delivery.ensureLoaded().map((p) => ({ ...p }));
  const upper = parsePages(read('上册_竖排提取.txt'));
  const lower = parsePages(read('下册_竖排提取.txt'));
  const pages = upper.concat(lower);
  const sourceVitals = (() => {
    try {
      const raw = read('交付_下枫槎谢氏世系图/source-vitals.js');
      const m = raw.match(/=\s*(\{[\s\S]*\});?\s*$/);
      return m ? JSON.parse(m[1]) : {};
    } catch { return {}; }
  })();
  const parent = detectParentIssues(people);
  const adoption = adoptionAudit(people);
  const inLawRecords = people.filter((p) => /入赘|出赘|赘婿|赘子/.test([p.name, p.biography, p.adopt_note, p.notes].map(clean).join('')));
  const inLawFemaleConflicts = inLawRecords.filter((p) => text(p.gender).trim() === '女');
  const duplicates = duplicateAudit(people);
  const missingGender = people.filter((p) => !nonEmpty(p.gender));
  const statusMissing = people.filter((p) => !nonEmpty(p.is_alive));
  const effectiveMissingSourceFields = people.filter((p) => !nonEmpty(p.birth_date) || !nonEmpty(p.courtesy_name) || !nonEmpty(p.spouse_ids) || !nonEmpty(p.burial_place));

  const rows = people.map((p) => {
    const hints = sourceHints(p, pages);
    const courtesy = extractCourtesy(p, pages);
    return { p, hints, courtesy, sourceVital: sourceVitals[String(p.id)] || null };
  });
  const courtesyCandidates = rows.filter((r) => !nonEmpty(r.p.courtesy_name) && r.courtesy.length === 1);
  const byNameGeneration = new Map();
  for (const p of people) {
    const key = `${clean(p.name)}|${p.generation_num || ''}`;
    if (!byNameGeneration.has(key)) byNameGeneration.set(key, []);
    byNameGeneration.get(key).push(p);
  }
  const safeCourtesyCandidates = courtesyCandidates.filter((r) => {
    const key = `${clean(r.p.name)}|${r.p.generation_num || ''}`;
    return (byNameGeneration.get(key) || []).length === 1;
  });
  const sourceVitalCandidates = rows.filter((r) => r.sourceVital && (!nonEmpty(r.p.birth_date) || !nonEmpty(r.death_date)));
  const sourceVitalParentConflicts = rows.filter((r) => nonEmpty(r.p.vital_parent_conflict));
  const sourceDetailCandidates = rows.filter((r) => !nonEmpty(r.p.biography) && (r.hints.hasBirth || r.hints.hasDeath || r.hints.hasBurial || r.hints.hasSpouse));

  const lines = [];
  const add = (s = '') => lines.push(s);
  add('# 枫槎谢氏宗谱全面审查报告');
  add('');
  add(`审查日期：${new Date().toISOString().slice(0, 10)}；依据：上册.pdf、下册.pdf、交付版有效数据、现有出继/入继核定规则。`);
  add('');
  add('## 1. 审查范围与底数');
  add(`- 交付版有效记录：${people.length} 条（含 app.js 中已核定补录及父子修正后的有效读取结果）。`);
  add(`- 上册文本页块：${upper.filter((p) => p.page > 0).length}；下册文本页块：${lower.filter((p) => p.page > 0).length}。`);
  add(`- source-vitals 已有可追溯候选：${Object.keys(sourceVitals).length} 条，其中出生候选 ${Object.values(sourceVitals).filter((x) => x.birth_date).length} 条、卒年候选 ${Object.values(sourceVitals).filter((x) => x.death_date).length} 条。`);
  add('');
  add('## 2. 当前字段覆盖率');
  add('|字段|已填|缺失|覆盖率|');
  add('|---|---:|---:|---:|');
  for (const key of ['name','gender','generation_num','generation','father_id','birth_date','death_date','courtesy_name','spouse_ids','burial_place','biography','is_alive','branch']) {
    const filled = fieldCount(people, key);
    add(`|${key}|${filled}|${people.length - filled}|${(filled / people.length * 100).toFixed(1)}%|`);
  }
  add('');
  add('说明：缺失字段不等于谱书没有记录；本报告将“谱文可确认但当前字段为空”与“谱文未能唯一定位”分开列出，禁止自动猜测。');
  add(`- 本轮已把 source-vitals 中同 ID、同姓名的生卒候选并入有效读取层：当前有效出生字段 ${fieldCount(people, 'birth_date')} 条、卒年字段 ${fieldCount(people, 'death_date')} 条；仍需逐页复核的候选见明细 CSV。`);
  add(`- source-vitals 与当前人工核定父 ID 不一致的同 ID 记录：${sourceVitalParentConflicts.length} 条；已保留生卒候选，不覆盖当前父子核定。`);
  add('');
  add('## 3. 结构完整性');
  add(`- 父ID不存在：${parent.missingParent.length}`);
  add(`- 世次倒挂：${parent.backwards.length}`);
  add(`- 现代世次非相邻连接：${parent.gaps.length}`);
  add(`- 父系环路：${parent.cycles.length}`);
  if (parent.missingParent.length) parent.missingParent.forEach((x) => add(`  - ${x}`));
  if (parent.backwards.length) parent.backwards.forEach((x) => add(`  - ${x}`));
  if (parent.gaps.length) parent.gaps.forEach((x) => add(`  - ${x}`));
  add('');
  add('## 4. 出继、入继、入赘核对');
  add(`- 已登记成对关系：${adoption.pairs.length} 对；出继端 ${adoption.outIds.size} 条，入继端 ${adoption.inIds.size} 条。`);
  add(`- 由人物/备注文本识别的出继相关记录：${adoption.sourceOut.length}；入继相关记录：${adoption.sourceIn.length}。`);
  add(`- 现有显式配对数量是否相等：${adoption.outIds.size === adoption.inIds.size ? '是' : '否'}。`);
  add(`- 入赘/赘婿独立记录：${inLawRecords.length} 条；其中性别字段与“入赘”语义冲突：${inLawFemaleConflicts.length} 条。入赘不计入出继/入继配对。`);
  add('');
  add('## 5. 同名人物审查');
  add(`- 同名组：${duplicates.length} 组。查询时必须按 ID、世次、父亲、支系和出继/入继状态选择，不能按姓名自动猜测。`);
  for (const group of duplicates) {
    const detail = group.list.map((p) => `ID ${p.id}/第${p.generation_num}世/父ID ${p.father_id ?? '—'}/${p.branch || '未标支系'}`).join('；');
    add(`- **${group.name}**：${detail}`);
  }
  add('');
  add('## 6. 谱文可唯一提取、但当前字号为空的候选');
  add(`共 ${courtesyCandidates.length} 条；其中 ${safeCourtesyCandidates.length} 条同时满足“字号格式明确、姓名+世次唯一”，可进入人工确认后的安全写入批次。多候选或同名冲突不自动写入：`);
  for (const r of courtesyCandidates) add(`- ${recordLabel(r.p)}：字/号候选“${r.courtesy[0].value}”，谱页 ${r.courtesy[0].pages.join('、') || '未标页'}`);
  add('');
  add('## 7. 谱文可追溯但当前生卒字段为空的候选');
  add(`共 ${sourceVitalCandidates.length} 条；source-vitals 只作候选，不直接覆盖用户已手工清空的字段：`);
  for (const r of sourceVitalCandidates) {
    const v = r.sourceVital;
    add(`- ${recordLabel(r.p)}：${v.birth_date ? `出生=${v.birth_date}` : ''}${v.death_date ? `；卒年=${v.death_date}` : ''}；来源=${v.source || '谱文'}`);
  }
  add('');
  add('## 8. 谱文存在生卒/葬地/配偶线索但当前简介为空');
  add(`共 ${sourceDetailCandidates.length} 条。此清单需要逐条回到 PDF 版面确认，不能仅凭姓名命中自动合并：`);
  for (const r of sourceDetailCandidates) {
    const h = r.hints;
    const flags = [h.hasBirth && '生', h.hasDeath && '卒', h.hasBurial && '葬', h.hasSpouse && '配'].filter(Boolean).join('、');
    add(`- ${recordLabel(r.p)}：${flags}；谱页 ${h.pages.join('、') || '未标页'}`);
  }
  add('');
  add('## 9. 已确认的重点问题');
  add(`- 文杲：上册/下册均载“字克”，当前字段${nonEmpty(people.find((p) => p.name === '文杲')?.courtesy_name) ? '已补入' : '仍缺失'}。`);
  add('- 云略：上册载“字汝满”，且配赵岸王氏，生康熙四年八月廿三日、卒康熙三十三年四月十七日，合葬本里假山脚之原。');
  add('- 锡洛：上册第86页载“字景诰”，并有乾隆五十一年生、道光十四年卒、配罗氏、子三明启明卿明远、女一等信息。');
  add(`- 世荣：下册第25页载“绍宗之子世荣，早逝，无传”；当前状态虽为已故，简介${people.find((p) => p.name === '世荣')?.biography?.includes('早逝') ? '已呈现' : '仍未呈现'}“早逝”。`);
  add('');
  add('## 10. 审查结论');
  add('当前数据的父子结构和出继/入继关系已完成全量结构校验；字段补录采用分批审核：第6节安全候选先逐条确认后写入，第7节生卒候选保留来源与父 ID 冲突标记，第8节必须回到 PDF 原页逐条复核。任何同名、重复世次、配偶原始谱载和入赘记录均不自动合并。');
  add('');
  add('本报告由 `scripts/comprehensive-genealogy-audit.js` 生成，重新运行可复核。');
  return { people, adoption, duplicates, courtesyCandidates, safeCourtesyCandidates, sourceVitalCandidates, sourceDetailCandidates, rows, report: lines.join('\n') + '\n' };
}

if (require.main === module) {
  const result = buildReport();
  fs.writeFileSync(OUT, result.report, 'utf8');
  const duplicateNames = new Set(result.duplicates.flatMap((group) => group.list.map((p) => `${p.id}`)));
  const fatherById = new Map(result.people.map((p) => [String(p.id), p]));
  const csvHeader = ['ID', '姓名', '世次', '父ID', '父亲', '性别', '状态', '字/号', '出生字段', '卒年字段', '配偶字段', '葬地字段', '谱文页命中', '谱文生线索', '谱文卒线索', '谱文配偶线索', '谱文葬地线索', 'source-vitals出生候选', 'source-vitals卒年候选', 'source-vitals父ID冲突', '同名组', '复核标记'];
  const csvRows = result.rows.map(({ p, hints, sourceVital }) => {
    const flags = [];
    if (!nonEmpty(p.gender)) flags.push('缺性别');
    if (!nonEmpty(p.is_alive)) flags.push('缺在世状态');
    if (!nonEmpty(p.courtesy_name) && hints.hasCourtesy) flags.push('谱文有字号线索');
    if (!nonEmpty(p.birth_date) && (hints.hasBirth || sourceVital && sourceVital.birth_date)) flags.push('出生待补/复核');
    if (!nonEmpty(p.death_date) && (hints.hasDeath || sourceVital && sourceVital.death_date)) flags.push('卒年待补/复核');
    if (!nonEmpty(p.spouse_ids) && hints.hasSpouse) flags.push('配偶待补/复核');
    if (!nonEmpty(p.burial_place) && hints.hasBurial) flags.push('葬地待补/复核');
    if (nonEmpty(p.vital_parent_conflict)) flags.push('source-vitals父ID冲突，已保留生卒候选');
    if (duplicateNames.has(`${p.id}`)) flags.push('同名需按ID核对');
    const father = fatherById.get(String(p.father_id));
    return [p.id, p.name, p.generation_num, p.father_id, father ? father.name : '', p.gender, p.is_alive, p.courtesy_name, p.birth_date, p.death_date, p.spouse_ids, p.burial_place, hints.pages.join('、'), hints.hasBirth ? '有' : '', hints.hasDeath ? '有' : '', hints.hasSpouse ? '有' : '', hints.hasBurial ? '有' : '', sourceVital && sourceVital.birth_date || '', sourceVital && sourceVital.death_date || '', p.vital_parent_conflict || '', duplicateNames.has(`${p.id}`) ? '是' : '', flags.join('；')];
  });
  fs.writeFileSync(CSV_OUT, [csvHeader, ...csvRows].map((row) => row.map(csvEscape).join(',')).join('\r\n') + '\r\n', 'utf8');
  const safeOut = path.join(ROOT, '交付_下枫槎谢氏世系图', '全面审查安全写入清单_20260823.csv');
  const safeRows = result.safeCourtesyCandidates.map(({ p, courtesy }) => [
    '字号候选', p.id, p.name, p.generation_num, p.father_id || '', courtesy[0].value,
    courtesy[0].pages.join('、'), '需人工确认原页后写入'
  ]);
  fs.writeFileSync(safeOut, [['类别','ID','姓名','世次','父ID','候选内容','谱页','处理状态'], ...safeRows].map((row) => row.map(csvEscape).join(',')).join('\r\n') + '\r\n', 'utf8');
  const reviewOut = path.join(ROOT, '交付_下枫槎谢氏世系图', '全面审查PDF逐页复核清单_20260823.csv');
  const reviewRows = result.rows
    .filter(({ p, hints, sourceVital }) => (sourceVital && (p.vital_parent_conflict || !nonEmpty(p.birth_date) || !nonEmpty(p.death_date))) || (!nonEmpty(p.biography) && (hints.hasBirth || hints.hasDeath || hints.hasBurial || hints.hasSpouse)))
    .map(({ p, hints, sourceVital }) => [
      p.id, p.name, p.generation_num, p.father_id || '', hints.pages.join('、'),
      sourceVital && sourceVital.birth_date || '', sourceVital && sourceVital.death_date || '',
      [hints.hasBirth && '生', hints.hasDeath && '卒', hints.hasBurial && '葬', hints.hasSpouse && '配', p.vital_parent_conflict && '父ID冲突'].filter(Boolean).join('、'),
      '必须回到PDF原页确认后处理'
    ]);
  fs.writeFileSync(reviewOut, [['ID','姓名','世次','当前父ID','谱页候选','出生候选','卒年候选','核查类型','处理状态'], ...reviewRows].map((row) => row.map(csvEscape).join(',')).join('\r\n') + '\r\n', 'utf8');
  console.log(JSON.stringify({
    output: OUT,
    detailOutput: CSV_OUT,
    records: result.people.length,
    adoptionPairs: result.adoption.pairs.length,
    duplicateGroups: result.duplicates.length,
    courtesyCandidates: result.courtesyCandidates.length,
    safeCourtesyCandidates: result.safeCourtesyCandidates.length,
    sourceVitalCandidates: result.sourceVitalCandidates.length,
    sourceDetailCandidates: result.sourceDetailCandidates.length,
    safeOutput: safeOut,
    reviewOutput: reviewOut,
  }, null, 2));
}

module.exports = { buildReport };
