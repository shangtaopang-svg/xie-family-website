/**
 * server/ai/historical-chain.js
 * 「从炎帝神农氏开始的直系世系」构建器。
 * 现在只沿族谱管理后台 canonical 数据中的 father_id 链展示；
 * 不再使用本文件内置的叙事主链补人、改世次或替代后台缺失记录。
 */
'use strict';
const lineage = require('./lineage.js');

/**
 * 权威主链 [世次, 姓名, 备注]（与 pages/focus-tree.html 一致，已手工排除重名歧义）。
 * 注意：focus-tree 原始数组里「广」重名（弘之子和衡之子），若按姓名自动关联会成环，
 * 这里只保留通向敬乙的主线节点。
 */
const MAIN_LINE = [
  [1, '炎帝神农氏', '中华民族人文始祖'],
  [2, '临魁', '炎帝之子'],
  [10, '榆罔', '临魁之后'],
  [11, '帝柱', '榆罔之后'],
  [15, '祝融', '帝柱之后'],
  [54, '吕尚', '姜太公，周朝开国功臣'],
  [55, '佐', '吕尚之子'],
  [64, '宏道', '佐之子；谱载为申伯、申甫之父'],
  [65, '申伯', '谢氏鼻祖'],
  [66, '弘', '申伯之子'],
  [67, '广', '弘之子'],
  [68, '列宗', '广之子'],
  [69, '骘', '列宗之子'],
  [70, '预', '骘之子'],
  [71, '昌后', '预之子'],
  [72, '达', '昌后之子'],
  [73, '子民', '达之子'],
  [74, '秩', '子民之子'],
  [75, '雍', '秩之子'],
  [76, '林', '雍之子'],
  [77, '涣', '林之子'],
  [78, '旺', '涣之子'],
  [79, '珽', '旺之子'],
  [80, '国辉', '珽之子'],
  [81, '宁', '国辉之子'],
  [82, '福', '宁之子'],
  [83, '杨贞', '福之子'],
  [84, '平和', '杨贞之子'],
  [85, '文', '平和之子'],
  [86, '武', '文之子'],
  [87, '秉槐', '武之子'],
  [88, '堂', '秉槐之子'],
  [89, '瑛', '堂之子'],
  [90, '文轩', '瑛之子'],
  [91, '福郎', '文轩之子'],
  [92, '宜礼', '福郎之子'],
  [93, '逵', '宜礼之子'],
  [94, '简', '逵之子'],
  [95, '瑰', '简之子'],
  [96, '懿', '瑰之子'],
  [97, '鳅', '懿之子'],
  [98, '景秀', '鳅之后'],
  [99, '缵', '景秀之后，东山第一世'],
  [100, '衡', '会稽东山始祖'],
  [101, '裒', '衡之子，谢安之父'],
  [102, '安', '字安石，东晋名相'],
  [103, '琰', '安之子'],
  [104, '混', '琰之子'],
  [105, '密', '混之子'],
  [106, '庄', '密之子'],
  [107, '飏', '庄之子'],
  [108, '览', '飏之子'],
  [109, '琢', '览之子'],
  [110, '琂', '琢之子'],
  [111, '植', '琂之子'],
  [112, '钝', '植之子'],
  [113, '修', '钝之子'],
  [114, '恺', '修之子'],
  [115, '绰', '恺之子'],
  [116, '式', '绰之子'],
  [117, '造', '式之子'],
  [118, '直', '造之子'],
  [119, '是温', '直之子'],
  [120, '翳', '是温之子'],
  [121, '观', '翳之子'],
  [122, '闓', '观之子，临海下渡第一世'],
  [123, '俨', '闓之子'],
  [124, '诜', '俨之子'],
  [125, '景之', '诜之子'],
  [126, '深甫', '景之之后'],
  [127, '采伯', '深甫之后'],
  [128, '奕信', '采伯之后'],
  [129, '在纲', '奕信之后'],
  [130, '小四', '在纲之后，入浙东之近祖'],
  [131, '丹一', '小四之子'],
  [132, '文榘', '丹一之后，东门桃源陈氏之祖'],
  [133, '十三', '文榘之后'],
  [134, '廿七', '十三之后'],
  [135, '庆三', '廿七之后'],
  [136, '敬乙', '庆三之后'],
];

