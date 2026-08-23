const fs = require('fs');
const vm = require('vm');

const box = { window: {} };
vm.createContext(box);
vm.runInContext(fs.readFileSync('交付_下枫槎谢氏世系图/data.js', 'utf8'), box);
const people = box.window.GENEALOGY_DATA || [];
const byId = new Map(people.map((person) => [String(person.id), person]));
const rawText = [
  fs.readFileSync('上册_竖排提取.txt', 'utf8'),
  fs.readFileSync('下册_竖排提取.txt', 'utf8')
].join('\n');
const source = rawText
  .replace(/===== 第\d+页 =====/g, '')
  .replace(/枫槎谢氏宗谱[^\n]*/g, '')
  .replace(/敦睦堂珍藏/g, '')
  .replace(/公元二二六年丙午春重修/g, '')
  .replace(/\s+/g, '');
const sourceLines = rawText.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !/^=====/.test(line));

function esc(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function explicitDeath(person) {
  const text = `${person.birth_date || ''}${person.biography || ''}`;
  return /(?:卒|殁|早逝|夭折|亡故|享年|墓葬|葬于|葬在|合葬|公葬)/.test(text);
}

function birthFromBook(person) {
  const father = byId.get(String(person.father_id));
  if (!father || !father.name || !person.name) return null;
  const bridge = `(?:公)?(?:之)?(?:长|次|三|四|五|六|七|八|九|十)?[男女]?(?:子|女)`;
  const relation = new RegExp(`${esc(father.name)}${bridge}${esc(person.name)}(.{0,90})`, 'g');
  const hits = [];
  let match;
  while ((match = relation.exec(source))) {
    const tail = match[1];
    const birth = tail.match(/(?:[^卒葬配子女]{0,12})?生((?:一|二|三|四|五|六|七|八|九|〇|零|○|十|百|千|元|正|闰|甲|乙|丙|丁|戊|己|庚|辛|壬|癸|子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥|年|月|日|初|廿|卅|时){4,45})/);
    if (birth) hits.push(`生${birth[1]}`);
  }
  const unique = [...new Set(hits)];
  return unique.length === 1 ? unique[0] : null;
}

function highConfidenceBirth(person) {
  const father = byId.get(String(person.father_id));
  if (!father || !father.name || !person.name) return null;
  const relation = new RegExp(`${esc(father.name)}(?:公)?(?:之)?(?:长|次|三|四|五|六|七|八|九|十)?(?:子|女)${esc(person.name)}`);
  const hits = [];
  for (let index = 0; index < sourceLines.length; index += 1) {
    const windowText = sourceLines.slice(index, index + 3).join('');
    const match = windowText.match(relation);
    if (!match) continue;
    const tail = windowText.slice((match.index || 0) + match[0].length, (match.index || 0) + match[0].length + 72);
    const birthIndex = tail.indexOf('生');
    if (birthIndex < 0) continue;
    const lead = tail.slice(0, birthIndex);
    if (/(?:配|子[一二三四五六七八九十]|女[一二三四五六七八九十]|之子|之女)/.test(lead)) continue;
    const birth = tail.slice(birthIndex).match(/^生((?:一|二|三|四|五|六|七|八|九|〇|零|○|十|百|千|元|正|闰|甲|乙|丙|丁|戊|己|庚|辛|壬|癸|子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥|年|月|日|初|廿|卅|时){4,45})/);
    if (birth) hits.push(`生${birth[1]}`);
  }
  const unique = [...new Set(hits)];
  return unique.length === 1 ? unique[0] : null;
}

function uniqueNameBirth(person) {
  if (!person.name || person.name.length < 2) return null;
  const hits = [];
  for (let index = 0; index < sourceLines.length; index += 1) {
    const windowText = sourceLines.slice(index, index + 2).join('');
    let cursor = windowText.indexOf(person.name);
    while (cursor >= 0) {
      const tail = windowText.slice(cursor + person.name.length, cursor + person.name.length + 58);
      const birthIndex = tail.indexOf('生');
      if (birthIndex >= 0) {
        const lead = tail.slice(0, birthIndex);
        if (!/(?:配|适|子|女)/.test(lead)) {
          const birth = tail.slice(birthIndex).match(/^生((?:一|二|三|四|五|六|七|八|九|〇|零|○|十|百|千|元|正|闰|甲|乙|丙|丁|戊|己|庚|辛|壬|癸|子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥|年|月|日|初|廿|卅|时){4,45})/);
          if (birth) hits.push(`生${birth[1]}`);
        }
      }
      cursor = windowText.indexOf(person.name, cursor + person.name.length);
    }
  }
  const unique = [...new Set(hits)];
  return unique.length === 1 ? unique[0] : null;
}

function deathAfterMarker(tail) {
  const deathIndex = tail.indexOf('卒');
  if (deathIndex < 0) return null;
  const lead = tail.slice(0, deathIndex);
  if (/(?:配|适|子[一二三四五六七八九十]|女[一二三四五六七八九十]|之子|之女)/.test(lead)) return null;
  const record = tail.slice(deathIndex, deathIndex + 72)
    .split(/(?:合葬|墓葬|葬于|葬在|公葬|葬|配|子[一二三四五六七八九十]|女[一二三四五六七八九十])/)[0]
    .trim();
  return record.length >= 2 ? record : null;
}

function highConfidenceDeath(person) {
  const father = byId.get(String(person.father_id));
  if (!father || !father.name || !person.name) return null;
  const relation = new RegExp(`${esc(father.name)}(?:公)?(?:之)?(?:长|次|三|四|五|六|七|八|九|十)?(?:子|女)${esc(person.name)}`);
  const hits = [];
  for (let index = 0; index < sourceLines.length; index += 1) {
    const windowText = sourceLines.slice(index, index + 4).join('');
    const match = windowText.match(relation);
    if (!match) continue;
    const tail = windowText.slice((match.index || 0) + match[0].length, (match.index || 0) + match[0].length + 115);
    const death = deathAfterMarker(tail);
    if (death) hits.push(death);
  }
  const unique = [...new Set(hits)];
  return unique.length === 1 ? unique[0] : null;
}

function uniqueNameDeath(person) {
  if (!person.name || person.name.length < 2) return null;
  const hits = [];
  for (let index = 0; index < sourceLines.length; index += 1) {
    const windowText = sourceLines.slice(index, index + 3).join('');
    let cursor = windowText.indexOf(person.name);
    while (cursor >= 0) {
      const death = deathAfterMarker(windowText.slice(cursor + person.name.length, cursor + person.name.length + 100));
      if (death) hits.push(death);
      cursor = windowText.indexOf(person.name, cursor + person.name.length);
    }
  }
  const unique = [...new Set(hits)];
  return unique.length === 1 ? unique[0] : null;
}

const results = people.map((person) => ({
  id: person.id,
  name: person.name,
  father_id: person.father_id,
  father: byId.get(String(person.father_id))?.name || '',
  explicit_dead: explicitDeath(person),
  birth_candidate: person.birth_date ? null : birthFromBook(person),
  high_confidence_birth: person.birth_date ? null : highConfidenceBirth(person),
  unique_name_birth: person.birth_date ? null : uniqueNameBirth(person),
  high_confidence_death: person.death_date ? null : highConfidenceDeath(person),
  unique_name_death: person.death_date ? null : uniqueNameDeath(person)
}));

const summary = {
  people: people.length,
  explicitDead: results.filter((item) => item.explicit_dead).length,
  birthCandidates: results.filter((item) => item.birth_candidate).length,
  highConfidenceBirths: results.filter((item) => item.high_confidence_birth).length,
  uniqueNameBirths: results.filter((item) => item.unique_name_birth).length,
  highConfidenceDeaths: results.filter((item) => item.high_confidence_death).length,
  uniqueNameDeaths: results.filter((item) => item.unique_name_death).length,
  deathMethodDisagreements: results.filter((item) => item.high_confidence_death && item.unique_name_death && item.high_confidence_death !== item.unique_name_death).length
};
if (process.argv.includes('--map') || process.argv.includes('--write')) {
  const map = Object.fromEntries(results
    .filter((item) => item.high_confidence_birth || item.unique_name_birth || item.high_confidence_death)
    .map((item) => [String(item.id), {
      name: item.name,
      father_id: item.father_id,
      birth_date: item.high_confidence_birth || item.unique_name_birth,
      death_date: item.high_confidence_death || '',
      source: '枫槎谢氏宗谱下册竖排谱文'
    }]));
  const output = `window.GENEALOGY_VITALS = ${JSON.stringify(map, null, 2)};\n`;
  if (process.argv.includes('--write')) {
    fs.writeFileSync('交付_下枫槎谢氏世系图/source-vitals.js', output, 'utf8');
    console.log(`wrote ${Object.keys(map).length} records`);
  } else {
    console.log(output);
  }
  process.exit(0);
}
console.log(JSON.stringify(summary, null, 2));
console.log(JSON.stringify(results.filter((item) => item.birth_candidate).slice(0, 160), null, 2));
console.log('HIGH_CONFIDENCE');
console.log(JSON.stringify(results.filter((item) => item.high_confidence_birth), null, 2));
