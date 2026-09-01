/**
 * server/ai/genealogy-stats.js
 *
 * 族谱总人数与指定世次统计。此类问题必须直接读取 canonical 数据，
 * 不交给大模型从检索片段估算。
 */
'use strict';

const deliverySource = require('./delivery-source.js');

const COUNT_TERMS = /多少|几(?:个|位|名|人)?|总共|一共|共有|合计|人数|数量|统计/;
const OVERALL_TERMS = /总人数|从(?:炎帝|神农氏?)(?:到|至).*(?:现在|当前|今天|如今|目前)|(?:炎帝|神农氏?).*(?:到|至).*(?:现在|当前|今天|如今|目前)|全族|全谱|整个族谱|所有世次/;
const ALIVE_TERMS = /目前在世|在世|健在|尚在|仍健|生存|未卒/;
const DEAD_TERMS = /已故|去世|死亡|逝世|亡故|卒|殁/;
const UNKNOWN_STATUS_TERMS = /待核验|待确认|状态不明|未标注|未知/;
const EXPLICIT_GLOBAL_TERMS = /炎帝|神农|统一世次|全族统一|全谱统一/;

// 族谱页面同时保存“炎帝统一世次”（generation_num）和各支系局部世次
// （generation）。AI 咨询的默认口径必须与用户约定一致：用户只说“第N世/N世/N代”
// 或“谢氏家族中第N代”时，一律按炎帝起算的全族统一世次；只有明确写出支系名称时，
// 才按该支系的局部世次换算。
const LOCAL_GENERATION_SCOPES = [
  { key: 'shenbo', label: '申伯', offset: 64, terms: /申伯/ },
  { key: 'dongshan', label: '始宁东山', offset: 98, terms: /始宁|东山/ },
  { key: 'linhai', label: '临海下渡', offset: 121, terms: /临海|下渡/ },
  { key: 'shima', label: '石马（下谢）', offset: 129, terms: /石马|下谢/ },
  { key: 'fengcha', label: '枫槎（下枫槎本宗）', offset: 131, terms: /枫槎|下枫槎/ }
];

function text(value) {
  return String(value == null ? '' : value).trim();
}

function chineseNumber(value) {
  const source = text(value);
  if (/^\d+$/.test(source)) return Number(source);
  const digits = { 零: 0,〇: 0,一: 1,二: 2,两: 2,三: 3,四: 4,五: 5,六: 6,七: 7,八: 8,九: 9 };
  if (!source || !Array.from(source).every((char) => digits[char] !== undefined || char === '十' || char === '百')) return null;
  let total = 0;
  let section = 0;
  let number = 0;
  for (const char of source) {
    if (digits[char] !== undefined) {
      number = digits[char];
    } else if (char === '十') {
      section += (number || 1) * 10;
      number = 0;
    } else if (char === '百') {
      section += (number || 1) * 100;
      number = 0;
    }
  }
  total = section + number;
  return total > 0 ? total : null;
}

function parseGeneration(query) {
  const q = text(query);
  const match = q.match(/(?:第\s*)?(\d{1,3}|[零〇一二两三四五六七八九十百]{1,6})\s*(?:世|代)/);
  if (!match) return null;
  const generation = chineseNumber(match[1]);
  return Number.isInteger(generation) && generation > 0 ? generation : null;
}

function lifeStatus(person) {
  const status = text(person && (person.life_status || person.is_alive));
  if (status === '是' || status === '否' || status === '冲突') return status;
  return '';
}

function emptyGenerationStats() {
  return { total: 0, alive: 0, dead: 0, unknown: 0, conflict: 0, records: [] };
}

function addPersonToGenerationStats(bucket, person) {
  bucket.total += 1;
  bucket.records.push(person);
  const status = lifeStatus(person);
  if (status === '是') bucket.alive += 1;
  else if (status === '否') bucket.dead += 1;
  else if (status === '冲突') bucket.conflict += 1;
  else bucket.unknown += 1;
}

