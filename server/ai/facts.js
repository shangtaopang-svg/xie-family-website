/**
 * server/ai/facts.js
 *
 * 结构化族谱事实查询。凡是能从 canonical genealogy.json 直接计算的事实，
 * 必须在这里确定性返回，不再交给大模型猜测。
 */
'use strict';

const deliverySource = require('./delivery-source.js');

let cache = null;
let cacheMtime = -1;

const ADOPTION_TERMS = /出继|入继|过继|出祧|入祧|兼祧|兼顶|随父出继/;
const COUNT_TERMS = /多少|几(?:个|组|处|人|条)?|统计|总共|合计|数量|人数|数目|共有/;
const LIST_TERMS = /列出|哪些|名单|一览|明细|详情|具体|全部|所有/;
const DEFINITION_TERMS = /什么是|含义|意思|区别|怎么理解/;
const PERSON_TERMS = /的?(?:出继|入继|过继|出祧|入祧|兼祧|兼顶|随父出继)(?:情况|关系|记录|说明|状态)?/;

function numberOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function text(value) {
  return String(value == null ? '' : value).trim();
}

function loadFacts() {
  const people = deliverySource.ensureLoaded();
  const mtime = deliverySource.getMtimeMs();
  if (cache && cacheMtime === mtime) return cache;
  cacheMtime = mtime;

  const byId = new Map((Array.isArray(people) ? people : []).map((person) => [numberOrNull(person.id), person]));
  const byName = new Map();
  for (const person of byId.values()) {
    const name = text(person.name);
    if (!name) continue;
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(person);
  }

  const groups = new Map();
  for (const person of byId.values()) {
    const pairId = text(person.adoption_pair_id);
    if (!pairId) continue;
    if (!groups.has(pairId)) groups.set(pairId, []);
    groups.get(pairId).push(person);
  }

  const invalidPairs = [];
  const pairs = [];
  for (const [pairId, records] of groups) {
    const out = records.find((person) => text(person.adoption_status) === 'out');
    const incoming = records.find((person) => text(person.adoption_status) === 'in');
    const outRef = out && (out.adoption_pair_out_id ?? out.adoption_out_id);
    const inRef = incoming && (incoming.adoption_pair_in_id ?? incoming.adoption_in_id);
    const parentRef = out && out.adoption_adoptive_parent_id;
    const outId = numberOrNull(outRef);
    const inId = numberOrNull(inRef);
    const adoptiveParentId = numberOrNull(parentRef);
    const complete = out && incoming && outId !== null && inId !== null && adoptiveParentId !== null &&
      numberOrNull(outRef) === outId && numberOrNull(inRef) === inId &&
      numberOrNull(incoming.adoption_adoptive_parent_id) === adoptiveParentId &&
      byId.has(outId) && byId.has(inId) && byId.has(adoptiveParentId);
    if (!complete) {
      invalidPairs.push({ pairId, recordIds: records.map((person) => person.id) });
      continue;
    }
    const biologicalParent = byId.get(numberOrNull(out.father_id)) || null;
    const adoptiveParent = byId.get(adoptiveParentId) || null;
    pairs.push({
      pairId,
      out,
      incoming,
      biologicalParent,
      adoptiveParent,
      generation: numberOrNull(out.generation_num),
      source: text(out.adoption_relation_source || incoming.adoption_relation_source || out.adopt_note || incoming.adopt_note),
      note: text(out.adopt_note || incoming.adopt_note)
    });
  }

  const followFather = Array.from(byId.values()).filter((person) => text(person.adoption_status) === 'follow-father');
  pairs.sort((a, b) => (a.generation || 0) - (b.generation || 0) || (numberOrNull(a.out.id) || 0) - (numberOrNull(b.out.id) || 0));
  cache = {
    people: Array.from(byId.values()),
    byId,
    byName,
    pairs,
    followFather,
    invalidPairs,
    source: '族谱管理后台 canonical 数据（data/genealogy.json）'
  };
  return cache;
}

function mentionedNames(query, facts) {
  const q = text(query);
  return Array.from(facts.byName.keys())
    .filter((name) => name.length >= 2 && q.includes(name))
    .sort((a, b) => b.length - a.length || q.indexOf(a) - q.indexOf(b));
}

function pairPersonNames(pair) {
  return new Set([
    text(pair.out.name),
    text(pair.incoming.name),
    text(pair.biologicalParent && pair.biologicalParent.name),
    text(pair.adoptiveParent && pair.adoptiveParent.name)
  ].filter(Boolean));
}

function followFatherPersonNames(record, facts) {
  const father = facts.byId.get(numberOrNull(record && record.father_id));
  return new Set([text(record && record.name), text(father && father.name)].filter(Boolean));
}

function formatPair(pair, index) {
  const generation = pair.generation ? `第${pair.generation}世` : '世次未录入';
  const biological = pair.biologicalParent ? pair.biologicalParent.name : '亲生父亲未录入';
  const adoptive = pair.adoptiveParent ? pair.adoptiveParent.name : '承嗣父未录入';
  const sourceParent = pair.source.match(/给\s*([\u4e00-\u9fff]{1,8})为嗣/);
  const adoptiveText = sourceParent && sourceParent[1] !== adoptive
    ? `${adoptive}（谱载关系原文为“${sourceParent[1]}”）`
    : adoptive;
  const special = pair.note.match(/兼祧|兼顶|双祧|兼继/);
  const note = special ? `；备注：${special[0]}` : '';
  return `${index}. ${pair.out.name}（${generation}）：亲生父亲${biological}，出继给${adoptiveText}为嗣${note}`;
}

