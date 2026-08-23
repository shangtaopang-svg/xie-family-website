const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, '交付_下枫槎谢氏世系图', 'data.js');
const outDir = path.join(root, 'logo');
const source = fs.readFileSync(sourcePath, 'utf8')
  .replace(/^window\.GENEALOGY_DATA\s*=\s*/, '')
  .replace(/;?\s*$/, '');
const people = JSON.parse(source);
const byId = new Map(people.map(person => [person.id, person]));
const children = new Map(people.map(person => [person.id, []]));
for (const person of people) {
  if (person.father_id && children.has(person.father_id)) children.get(person.father_id).push(person.id);
}
for (const ids of children.values()) ids.sort((a, b) => {
  const left = byId.get(a); const right = byId.get(b);
  return (left.generation_num - right.generation_num) || (a - b);
});

const escapeXml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const palettes = {
  '彬': { primary: '#3d7964', accent: '#c9a464', special: '#b4674e' },
  '乾': { primary: '#4b7184', accent: '#c9a464', special: '#b4674e' },
  '文对': { primary: '#a85e46', accent: '#d0aa67', special: '#6c8b7b' },
};

function descendantsOf(id, selected) {
  const queue = [id];
  while (queue.length) {
    const current = queue.shift();
    for (const childId of children.get(current) || []) {
      selected.add(childId);
      queue.push(childId);
    }
  }
}

function ancestorsOf(id, selected) {
  let current = byId.get(id);
  while (current) {
    selected.add(current.id);
    current = current.father_id ? byId.get(current.father_id) : null;
  }
}

