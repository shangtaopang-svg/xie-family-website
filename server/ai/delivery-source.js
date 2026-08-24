/**
 * server/ai/delivery-source.js
 *
 * 交付版独立世系图的唯一结构化读取入口。
 * 交付页面使用 data.js（window.GENEALOGY_DATA = [...]），服务端不执行页面脚本，
 * 只安全提取其中的 JSON 数组并按文件 mtime 自动重载。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { normalizeLifeStatus } = require('../life-status.js');

const DATA_FILE = path.join(__dirname, '..', '..', '交付_下枫槎谢氏世系图', 'data.js');
const APP_FILE = path.join(__dirname, '..', '..', '交付_下枫槎谢氏世系图', 'app.js');
const VITALS_FILE = path.join(__dirname, '..', '..', '交付_下枫槎谢氏世系图', 'source-vitals.js');

let data = [];
let mtimeMs = -1;
let appMtimeMs = -1;
let vitalsMtimeMs = -1;

function parseDataJs(text) {
  const match = String(text || '').match(/window\.GENEALOGY_DATA\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/);
  if (!match) throw new Error('未找到 window.GENEALOGY_DATA 数组');
  const parsed = JSON.parse(match[1]);
  if (!Array.isArray(parsed)) throw new Error('交付版世系数据不是数组');
  return parsed;
}

function parseSourceVitalsJs(text) {
  const match = String(text || '').match(/window\.GENEALOGY_VITALS\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (!match) throw new Error('未找到 window.GENEALOGY_VITALS 对象');
  const parsed = JSON.parse(match[1]);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('谱文生卒候选不是对象');
  return parsed;
}

/**
 * 把 source-vitals.js 中由上册/下册逐条提取的生卒候选合并到 AI 有效数据。
 * 只填充当前为空的字段；姓名和父 ID 必须同时吻合，避免同名人物串档。
 * 网页端已有同一规则，这里补上服务端后，AI、网页详情和寻根结果使用同一套生卒依据。
 */
function applySourceVitals(list, vitalsText) {
  let vitals = {};
  try { vitals = parseSourceVitalsJs(vitalsText); } catch (e) { return list; }
  const byId = new Map(list.map((p) => [Number(p.id), p]));
  for (const [id, vital] of Object.entries(vitals)) {
    const person = byId.get(Number(id));
    if (!person || !vital || String(person.name || '').trim() !== String(vital.name || '').trim()) continue;
    const parentConflict = vital.father_id !== null && vital.father_id !== undefined && vital.father_id !== '' &&
      person.father_id !== null && person.father_id !== undefined && person.father_id !== '' &&
      Number(person.father_id) !== Number(vital.father_id);
    // source-vitals 以稳定 ID 绑定人物；父 ID 可能因后续人工校勘而变化。
    // 因此不因旧父 ID 冲突而丢弃同一 ID 的生卒资料，而是留下冲突标记供审查报告追踪。
    if (parentConflict) person.vital_parent_conflict = `source-vitals父ID ${vital.father_id}；当前核定父ID ${person.father_id}`;
    if (!String(person.birth_date || '').trim() && String(vital.birth_date || '').trim()) person.birth_date = vital.birth_date;
    if (!String(person.death_date || '').trim() && String(vital.death_date || '').trim()) person.death_date = vital.death_date;
    if (!String(person.vital_source || '').trim() && String(vital.source || '').trim()) person.vital_source = vital.source;
    if (String(vital.death_date || '').trim() && person.is_alive !== true && String(person.is_alive || '').trim() !== '是') {
      person.is_alive = '否';
    }
  }
  return list;
}

/**
 * 交付页面会在 app.js 的 applyKnownPdfCorrections() 中执行经用户/PDF核定的父子修正。
 * AI 后端过去只读 data.js，导致“网页树正确、AI最亲关系图仍用旧父亲”。这里按源码顺序
 * 同步所有数字 ID 的 setFatherOf / clearFatherOf 调用；后出现的核定结论覆盖早期结论。
 */