function adoptionSummary(facts, pairs, followFather, scopeLabel) {
  const selectedPairs = Array.isArray(pairs) ? pairs : facts.pairs;
  const selectedFollowFather = Array.isArray(followFather) ? followFather : facts.followFather;
  const scope = scopeLabel ? `与“${scopeLabel}”相关的` : '';
  return [
    `按“出继记录与入继记录已建立有效配对”的口径统计${scope}：`,
    `出继—入继关系共 ${selectedPairs.length} 组；出继记录 ${selectedPairs.length} 条；入继记录 ${selectedPairs.length} 条。`,
    `两端记录合计 ${selectedPairs.length * 2} 条，但每组对应同一位出继入嗣人物，不应把两端相加当作不同人物数。`,
    `另有“随父出继”说明 ${selectedFollowFather.length} 条，未计入独立的出继—入继双记录关系。`,
    `数据来源：${facts.source}。`
  ].join('\n');
}

function adoptionPersonAnswer(query, names, facts) {
  const matches = facts.pairs.filter((pair) => {
    const namesInPair = pairPersonNames(pair);
    return names.some((name) => namesInPair.has(name));
  });
  if (!matches.length) return `后台当前未记录与“${names.join('、')}”对应的出继／入继配对。`;
  const lines = matches.map((pair, index) => formatPair(pair, index + 1));
  return `后台当前核定的出继／入继记录（${matches.length}组）：\n${lines.join('\n')}\n数据来源：${facts.source}。`;
}

/**
 * 返回 null 表示不是本模块负责的问题；返回对象表示必须走确定性结果。
 * aggregate 统计可供未验证访客查看；涉及姓名或名单的关系详情要求身份验证。
 */
function answerAdoption(query, options) {
  const q = text(query);
  if (!ADOPTION_TERMS.test(q)) return null;
  const facts = loadFacts();
  const names = mentionedNames(q, facts);
  const asksCount = COUNT_TERMS.test(q);
  const asksList = LIST_TERMS.test(q);
  const asksPerson = names.length > 0 && (PERSON_TERMS.test(q) || !asksCount || asksList);

  if (!asksCount && !asksList && !names.length && DEFINITION_TERMS.test(q)) {
    return {
      ok: true,
      factType: 'adoption-definition',
      answer: '在本族谱的结构化记录中，“出继”指人物仍保留在亲生父亲记录下，同时记载其出继给另一承嗣父；“入继”是同一关系在承嗣父名下的对应记录。具体关系以后台已核定的出继／入继配对字段为准。',
      sources: [facts.source]
    };
  }

  // 指定姓名的统计属于具体族人关系，同样需要身份验证；统计范围只限于命中的配对，
  // 不能把“某人有几条”误答成全族总数。
  if (asksCount && names.length) {
    if (!options || !options.identity) {
      return {
        requiresIdentity: true,
        code: 'AUTH_REQUIRED',
        message: '该问题涉及具体族人的出继／入继关系，需先完成族人身份验证。'
      };
    }
    const matches = facts.pairs.filter((pair) => Array.from(pairPersonNames(pair)).some((name) => names.includes(name)));
    const followMatches = facts.followFather.filter((record) => Array.from(followFatherPersonNames(record, facts)).some((name) => names.includes(name)));
    return {
      ok: true,
      factType: 'adoption-scoped-summary',
      answer: adoptionSummary(facts, matches, followMatches, names.join('、')),
      sources: [facts.source]
    };
  }

  if (asksPerson || asksList) {
    if (!options || !options.identity) {
      return {
        requiresIdentity: true,
        code: 'AUTH_REQUIRED',
        message: '该问题涉及具体族人的出继／入继关系，需先完成族人身份验证。'
      };
    }
    return {
      ok: true,
      factType: 'adoption-person',
      answer: names.length ? adoptionPersonAnswer(q, names, facts) :
        `后台当前核定的出继／入继关系共 ${facts.pairs.length} 组：\n${facts.pairs.map((pair, index) => formatPair(pair, index + 1)).join('\n')}\n数据来源：${facts.source}。`,
      sources: [facts.source]
    };
  }

  // 只要问题明确询问数量/统计，永远使用结构化统计；不经过 LLM。
  if (asksCount) {
    return { ok: true, factType: 'adoption-summary', answer: adoptionSummary(facts), sources: [facts.source] };
  }
  // 问题明确涉及出继／入继，但没有可安全识别的统计、名单或定义意图时，
  // 也不交给 LLM 自由发挥，避免把不完整资料拼成看似确定的答案。
  return {
    ok: true,
    factType: 'adoption-unresolved',
    answer: '该问题包含出继／入继内容，但当前无法从已核定的结构化字段直接确认，暂不作推断。请改问“出继和入继各有多少条”或打开族谱查询页的出继／入继一览表核对原始记录。',
    sources: [facts.source]
  };
}

function stats() {
  const facts = loadFacts();
  return {
    source: facts.source,
    pairCount: facts.pairs.length,
    outCount: facts.pairs.length,
    inCount: facts.pairs.length,
    followFatherCount: facts.followFather.length,
    invalidPairCount: facts.invalidPairs.length,
    pairIds: facts.pairs.map((pair) => pair.pairId)
  };
}

module.exports = { answerAdoption, stats, loadFacts };