function statusFilter(query) {
  const q = text(query);
  if (UNKNOWN_STATUS_TERMS.test(q)) return 'unknown';
  if (DEAD_TERMS.test(q)) return 'dead';
  if (ALIVE_TERMS.test(q)) return 'alive';
  return '';
}

function resolveLocalScope(query) {
  const q = text(query);
  // 用户明确以炎帝/神农或“统一世次”提问时，即使句子中同时出现支系名称，
  // 也必须保持全族统一世次，不再进行局部世次换算。
  if (EXPLICIT_GLOBAL_TERMS.test(q)) return null;
  for (const scope of LOCAL_GENERATION_SCOPES) {
    if (scope.terms.test(q)) return scope;
  }
  // 没有明确支系名称时返回 null，让调用方直接使用 generation_num。
  return null;
}

function loadStats() {
  const people = deliverySource.ensureLoaded();
  const records = Array.isArray(people) ? people.filter((person) => text(person && person.name)) : [];
  const generations = new Map();
  const generationStats = new Map();
  const legacyGenerations = new Map();
  let minGeneration = Infinity;
  let maxGeneration = 0;

  for (const person of records) {
    const generation = Number(person.generation_num);
    if (Number.isInteger(generation) && generation > 0) {
      generations.set(generation, (generations.get(generation) || 0) + 1);
      if (!generationStats.has(generation)) generationStats.set(generation, emptyGenerationStats());
      addPersonToGenerationStats(generationStats.get(generation), person);
      minGeneration = Math.min(minGeneration, generation);
      maxGeneration = Math.max(maxGeneration, generation);
    }
    const legacy = Number(person.generation);
    if (Number.isInteger(legacy) && legacy > 0) {
      legacyGenerations.set(legacy, (legacyGenerations.get(legacy) || 0) + 1);
    }
  }

  return {
    records,
    generations,
    generationStats,
    legacyGenerations,
    minGeneration: Number.isFinite(minGeneration) ? minGeneration : null,
    maxGeneration,
    source: '族谱管理后台 canonical 数据（data/genealogy.json）'
  };
}

function formatOverall(stats) {
  const range = stats.minGeneration && stats.maxGeneration
    ? `第${stats.minGeneration}世至第${stats.maxGeneration}世`
    : '世次范围未录入';
  return [
    `按${stats.source}统计，从炎帝神农氏到当前族谱记录共 ${stats.records.length} 人。`,
    `统计口径：每个 canonical 人物 ID 计 1 人；同名但不同 ID 的分支记录分别计入，不使用大模型估算。`,
    `当前记录的统一世次范围为${range}。`
  ].join('\n');
}

function formatGeneration(stats, generation) {
  const official = stats.generations.get(generation) || 0;
  const legacy = stats.legacyGenerations.get(generation) || 0;
  const lines = [
    `按${stats.source}的全族统一世次字段（generation_num，从炎帝神农氏第1世起算）统计：第${generation}世共 ${official} 人。`
  ];
  if (legacy !== official) {
    lines.push(`补充说明：原始数据另有支系局部代数字段（generation）为“${generation}”的 ${legacy} 条记录；该字段不是全族统一世次，不能与第${generation}世混用。`);
  }
  if (official === 0 && legacy > 0) {
    const legacyPeople = stats.records
      .filter((person) => Number(person.generation) === generation)
      .map((person) => `${person.name}（统一第${person.generation_num}世）`)
      .join('、');
    lines.push(`这些局部代数记录为：${legacyPeople}。`);
  }
  lines.push(`数据来源：${stats.source}。`);
  return lines.join('\n');
}

