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
const CUMULATIVE_TERMS = /总共|一共|合计|累计|历经|连续|共/;

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

function loadStats() {
  const people = deliverySource.ensureLoaded();
  const records = Array.isArray(people) ? people.filter((person) => text(person && person.name)) : [];
  const generations = new Map();
  const legacyGenerations = new Map();
  let minGeneration = Infinity;
  let maxGeneration = 0;

  for (const person of records) {
    const generation = Number(person.generation_num);
    if (Number.isInteger(generation) && generation > 0) {
      generations.set(generation, (generations.get(generation) || 0) + 1);
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
    `按${stats.source}的全族统一世次字段（generation_num）统计：第${generation}世共 ${official} 人。`
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

function formatXieCumulative(stats, generations) {
  // 申伯于统一第65世得谢氏之姓；“谢氏家族31代”按第65世起连续31个统一世次解释。
  const start = 65;
  const end = start + generations - 1;
  const rangeRecords = stats.records.filter((person) => {
    const generation = Number(person.generation_num);
    return Number.isInteger(generation) && generation >= start && generation <= end;
  });
  const xieRecords = rangeRecords.filter((person) => String(person.branch || '').trim() !== '仍姓姜');
  return [
    `按谢氏得姓起点（统一第${start}世申伯）计算，连续${generations}世为第${start}世至第${end}世，族谱共记录 ${rangeRecords.length} 人。`,
    `其中“申甫”在原始数据中标注为“仍姓姜”，若只统计谢氏支系，则为 ${xieRecords.length} 人。`,
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
  const isXieCumulative = generation !== null && !hasExplicitGenerationPrefix &&
    /谢氏|谢家|谢氏家族/.test(q) && CUMULATIVE_TERMS.test(q);
  return {
    ok: true,
    factType: isOverall ? 'genealogy-total' : (isXieCumulative ? 'genealogy-generation-range-count' : 'genealogy-generation-count'),
    answer: isOverall ? formatOverall(stats) : (isXieCumulative ? formatXieCumulative(stats, generation) : formatGeneration(stats, generation)),
    sources: [stats.source]
  };
}

module.exports = { answer, loadStats, parseGeneration, formatXieCumulative };
