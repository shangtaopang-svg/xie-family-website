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

function makeSvg({ lockup = false } = {}) {
  const labelY = viewHeight - 1.2;
  const labelX = lockup ? viewWidth + 10 : viewWidth / 2;
  const width = lockup ? viewWidth + 64 : viewWidth;
  const height = lockup ? viewHeight + 2 : viewHeight + 5;
  const mapTransform = lockup ? 'translate(0 0)' : 'translate(0 0)';
  const textMarkup = lockup
    ? `<g transform="translate(${viewWidth + 8} 0)"><text x="0" y="${viewHeight / 2 - 2}" class="brand">枫槎谢氏</text><text x="0" y="${viewHeight / 2 + 3}" class="sub">星脉图</text><text x="0" y="${viewHeight / 2 + 9}" class="meta">${people.length}颗星 · ${generationValues.length}代行</text></g>`
    : `<text x="${labelX}" y="${labelY}" text-anchor="middle" class="brand">枫槎谢氏 · 星脉图</text>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${metadata} -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">枫槎谢氏·星脉图</title>
  <desc id="desc">根据枫槎谢氏独立世系图真实父子数据压缩生成的像素星脉标志。</desc>
  <style>
    .bg { fill: #090c0b; }
    .edge { fill: none; stroke: #315548; stroke-width: .18; opacity: .34; shape-rendering: crispEdges; }
    .node { shape-rendering: crispEdges; }
    .root { filter: drop-shadow(0 0 1.1px #d6b56d); }
    .brand { fill: #f1eadb; font-family: "Noto Serif SC", "Source Han Serif SC", SimSun, serif; font-size: 3.6px; letter-spacing: .35px; }
    .sub { fill: #c9a464; font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif; font-size: 2.8px; letter-spacing: .6px; }
    .meta { fill: #89928e; font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif; font-size: 1.9px; }
  </style>
  <rect class="bg" x="0" y="0" width="${width}" height="${height}"/>
  <g transform="${mapTransform}">
    <g class="edge">${edgeMarkup}</g>
    <g>${nodeMarkup}</g>
  </g>
  ${textMarkup}
</svg>
`;
}

fs.writeFileSync(path.join(outputDir, '枫槎谢氏-星脉图-主标.svg'), makeSvg({ lockup: false }), 'utf8');
fs.writeFileSync(path.join(outputDir, '枫槎谢氏-星脉图-横版.svg'), makeSvg({ lockup: true }), 'utf8');
const readme = [
  '# 枫槎谢氏·星脉图',
  '',
  '这两份 SVG 根据 交付_下枫槎谢氏世系图/data.js 的真实父子关系生成。每个像素星点对应一条族人记录，横向位置由子树叶节点顺序计算，纵向位置由实际世代行计算；没有使用虚构的树形轮廓。',
  '',
  '- 主标：适合头像、印章、网站角标。',
  '- 横版：适合网站页眉、宣传片片头和横幅。',
  '- 颜色：金色为祖源/根节点，墨绿色为枫槎支系，赭红色为特殊支系，灰色为其他记录。',
  '',
  `生成数据：${people.length} 条人物记录，${roots.length} 个根组件，${generationValues.length} 个有效世代行。`,
  '',
].join('\n');
fs.writeFileSync(path.join(outputDir, 'README.md'), readme, 'utf8');

console.log(JSON.stringify({ people: people.length, roots: roots.length, generationRows: generationValues.length, width: viewWidth, height: viewHeight }, null, 2));