/** 过继/入继/出继 等关键词（用于从 biography 提取原文备注） */
const ADOPT_RE = /过继|入继|出继|兼祧|继子|继嗣|绍继|承嗣|立嗣|入赘|出赘|承继/;

/** 名字归一化：小四(石马)→小四、琰·东山→琰、文杲公→文杲 */
function normName(n) {
  if (!n) return '';
  return String(n).trim()
    .replace(/\(.*\)$/, '')
    .replace(/[··].*$/, '')
    .replace(/公$/, '')
    .trim();
}

/** 主链归一化名 → 索引（去重，保留第一个） */
const mlIdx = new Map();
MAIN_LINE.forEach((m, i) => { const k = normName(m[1]); if (k && !mlIdx.has(k)) mlIdx.set(k, i); });

/** 从 biography 提取过继原文备注；只照录原文，不下结论。无则返回 '' */
function adoptionFromBio(bio) {
  if (!bio || typeof bio !== 'string') return '';
  const b = bio.replace(/\s+/g, '');
  const m = b.search(ADOPT_RE);
  if (m < 0) return '';
  const s = Math.max(0, m - 6);
  const e = Math.min(b.length, m + 10);
  let snip = b.slice(s, e);
  if (s > 0) snip = '…' + snip;
  if (e < b.length) snip += '…';
  return '族谱载「' + snip + '」';
}

/** 世次 → 迁徙阶段分支名（与站点分支对应） */
function branchOfShi(shi) {
  if (shi <= 65) return '远古世系';
  if (shi <= 99) return '申伯世系';
  if (shi <= 121) return '始宁东山世系';
  if (shi <= 130) return '临海下渡世系';
  return '石马下谢分房';
}

/**
 * 构建「从炎帝神农氏到本人」的完整直系世系链。
 * @returns {Array<{name, shi, note, branch, isSelf, adopt}>} 第1世在前，本人最后
 */
function buildFullChain(personId) {
  lineage.ensureLoaded();
  const self = lineage.getPerson(personId);
  if (!self) return null;

  // 真实 father_id 链（root→self）；getAncestorList(includeSelf) 返回 self→…→root，需反转
  const real = (lineage.getAncestorList(personId, true) || []).slice().reverse();
  if (!real.length) return null;

  return real.map((p) => {
    const adopt = adoptionFromBio(p.biography) || (p.adopt_note ? '族谱载「' + String(p.adopt_note).trim() + '」' : '') || (p.branch === '入继' ? '过继入族' : '');
    const shi = Number.isFinite(Number(p.generation_num)) ? Number(p.generation_num) : String(p.generation || '').trim();
    return {
      name: p.name,
      shi,
      note: adopt,
      branch: p.branch && p.branch !== '—' ? p.branch : branchOfShi(Number(shi) || 0),
      isSelf: Number(p.id) === Number(personId),
      adopt,
    };
  });
}

/** 把节点数组排版成可读/可朗读的文本。ownerIsSelf=true 时用「您」（自己），否则用被查人名 */
function formatChainText(nodes, selfName, ownerIsSelf) {
  const isOwner = ownerIsSelf !== false;
  const ownerLabel = isOwner ? '您' : (selfName || '被查询族人');
  const lines = [];
  nodes.forEach(n => {
    let line = '第' + n.shi + '世 ' + n.name;
    if (n.isSelf) line += ' ← ' + ownerLabel;
    const extras = [];
    if (n.adopt) extras.push(n.adopt);
    else if (n.note && n.note !== n.adopt) extras.push(n.note);
    if (extras.length) line += '（' + extras.join('；') + '）';
    lines.push(line);
  });
  const title = isOwner ? '您的世系图' : (selfName ? selfName + ' 的世系图' : '该族人的世系图');
  let text = title + '（自炎帝神农氏起，共 ' + nodes.length + ' 世）：\n' + lines.join('\n');
  const adoptions = nodes.filter(n => n.adopt);
  if (adoptions.length) {
    text += '\n\n【过继/入继备注】\n' +
      adoptions.map(n => '第' + n.shi + '世 ' + n.name + '：' + n.adopt).join('\n');
  }
  return text;
}

module.exports = {
  MAIN_LINE,
  normName,
  adoptionFromBio,
  branchOfShi,
  buildFullChain,
  formatChainText,
};
