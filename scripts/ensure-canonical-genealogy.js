/**
 * 首次部署时把交付版世系图初始化为服务器唯一 canonical 数据。
 * 后续后台保存直接写 data/genealogy.json；检测到初始化标记后绝不覆盖后台修改。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const deliverySource = require('../server/ai/delivery-source.js');
const { normalizeLifeStatus } = require('../server/life-status.js');

const ROOT = path.resolve(__dirname, '..');
const dataDir = path.join(ROOT, 'data');
const dataFile = path.join(dataDir, 'genealogy.json');
const markerFile = path.join(dataDir, '.genealogy-canonical-initialized-v1');
const backupDir = path.join(ROOT, 'backups');

if (fs.existsSync(markerFile)) {
  console.log('[canonical] 已存在初始化标记，保留后台当前数据');
  process.exit(0);
}

const deliveryFile = path.join(ROOT, '交付_下枫槎谢氏世系图', 'data.js');
const appFile = path.join(ROOT, '交付_下枫槎谢氏世系图', 'app.js');
const vitalsFile = path.join(ROOT, '交付_下枫槎谢氏世系图', 'source-vitals.js');
if (!fs.existsSync(deliveryFile) || !fs.existsSync(appFile)) {
  throw new Error('缺少交付版世系图数据，停止初始化以避免覆盖服务器数据');
}

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(backupDir, { recursive: true });
if (fs.existsSync(dataFile)) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(dataFile, path.join(backupDir, `genealogy_pre_canonical_${stamp}.json`));
}

let list = deliverySource.parseDataJs(fs.readFileSync(deliveryFile, 'utf8'));
list = deliverySource.applyAppFatherCorrections(list, fs.readFileSync(appFile, 'utf8'));
if (fs.existsSync(vitalsFile)) list = deliverySource.applySourceVitals(list, fs.readFileSync(vitalsFile, 'utf8'));

const byId = new Map(list.map((p) => [Number(p.id), p]));
const appText = fs.readFileSync(appFile, 'utf8');
const pairRe = /registerExplicitPair\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'([^']*)'(?:\s*,\s*(?:true|false))?\s*\)/g;
let match;
let pairCount = 0;
while ((match = pairRe.exec(appText))) {
  const outId = Number(match[1]);
  const inId = Number(match[2]);
  const parentId = Number(match[3]);
  const source = match[4];
  const out = byId.get(outId);
  const adopted = byId.get(inId);
  if (!out || !adopted || !byId.has(parentId)) throw new Error(`交付版出继/入继关系缺少记录：${match[0]}`);
  const pairId = `${outId}:${inId}:${parentId}`;
  for (const person of [out, adopted]) {
    person.adoption_pair_id = pairId;
    person.adoption_out_id = outId;
    person.adoption_in_id = inId;
    person.adoption_adoptive_parent_id = parentId;
    person.adoption_relation_source = source;
    if (!String(person.adopt_note || '').trim()) person.adopt_note = source;
  }
  out.adoption_status = 'out';
  adopted.adoption_status = 'in';
  pairCount++;
}

list = normalizeLifeStatus(list);
const ids = new Set(list.map((p) => String(p.id)));
if (new Set(list.map((p) => String(p.id))).size !== list.length) throw new Error('交付版存在重复 ID，停止初始化');
if (list.some((p) => p.father_id !== null && p.father_id !== undefined && p.father_id !== '' && !ids.has(String(p.father_id)))) {
  throw new Error('交付版存在无效父 ID，停止初始化');
}

fs.writeFileSync(dataFile, JSON.stringify(list, null, 2), 'utf8');
fs.writeFileSync(markerFile, JSON.stringify({
  initializedAt: new Date().toISOString(),
  source: '交付_下枫槎谢氏世系图/data.js + app.js核定 + source-vitals.js',
  persons: list.length,
  explicitAdoptionPairs: pairCount
}, null, 2), 'utf8');
console.log(`[canonical] 已初始化 ${list.length} 条人物、${pairCount} 组出继/入继关系`);