function makeBranch(targetName) {
  const target = people.find(person => person.name === targetName);
  if (!target) throw new Error(`未找到目标人物：${targetName}`);
  const selected = new Set();
  ancestorsOf(target.id, selected);
  descendantsOf(target.id, selected);
  const nodes = people.filter(person => selected.has(person.id));
  const nodeIds = new Set(nodes.map(person => person.id));
  const localChildren = new Map(nodes.map(person => [person.id, (children.get(person.id) || []).filter(id => nodeIds.has(id))]));
  const roots = nodes.filter(person => !person.father_id || !nodeIds.has(person.father_id));
  const leafMemo = new Map();
  function leafSpan(id, visiting = new Set()) {
    if (leafMemo.has(id)) return leafMemo.get(id);
    if (visiting.has(id)) return 1;
    visiting.add(id);
    const ids = localChildren.get(id) || [];
    const span = ids.length ? ids.reduce((sum, childId) => sum + leafSpan(childId, visiting), 0) : 1;
    visiting.delete(id);
    leafMemo.set(id, span);
    return span;
  }
  const positions = new Map();
  let cursor = 0;
  function layout(id, start, visiting = new Set()) {
    if (visiting.has(id)) { positions.set(id, start + .5); return 1; }
    visiting.add(id);
    const ids = localChildren.get(id) || [];
    if (!ids.length) { positions.set(id, start + .5); visiting.delete(id); return 1; }
    let offset = start;
    for (const childId of ids) offset += layout(childId, offset, visiting);
    const xs = ids.map(childId => positions.get(childId)).filter(Number.isFinite);
    positions.set(id, xs.length ? (xs[0] + xs[xs.length - 1]) / 2 : start + .5);
    visiting.delete(id);
    return Math.max(1, offset - start);
  }
  roots.sort((a, b) => (a.generation_num - b.generation_num) || (a.id - b.id));
  for (const rootNode of roots) { const span = leafSpan(rootNode.id); layout(rootNode.id, cursor); cursor += span + 1; }
  const generations = [...new Set(nodes.map(person => Number(person.generation_num)))].filter(Number.isFinite).sort((a, b) => a - b);
  const rows = new Map(generations.map((generation, index) => [generation, index + 3]));
  const palette = palettes[targetName];
  const colorFor = person => {
    if (!person.father_id || person.highlight) return palette.accent;
    if (person.branch && /入继|出继/.test(person.branch)) return palette.special;
    if (person.branch && /枫槎/.test(person.branch)) return palette.primary;
    return '#707575';
  };
  const point = person => ({ x: positions.get(person.id) + 3, y: rows.get(Number(person.generation_num)) || 3 });
  const edges = nodes.filter(person => person.father_id && nodeIds.has(person.father_id)).map(person => {
    const from = point(byId.get(person.father_id)); const to = point(person);
    return `<path d="M ${from.x.toFixed(2)} ${from.y.toFixed(2)} L ${to.x.toFixed(2)} ${to.y.toFixed(2)}"/>`;
  }).join('');
  const nodeMarkup = nodes.map(person => {
    const p = point(person); const size = (!person.father_id || person.highlight) ? 1.2 : .78; const half = size / 2;
    return `<rect class="node" x="${(p.x - half).toFixed(2)}" y="${(p.y - half).toFixed(2)}" width="${size}" height="${size}" fill="${colorFor(person)}"><title>${escapeXml(`${person.name}｜第${person.generation_num}世｜ID ${person.id}`)}</title></rect>`;
  }).join('');
  const maxX = Math.max(...positions.values());
  const maxY = generations.length + 2;
  function compactMarkup(columns, rowCount, x, y, width, height) {
    const cells = new Map();
    for (const person of nodes) {
      const p = point(person);
      const col = Math.max(0, Math.min(columns - 1, Math.floor((p.x - 3) / maxX * columns)));
      const row = Math.max(0, Math.min(rowCount - 1, Math.floor((p.y - 3) / (maxY - 3) * rowCount)));
      const key = `${col}:${row}`; const cell = cells.get(key) || { count: 0, color: colorFor(person) };
      cell.count += 1; if (!person.father_id || person.highlight) cell.color = palette.accent;
      cells.set(key, cell);
    }
    const cellWidth = width / columns; const cellHeight = height / rowCount;
    return [...cells.entries()].map(([key, cell]) => {
      const [col, row] = key.split(':').map(Number); const size = Math.max(.7, Math.min(cellWidth, cellHeight) * .66);
      const px = x + col * cellWidth + (cellWidth - size) / 2; const py = y + row * cellHeight + (cellHeight - size) / 2;
      const opacity = Math.min(.96, .38 + cell.count * .11);
      return `<rect x="${px.toFixed(2)}" y="${py.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" fill="${cell.color}" opacity="${opacity.toFixed(2)}"><title>${cell.count} 条真实记录聚合于此</title></rect>`;
    }).join('');
  }
  const baseStyle = `.bg{fill:#090c0b}.edge{fill:none;stroke:${palette.primary};stroke-width:.18;opacity:.34;shape-rendering:crispEdges}.node{shape-rendering:crispEdges}.brand{fill:#f1eadb;font-family:"Noto Serif SC","Microsoft YaHei",serif}.sub{fill:${palette.accent};font-family:"Noto Sans SC","Microsoft YaHei",sans-serif}.meta{fill:#89928e;font-family:"Noto Sans SC","Microsoft YaHei",sans-serif}`;
  const fullWidth = cursor + 6; const fullHeight = generations.length + 7;
  const headerMap = compactMarkup(108, 42, 14, 56, 344, 88);
  const squareMap = compactMarkup(72, 72, 18, 11, 92, 92);
  const prefix = `枫槎谢氏-星脉图-${targetName}世系`;
  const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- target=${targetName}; source=data.js; people=${nodes.length}; ancestors+descendants; layout=parent-child -->\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fullWidth} ${fullHeight}" role="img"><title>炎帝至${targetName}及后代·完整世系</title><style>${baseStyle}.brand{font-size:3.6px}</style><rect class="bg" width="${fullWidth}" height="${fullHeight}"/><g class="edge">${edges}</g><g>${nodeMarkup}</g><text x="${fullWidth / 2}" y="${fullHeight - 1.3}" text-anchor="middle" class="brand">炎帝至${targetName}及后代 · 完整世系</text></svg>`;
  const headerSvg = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- target=${targetName}; source=data.js; people=${nodes.length}; variant=3x1-density -->\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 180" role="img"><title>炎帝至${targetName}及后代·横版星脉图</title><style>${baseStyle}.brand{font-size:13px}.sub{font-size:8px}.meta{font-size:5px}</style><rect class="bg" width="540" height="180"/><rect x="13" y="55" width="346" height="90" fill="none" stroke="${palette.primary}" stroke-width=".55" opacity=".75"/><g>${headerMap}</g><g transform="translate(390 62)"><text x="0" y="0" class="brand">${targetName}世系</text><text x="0" y="18" class="sub">炎帝至${targetName} · 及全部后代</text><text x="0" y="34" class="meta">${nodes.length} 条真实记录 · ${generations.length} 代行</text></g></svg>`;
  const squareSvg = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- target=${targetName}; source=data.js; people=${nodes.length}; variant=square-density -->\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img"><title>炎帝至${targetName}及后代·方形主标</title><style>${baseStyle}.brand{font-size:4.8px}.sub{font-size:2.7px}</style><rect class="bg" width="128" height="128"/><rect x="17.5" y="10.5" width="93" height="93" fill="none" stroke="${palette.primary}" stroke-width=".35" opacity=".75"/><g>${squareMap}</g><text x="64" y="115" text-anchor="middle" class="brand">${targetName}世系</text><text x="64" y="121" text-anchor="middle" class="sub">炎帝至${targetName} · 星脉图</text></svg>`;
  fs.writeFileSync(path.join(outDir, `${prefix}-完整展开.svg`), fullSvg, 'utf8');
  fs.writeFileSync(path.join(outDir, `${prefix}-横版.svg`), headerSvg, 'utf8');
  fs.writeFileSync(path.join(outDir, `${prefix}-方形.svg`), squareSvg, 'utf8');
  return { target: targetName, targetId: target.id, people: nodes.length, generations: generations.length, fullWidth, fullHeight };
}

const results = ['彬', '乾', '文对'].map(makeBranch);
fs.writeFileSync(path.join(outDir, 'README-三支世系Logo.md'), [
  '# 三支世系星脉 Logo', '',
  '每一组均从炎帝开始，沿真实父系链到目标人物，再纳入该目标人物的全部后代。方形与横版采用真实点位密度压缩；完整展开版保留该支系原始拓扑。', '',
  ...results.map(result => `- ${result.target}：目标 ID ${result.targetId}，${result.people} 条记录，${result.generations} 个世代行。`), '',
].join('\n'), 'utf8');
console.log(JSON.stringify(results, null, 2));
