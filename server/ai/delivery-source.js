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

const DATA_FILE = path.join(__dirname, '..', '..', '交付_下枫槎谢氏世系图', 'data.js');
const APP_FILE = path.join(__dirname, '..', '..', '交付_下枫槎谢氏世系图', 'app.js');

let data = [];
let mtimeMs = -1;

function parseDataJs(text) {
  const match = String(text || '').match(/window\.GENEALOGY_DATA\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/);
  if (!match) throw new Error('未找到 window.GENEALOGY_DATA 数组');
  const parsed = JSON.parse(match[1]);
  if (!Array.isArray(parsed)) throw new Error('交付版世系数据不是数组');
  return parsed;
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
  let stat = null;
  try { stat = fs.statSync(DATA_FILE); } catch (e) { stat = null; }
  const nextMtime = stat ? stat.mtimeMs : -1;
  if (nextMtime === mtimeMs) return data;
  mtimeMs = nextMtime;
  if (!stat) {
    data = [];
    return data;
  }
  try {
    data = parseDataJs(fs.readFileSync(DATA_FILE, 'utf-8'));
    let appText = '';
    try { appText = fs.readFileSync(APP_FILE, 'utf-8'); } catch (e) { appText = ''; }
    data = applyAppFatherCorrections(data, appText);
  } catch (e) {
    data = [];
    console.warn('[delivery-source] 读取交付版世系数据失败:', e.message);
  }
  return data;
}

function getFilePath() { return DATA_FILE; }
function getMtimeMs() { ensureLoaded(); return mtimeMs; }

module.exports = { ensureLoaded, getFilePath, getMtimeMs, parseDataJs, applyAppFatherCorrections };
