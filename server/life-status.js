'use strict';

// 生命状态只依据明确证据判定，不依据世次、年龄或记录顺序推断。
// 旧数据中大量“否”是转换时的默认值，因此没有谱文证据时必须还原为待核验。
const PLACEHOLDER_RE = /^(?:未详|未定|未知|未标注|不详|无|暂无|待核验|待确认|—|-|空|null|undefined)$/i;
const DEATH_RE = /(?:生娶卒葬俱失|生卒(?:俱失|均失|失考)|(?:^|[\s，,。；;：:、])卒(?:年|日|失|俱失|均失|无考|失考|于|后|时)|殁|早逝|夭折|亡故|享年|墓葬|葬于|葬在|墓在|合葬)/;
const ALIVE_RE = /(?:现年|在世|健在|尚健|尚在|仍健|生存|未卒|存世)/;

function text(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function meaningful(value) {
  const valueText = text(value);
  return Boolean(valueText) && !PLACEHOLDER_RE.test(valueText);
}

function rawStatus(value) {
  const valueText = text(value).toLowerCase();
  if (value === true || value === 1 || valueText === 'true' || valueText === '是' || valueText === '在世') return '是';
  if (value === false || value === 0 || valueText === 'false' || valueText === '否' || valueText === '已故') return '否';
  return '';
}

function lifeStatusInfo(person) {
  const record = person || {};
  const sourceText = [
    record.death_date,
    record.biography,
    record.vital_source,
    record.book_record,
    record.notes,
    record.adopt_note,
    record.status_source,
    // life_status_source 是本函数生成的结果，不能再次当成原始谱文证据。
  ].map(text).filter(Boolean).join(' ');
  const deathField = meaningful(record.death_date);
  const deathEvidence = deathField || DEATH_RE.test(sourceText);
  const aliveEvidence = ALIVE_RE.test(sourceText);
  const manual = rawStatus(record.is_alive);
  const explicitAlive = aliveEvidence || manual === '是';
  const conflict = record.life_status_conflict === true || (deathEvidence && explicitAlive);

  let status = '';
  let source = '待核验：没有明确生卒或在世依据';
  if (conflict) {
    status = '冲突';
    source = '状态冲突：同时存在已故与在世依据';
  } else if (deathEvidence) {
    status = '否';
    source = deathField ? '依据卒年/卒日字段' : '依据谱文卒、殁、早逝或葬载';
  } else if (explicitAlive) {
    status = '是';
    source = aliveEvidence ? '依据谱文在世/健在记载' : '依据人工核定的在世状态';
  }
  return { status, source, conflict, deathEvidence, aliveEvidence };
}

function normalizeLifeStatus(records) {
  return (Array.isArray(records) ? records : []).map((record) => {
    const next = { ...record };
    const info = lifeStatusInfo(next);
    next.is_alive = info.status === '是' ? '是' : info.status === '否' ? '否' : '';
    next.life_status = info.status;
    next.life_status_label = info.status === '是' ? '在世' : info.status === '否' ? '已故' : info.status === '冲突' ? '状态冲突' : '待核验';
    next.life_status_source = info.source;
    next.life_status_conflict = info.conflict;
    return next;
  });
}

module.exports = { lifeStatusInfo, normalizeLifeStatus };
