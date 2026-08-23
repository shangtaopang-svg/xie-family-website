const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, '交付_下枫槎谢氏世系图', 'data.js');
const outputDir = path.join(projectRoot, 'logo');

const source = fs.readFileSync(sourcePath, 'utf8')
  .replace(/^window\.GENEALOGY_DATA\s*=\s*/, '')
  .replace(/;?\s*$/, '');
const people = JSON.parse(source);
const ids = new Set(people.map(person => person.id));
const byId = new Map(people.map(person => [person.id, person]));
const children = new Map(people.map(person => [person.id, []]));

for (const person of people) {
  if (person.father_id && children.has(person.father_id)) {
    children.get(person.father_id).push(person.id);
  }
}

for (const idsForParent of children.values()) {
  idsForParent.sort((a, b) => {
    const left = byId.get(a);
    const right = byId.get(b);
    return (left.generation_num - right.generation_num) || (a - b);
  });
}

const roots = people
  .filter(person => !person.father_id || !ids.has(person.father_id))
  .sort((a, b) => (a.generation_num - b.generation_num) || (a.id - b.id));

const leafMemo = new Map();
function leafSpan(id, visiting = new Set()) {
  if (leafMemo.has(id)) return leafMemo.get(id);
  if (visiting.has(id)) return 1;
  visiting.add(id);
  const childIds = children.get(id) || [];
  const span = childIds.length
    ? childIds.reduce((sum, childId) => sum + leafSpan(childId, visiting), 0)
    : 1;
  visiting.delete(id);
  leafMemo.set(id, span);
  return span;
}

const positions = new Map();
let cursor = 0;
function layout(id, start, visiting = new Set()) {
  if (visiting.has(id)) {
    positions.set(id, start + 0.5);
    return 1;
  }
  visiting.add(id);
  const childIds = children.get(id) || [];
  if (!childIds.length) {
    positions.set(id, start + 0.5);
    visiting.delete(id);
    return 1;
  }
  let offset = start;
  for (const childId of childIds) {
    const span = layout(childId, offset, visiting);
    offset += span;
  }
  const childPositions = childIds
    .map(childId => positions.get(childId))
    .filter(value => Number.isFinite(value));
  positions.set(id, childPositions.length
    ? (childPositions[0] + childPositions[childPositions.length - 1]) / 2
    : start + 0.5);
  visiting.delete(id);
  return Math.max(1, offset - start);
}

for (const root of roots) {
  const span = leafSpan(root.id);
  layout(root.id, cursor);
  cursor += span + 1;
}

const generationValues = [...new Set(people.map(person => Number(person.generation_num)))]
  .filter(Number.isFinite)
  .sort((a, b) => a - b);
const generationRow = new Map(generationValues.map((generation, index) => [generation, index + 3]));
const contentWidth = Math.max(1, cursor);
const viewWidth = contentWidth + 6;
const viewHeight = generationValues.length + 7;

const escapeXml = value => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

function colorFor(person) {
  if (!person.father_id || person.highlight) return '#c9a464';
  if (person.branch && /枫槎/.test(person.branch)) return '#2f735d';
  if (person.branch && /入继|出继/.test(person.branch)) return '#b4674e';
  return '#696d6b';
}

function pointFor(person) {
  return {
    x: positions.get(person.id) + 3,
    y: generationRow.get(Number(person.generation_num)) || 3,
  };
}

const edgeMarkup = people
  .filter(person => person.father_id && positions.has(person.father_id))
  .map(person => {
    const parent = pointFor(byId.get(person.father_id));
    const child = pointFor(person);
    return `<path d="M ${parent.x.toFixed(2)} ${parent.y.toFixed(2)} L ${child.x.toFixed(2)} ${child.y.toFixed(2)}"/>`;
  })
  .join('');

const nodeMarkup = people
  .map(person => {
    const point = pointFor(person);
    const size = person.highlight || !person.father_id ? 1.2 : 0.78;
    const half = size / 2;
    const title = `${person.name}｜第${person.generation_num}世｜${person.branch || '未标注支系'}｜ID ${person.id}`;
    return `<rect class="node ${person.highlight || !person.father_id ? 'root' : ''}" x="${(point.x - half).toFixed(2)}" y="${(point.y - half).toFixed(2)}" width="${size}" height="${size}" fill="${colorFor(person)}"><title>${escapeXml(title)}</title></rect>`;
  })
  .join('');

const metadata = `source=data.js; people=${people.length}; roots=${roots.length}; generationRows=${generationValues.length}; layout=parent-child leaf-span; generated=2026-08-23`;

function baseStyles() {
  return `
    .bg { fill: #090c0b; }
    .edge { fill: none; stroke: #315548; stroke-width: .18; opacity: .34; shape-rendering: crispEdges; }
    .node { shape-rendering: crispEdges; }
    .root { filter: drop-shadow(0 0 1.1px #d6b56d); }
    .brand { fill: #f1eadb; font-family: "Noto Serif SC", "Source Han Serif SC", SimSun, serif; letter-spacing: .35px; }
    .sub { fill: #c9a464; font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif; letter-spacing: .6px; }
    .meta { fill: #89928e; font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif; }
  `;
}