function applyAppFatherCorrections(list, appText) {
  const source = String(appText || '');
  const map = new Map(list.map(p => [Number(p.id), p]));
  let m;

  // 把前端为谱文缺录人物补建的静态卡片同步给 AI。对象均来自本站受版本控制的 app.js，
  // 且在隔离上下文中只求值对象字面量；包含变量/函数的对象会被跳过。
  const ensureRe = /ensureRecord\(\s*(\{[\s\S]*?\})\s*\)/g;
  let em;
  while ((em = ensureRe.exec(source))) {
    try {
      const record = vm.runInNewContext('(' + em[1] + ')', Object.create(null), { timeout: 50 });
      if (record && Number.isFinite(Number(record.id)) && !map.has(Number(record.id))) {
        const clean = JSON.parse(JSON.stringify(record));
        list.push(clean);
        map.set(Number(clean.id), clean);
      }
    } catch (e) { /* 非静态对象不纳入 */ }
  }

  // 同步 app.js 中“const 某人 = getPerson(数字ID); 某人.father_id = 数字ID”的直接修正。
  // 早期校勘代码有一部分尚未统一改写成 setFatherOf()，AI也必须完整执行这些核定结果。
  const variableIds = new Map();
  const getPersonRe = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*getPerson\(\s*(\d+)\s*\)/g;
  while ((m = getPersonRe.exec(source))) variableIds.set(m[1], Number(m[2]));
  const assignedEnsureRe = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*ensureRecord\(\s*\{[\s\S]*?\bid\s*:\s*(\d+)[\s\S]*?\}\s*\)/g;
  while ((m = assignedEnsureRe.exec(source))) variableIds.set(m[1], Number(m[2]));
  for (const [varName, id] of variableIds) {
    const assignRe = new RegExp('\\b' + varName.replace(/[$]/g, '\\$&') + '\\.father_id\\s*=\\s*(\\d+|null)', 'g');
    let am;
    while ((am = assignRe.exec(source))) {
      const person = map.get(id);
      if (person) person.father_id = am[1] === 'null' ? null : Number(am[1]);
    }
  }

  // 同步 app.js 中对已定位人物的静态字段修正。此前服务端只同步 father_id，
  // 会导致前台已经显示“孝品/道清”等修正，而 AI 仍读取旧姓名或旧世次。
  // 这里只接受字面量右值，动态表单表达式一律跳过，避免执行用户输入或猜测。
  const staticFields = ['name', 'generation_num', 'generation', 'biography', 'gender', 'is_alive', 'birth_date', 'death_date', 'vital_source'];
  for (const [varName, id] of variableIds) {
    const person = map.get(id);
    if (!person) continue;
    const safeVar = varName.replace(/[$]/g, '\\$&');
    for (const field of staticFields) {
      const assignRe = new RegExp('\\b' + safeVar + '\\.' + field + '\\s*=\\s*([^;\\n]+)', 'g');
      let am;
      while ((am = assignRe.exec(source))) {
        const rhs = String(am[1]).trim();
        try {
          const value = vm.runInNewContext('(' + rhs + ')', Object.create(null), { timeout: 50 });
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
            person[field] = value;
          }
        } catch (e) { /* 动态表达式不纳入服务端同步 */ }
      }
    }
  }

  // 同步“把所有仍挂在旧重复卡片下的孩子转接到新卡片”的批量修正。
  const reparentRe = /String\(toId\(person\.father_id\)\)\s*===\s*['"](\d+)['"][\s\S]{0,90}?person\.father_id\s*=\s*(\d+)/g;
  while ((m = reparentRe.exec(source))) {
    const oldId = Number(m[1]), newId = Number(m[2]);
    list.forEach(p => { if (Number(p.father_id) === oldId) p.father_id = newId; });
  }

  const re = /\b(setFatherOf|clearFatherOf)\(\s*(\d+)(?:\s*,\s*(\d+|null))?/g;
  while ((m = re.exec(source))) {
    const person = map.get(Number(m[2]));
    if (!person) continue;
    if (m[1] === 'clearFatherOf') person.father_id = null;
    else if (m[3] === 'null') person.father_id = null;
    else if (m[3]) person.father_id = Number(m[3]);
  }

  // 同步前端明确删除的固定 ID 重复/误录卡片，避免其继续污染 AI 血缘排名。
  const removed = new Set();
  const removeRe = /state\.data\s*=\s*state\.data\.filter\(\(person\)\s*=>\s*String\(personId\(person\)\)\s*!==\s*['"](\d+)['"]\)/g;
  while ((m = removeRe.exec(source))) removed.add(Number(m[1]));
  if (removed.size) list = list.filter(p => !removed.has(Number(p.id)));

  // 最后安全闸：现代世系父子必须相差一代。仍不连续的边表示资料尚未校准，
  // 宁可暂不用于AI血缘推断，也不能把可疑关系作为确定答案输出。
  const finalMap = new Map(list.map(p => [Number(p.id), p]));
  list.forEach((p) => {
    const f = p.father_id ? finalMap.get(Number(p.father_id)) : null;
    const cg = Number(p.generation_num), fg = Number(f && f.generation_num);
    if (f && cg >= 133 && fg >= 133 && cg !== fg + 1) {
      p.ai_relation_warning = `代次不连续：${f.name}第${fg}世 → ${p.name}第${cg}世`;
      p.father_id = null;
    }
  });
  return list;
}

function ensureLoaded() {
  let stat = null, appStat = null, vitalsStat = null;
  try { stat = fs.statSync(DATA_FILE); } catch (e) { stat = null; }
  try { appStat = fs.statSync(APP_FILE); } catch (e) { appStat = null; }
  try { vitalsStat = fs.statSync(VITALS_FILE); } catch (e) { vitalsStat = null; }
  const nextMtime = stat ? stat.mtimeMs : -1;
  const nextAppMtime = appStat ? appStat.mtimeMs : -1;
  const nextVitalsMtime = vitalsStat ? vitalsStat.mtimeMs : -1;
  if (nextMtime === mtimeMs && nextAppMtime === appMtimeMs && nextVitalsMtime === vitalsMtimeMs) return data;
  mtimeMs = nextMtime;
  appMtimeMs = nextAppMtime;
  vitalsMtimeMs = nextVitalsMtime;
  if (!stat) {
    data = [];
    return data;
  }
  try {
    data = parseDataJs(fs.readFileSync(DATA_FILE, 'utf-8'));
    let appText = '';
    try { appText = fs.readFileSync(APP_FILE, 'utf-8'); } catch (e) { appText = ''; }
    data = applyAppFatherCorrections(data, appText);
    let vitalsText = '';
    try { vitalsText = fs.readFileSync(VITALS_FILE, 'utf-8'); } catch (e) { vitalsText = ''; }
    data = applySourceVitals(data, vitalsText);
    data = normalizeLifeStatus(data);
  } catch (e) {
    data = [];
    console.warn('[delivery-source] 读取交付版世系数据失败:', e.message);
  }
  return data;
}

function getFilePath() { return DATA_FILE; }
function getMtimeMs() { ensureLoaded(); return Math.max(mtimeMs, appMtimeMs, vitalsMtimeMs); }

module.exports = { ensureLoaded, getFilePath, getMtimeMs, parseDataJs, parseSourceVitalsJs, applyAppFatherCorrections, applySourceVitals };