function formatGenerationStatus(stats, generation, scope, requestedStatus) {
  const bucket = stats.generationStats.get(generation) || emptyGenerationStats();
  const scopeLabel = scope
    ? `${scope.label}第${scope.localGeneration}世（对应炎帝起算统一第${generation}世）`
    : `炎帝起算统一第${generation}世`;
  const lines = [];
  if (requestedStatus === 'alive') {
    lines.push(`${scopeLabel}目前明确标记为“在世”的人数：${bucket.alive} 人。`);
  } else if (requestedStatus === 'dead') {
    lines.push(`${scopeLabel}明确标记为“已故”的人数：${bucket.dead} 人。`);
  } else if (requestedStatus === 'unknown') {
    lines.push(`${scopeLabel}状态为“待核验”的人数：${bucket.unknown} 人。`);
  } else {
    lines.push(`${scopeLabel}当前共记录 ${bucket.total} 人。`);
  }
  lines.push(`状态拆分：在世 ${bucket.alive} 人；已故 ${bucket.dead} 人；待核验 ${bucket.unknown} 人${bucket.conflict ? `；状态冲突 ${bucket.conflict} 人` : ''}。`);
  if (requestedStatus === 'alive' && bucket.unknown > 0) {
    lines.push(`注意：待核验的 ${bucket.unknown} 人不能直接算作在世，因此现有后台数据无法据此确认“实际目前在世总人数”是否等于 ${bucket.alive} 人。`);
    lines.push(`若仅按“尚未标注已故”作候选口径，最多可纳入 ${bucket.unknown} 人；这不是已核实的在世人数。`);
  }
  lines.push(`统计口径：每个 canonical 人物 ID 计 1 人；数据来源：${stats.source}。`);
  return lines.join('\n');
}

function formatXieCumulative(stats, generations) {
  // 兼容旧问法：只有明确出现“连续/历经/从……到……”时，才按世次区间累计。
  const start = 65;
  const end = start + generations - 1;
  const rangeRecords = stats.records.filter((person) => {
    const generation = Number(person.generation_num);
    return Number.isInteger(generation) && generation >= start && generation <= end;
  });
  const xieRecords = rangeRecords.filter((person) => String(person.branch || '').trim() !== '仍姓姜');
  return [
    `按谢氏得姓起点（统一第${start}世申伯）计算，连续${generations}世为第${start}世至第${end}世，谢氏支系共记录 ${xieRecords.length} 人。`,
    `同一世次区间的全部族谱记录为 ${rangeRecords.length} 条；其中“申甫”标注为“仍姓姜”，不计入谢氏支系。`,
    `这不是“统一第${generations}世”的人数；若你问的是第${generations}世本身，请按该世次统计。`,
    `数据来源：${stats.source}。`
  ].join('\n');
}

/** 返回 null 表示不是本模块负责的问题。 */
function answer(query) {
  const q = text(query);
  if (!q || !COUNT_TERMS.test(q)) return null;

  const generation = parseGeneration(q);
  const isOverall = OVERALL_TERMS.test(q) || (/炎帝|神农/.test(q) && /多少人|总共|一共|共有|人数|数量/.test(q) && !generation);
  if (!isOverall && generation === null) return null;

  const stats = loadStats();
  const hasExplicitGenerationPrefix = /第\s*(?:\d{1,3}|[零〇一二两三四五六七八九十百]{1,6})\s*(?:世|代)/.test(q);
  const requestedStatus = statusFilter(q);
  const localScope = generation !== null ? resolveLocalScope(q) : null;
  const isXieCumulative = generation !== null && !hasExplicitGenerationPrefix &&
    /谢氏|谢家|谢氏家族/.test(q) && /(?:连续|历经|从.*到)/.test(q);
  const localGeneration = localScope && generation !== null ? generation : null;
  const scopedGeneration = localGeneration !== null ? localGeneration + localScope.offset : generation;
  return {
    ok: true,
    factType: isOverall ? 'genealogy-total' : (isXieCumulative ? 'genealogy-generation-range-count' : (requestedStatus ? 'genealogy-generation-status-count' : 'genealogy-generation-count')),
    answer: isOverall ? formatOverall(stats) : (isXieCumulative
      ? formatXieCumulative(stats, generation)
      : (requestedStatus || localScope ? formatGenerationStatus(stats, scopedGeneration, localScope && { ...localScope, localGeneration }, requestedStatus) : formatGeneration(stats, generation))),
    sources: [stats.source]
  };
}

module.exports = { answer, loadStats, parseGeneration, formatXieCumulative };
