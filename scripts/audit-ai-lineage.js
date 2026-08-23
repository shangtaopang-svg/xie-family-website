'use strict';

const delivery = require('../server/ai/delivery-source.js');

const people = delivery.ensureLoaded();
const byId = new Map(people.map(p => [Number(p.id), p]));
const errors = [];
const warnings = [];

if (byId.size !== people.length) errors.push(`人物ID重复：记录${people.length}条，唯一ID${byId.size}条`);

for (const p of people) {
  const id = Number(p.id);
  const fatherId = p.father_id === null || p.father_id === undefined || p.father_id === '' ? null : Number(p.father_id);
  if (fatherId && !byId.has(fatherId)) errors.push(`${id} ${p.name} 的父亲ID ${fatherId} 不存在`);
  const father = fatherId ? byId.get(fatherId) : null;
  const cg = Number(p.generation_num), fg = Number(father && father.generation_num);
  if (father && cg >= 133 && fg >= 133 && cg !== fg + 1) {
    errors.push(`${father.name}(${fg}) → ${p.name}(${cg}) 代次不连续`);
  }
  if (p.ai_relation_warning) warnings.push(`${id} ${p.name}：${p.ai_relation_warning}`);

  const seen = new Set();
  let cur = p;
  while (cur && cur.father_id) {
    if (seen.has(Number(cur.id))) { errors.push(`${id} ${p.name} 的父系存在环路`); break; }
    seen.add(Number(cur.id));
    cur = byId.get(Number(cur.father_id));
  }
}

const mustBe = [
  ['宝根', 494, '昌贵', 453],
  ['令享', 481, '邦渠', 473],
  ['令华', 483, '邦源', 474],
  ['绍贤', 571, '昌勋', 396],
  ['绍玉', 556, '昌鳌', 1263],
];
for (const [name, id, fatherName, fatherId] of mustBe) {
  const p = byId.get(id), f = p && byId.get(Number(p.father_id));
  if (!p || p.name !== name || Number(p.father_id) !== fatherId || !f || f.name !== fatherName) {
    errors.push(`核定关系未生效：${fatherName} → ${name}`);
  }
}

const result = { records: people.length, uniqueIds: byId.size, errors, quarantinedWarnings: warnings };
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