function makeRawSvg() {
  const width = viewWidth + 6;
  const height = viewHeight + 5;
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${metadata}; variant=full-topology -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">枫槎谢氏·星脉图·完整展开</title>
  <desc id="desc">完整保留真实父子布局的像素星脉图。</desc>
  <style>${baseStyles()}</style>
  <rect class="bg" x="0" y="0" width="${width}" height="${height}"/>
  <g class="edge">${edgeMarkup}</g><g>${nodeMarkup}</g>
  <text x="${width / 2}" y="${height - 1.3}" text-anchor="middle" class="brand" font-size="3.6">枫槎谢氏 · 星脉图 · 完整展开</text>
</svg>`;
}

function compactCells(columns, rows) {
  const cells = new Map();
  const maxX = Math.max(...[...positions.values()]);
  const maxY = generationValues.length + 2;
  for (const person of people) {
    const point = pointFor(person);
    const column = Math.max(0, Math.min(columns - 1, Math.floor((point.x - 3) / maxX * columns)));
    const row = Math.max(0, Math.min(rows - 1, Math.floor((point.y - 3) / (maxY - 3) * rows)));
    const key = `${column}:${row}`;
    const cell = cells.get(key) || { count: 0, colors: new Map(), root: false };
    cell.count += 1;
    const color = colorFor(person);
    cell.colors.set(color, (cell.colors.get(color) || 0) + 1);
    cell.root = cell.root || !person.father_id || person.highlight;
    cells.set(key, cell);
  }
  return [...cells.entries()].map(([key, cell]) => {
    const [column, row] = key.split(':').map(Number);
    const color = [...cell.colors.entries()].sort((a, b) => b[1] - a[1])[0][0];
    return { column, row, count: cell.count, color, root: cell.root };
  });
}

function compactMarkup({ columns, rows, x, y, width, height }) {
  const cells = compactCells(columns, rows);
  return cells.map(cell => {
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    const size = Math.max(.7, Math.min(cellWidth, cellHeight) * (cell.root ? .86 : .62));
    const opacity = Math.min(.96, .35 + cell.count * .12);
    const px = x + cell.column * cellWidth + (cellWidth - size) / 2;
    const py = y + cell.row * cellHeight + (cellHeight - size) / 2;
    return `<rect x="${px.toFixed(2)}" y="${py.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" fill="${cell.color}" opacity="${opacity.toFixed(2)}"><title>${cell.count} 条真实族人记录聚合于此</title></rect>`;
  }).join('');
}

function makeSquareSvg() {
  const width = 128;
  const height = 128;
  const map = compactMarkup({ columns: 72, rows: 72, x: 18, y: 11, width: 92, height: 92 });
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${metadata}; variant=square-density-map; source-cells=72x72 -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">枫槎谢氏·星脉图·方形主标</title>
  <desc id="desc">由完整世系父子数据压缩成 72×72 像素密度图的方形家族标志。</desc>
  <style>${baseStyles()} .brand { font-size: 4.8px; } .meta { font-size: 2.2px; }</style>
  <rect class="bg" x="0" y="0" width="${width}" height="${height}"/>
  <rect x="17.5" y="10.5" width="93" height="93" fill="none" stroke="#315548" stroke-width=".35" opacity=".75"/>
  <g>${map}</g>
  <text x="64" y="115" text-anchor="middle" class="brand">枫槎谢氏</text>
  <text x="64" y="121" text-anchor="middle" class="sub" font-size="2.7">星脉图 · 真实世系像素标</text>
</svg>`;
}

function makeHeaderSvg() {
  const width = 540;
  const height = 180;
  const map = compactMarkup({ columns: 108, rows: 42, x: 14, y: 56, width: 344, height: 88 });
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${metadata}; variant=header-density-map; source-cells=108x42 -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">枫槎谢氏·星脉图·网站横版</title>
  <desc id="desc">适合网站页眉的 3:1 像素星脉标志，轮廓来自完整世系数据。</desc>
  <style>${baseStyles()} .brand { font-size: 13px; } .sub { font-size: 8px; } .meta { font-size: 5px; }</style>
  <rect class="bg" x="0" y="0" width="${width}" height="${height}"/>
  <rect x="13" y="55" width="346" height="90" fill="none" stroke="#315548" stroke-width=".55" opacity=".75"/>
  <g>${map}</g>
  <g transform="translate(390 62)">
    <text x="0" y="0" class="brand">枫槎谢氏</text>
    <text x="0" y="18" class="sub">星脉图</text>
    <text x="0" y="34" class="meta">${people.length}颗真实星点 · ${generationValues.length}代行</text>
  </g>
</svg>`;
}

fs.writeFileSync(path.join(outputDir, '枫槎谢氏-星脉图-主标.svg'), makeSquareSvg(), 'utf8');
fs.writeFileSync(path.join(outputDir, '枫槎谢氏-星脉图-横版.svg'), makeHeaderSvg(), 'utf8');
fs.writeFileSync(path.join(outputDir, '枫槎谢氏-星脉图-完整展开.svg'), makeRawSvg(), 'utf8');
const readme = [
  '# 枫槎谢氏·星脉图',
  '',
  '这三份 SVG 根据 交付_下枫槎谢氏世系图/data.js 的真实父子关系生成。原始布局使用父子树的叶节点顺序与实际世代行；方形与横版使用真实点位的像素密度归并，不使用虚构的树形轮廓。',
  '',
  '- 主标：72×72 密度网格，适合头像、印章、网站角标。',
  '- 横版：108×42 密度网格，约 3:1，适合网站页眉、宣传片片头和横幅。',
  '- 完整展开：保留原始横向拓扑，适合族谱大屏和长幅展示。',
  '- 颜色：金色为祖源/根节点，墨绿色为枫槎支系，赭红色为特殊支系，灰色为其他记录。',
  '',
  `生成数据：${people.length} 条人物记录，${roots.length} 个根组件，${generationValues.length} 个有效世代行。`,
  '',
].join('\n');
fs.writeFileSync(path.join(outputDir, 'README.md'), readme, 'utf8');

console.log(JSON.stringify({ people: people.length, roots: roots.length, generationRows: generationValues.length, square: '128x128', header: '540x180', full: `${viewWidth}x${viewHeight}` }, null, 2));
