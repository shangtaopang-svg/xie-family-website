/**
 * server/ai/intent.js
 * 意图判定：lineage（个人世系，需身份验证）| document（文献/村史）| general（兜底走 LLM）。
 *
 * 门禁边界说明：站内历史/文献内容（始祖、迁徙、字辈、名人等）本来就是公开页面，
 * 因此只有「个人世系 / 亲属关系 / 指名某人的后代·祖先·世系」才判定为 lineage 并强制验证，
 * 纯历史事实问题不误拦。
 */
'use strict';

// 世系/亲属类关键词
const LINEAGE_KEYWORDS = [
  '世系', '直系', '祖先', '祖宗', '后代', '后裔', '子孙', '后辈',
  '几代', '第几代', '第几世', '辈分', '排行', '谱系',
  '爷爷', '奶奶', '父亲', '爸爸', '母亲', '妈妈', '太公',
  '儿子', '女儿', '侄子', '侄女', '叔伯', '叔叔', '伯伯', '姑姑',
  '堂兄弟', '堂姐妹', '表兄弟', '表姐妹', '兄弟', '姐妹',
  '高祖', '曾祖', '始祖', '先祖', '太爷爷', '太奶奶',
  '血缘', '最亲', '亲近', '血亲', '亲等', '亲属', '亲戚',
];

/**
 * 判定是否个人世系查询（需要验证身份）。
 * - 含「我的/我」+ 世系关键词
 * - 或「XX 和 XX 什么关系」式亲属关系
 * - 或「XX 的后代/子孙/祖先/世系」式指名查询
 */
function isLineageRequest(msg) {
  const m = String(msg).trim();
  if (!m) return false;

  const personalRef = /我/.test(m);
  if (personalRef && LINEAGE_KEYWORDS.some(k => m.includes(k))) return true;

  // 亲属关系："A 和 B 什么关系"
  if (/(和|与).{1,20}?什么关系/.test(m)) return true;

  // 指名某人的世系查询："XX 的后代/子孙/祖先/世系"
  if (/(的后代|的子孙|的后裔|的祖先|的先祖|的世系|的谱系|的后辈)/.test(m)) return true;

  // 快捷查询的两条父系路线："XX 的亲生父系世系图" / "XX 的承嗣父系世系图"
  // 中间会插入路线限定词，不能只匹配紧邻的「的世系」。
  if (/的.{0,16}(世系|谱系)图/.test(m)) return true;

  // 血缘/最亲：我的，或「和X血缘最近/最亲」——即使无「我」也判定（如「请列出从血缘上和沦最亲的10个人」）
  if (/血缘|最亲|血亲/.test(m) && (/我|本人/.test(m) || /(和|与)[^，。？！\s]{1,12}?(血缘|最亲|血亲)/.test(m))) return true;

  return false;
}

// 族人个人信息（隐私）关键词：命中后再具体指向某人 → 强制身份验证。
// 与公开村史/历史（村名由来、始祖源流、字辈、名人典故）区分开。
const PERSONAL_KEYWORDS = [
  '生平', '简历', '简介', '介绍', '是谁', '什么来历', '来历', '情况', '资料', '信息',
  '生卒', '出生', '生辰', '生日', '去世', '死亡', '殁', '葬', '年纪', '年龄', '几岁', '多大', '多少岁',
  '配偶', '妻子', '丈夫', '夫人', '娶', '嫁', '改嫁', '续弦', '子女', '儿女', '家庭',
  '家属', '家人', '媳妇', '女婿', '职业', '工作', '住址', '地址', '住哪', '哪里人',
  '电话', '手机', '联系方式', '身份证',
];

/**
 * 判定是否查询某位族人的个人信息（隐私问题，需要验证身份）。
 * 需同时满足：① 命中隐私关键词；② 具体指向某人（站内已知人名 / 本人·他人称谓）。
 * 纯公开问题如「村史」「村名由来」「始祖源流」「字辈」「介绍村里历史」不受影响。
 */
function isPersonPrivacyRequest(msg, nameIndex) {
  const m = String(msg || '').trim();
  if (!m) return false;
  if (!PERSONAL_KEYWORDS.some(k => m.includes(k))) return false;

  // ① 具体指向某人：站内已知人名（nameIndex 键）
  if (nameIndex && typeof nameIndex === 'object') {
    for (const n of Object.keys(nameIndex)) {
      if (n.length < 2 || !m.includes(n)) continue;
      const idx = m.indexOf(n);
      if (n.length >= 3) return true; // 3 字以上，几乎不可能嵌在普通词里
      // 2 字名需是独立称呼：句首 / 后跟「的」/ 句末 / 标点 / 前面是查询动词
      const after = m.charAt(idx + n.length);
      const before = m.slice(Math.max(0, idx - 4), idx);
      if (idx === 0) return true;
      if (!after || after === '的' || /[\s，。？！,.?!:：、;；]/.test(after)) return true;
      if (/(介绍|讲讲|说一说|问问|查一下|看看|关于|认识|知道|聊一聊)/.test(before)) return true;
    }
  }
  // ② 指向本人/他人/某（我们村、你们村不误拦）
  return /我的|本人|我自己|他|她|族人|族亲|他们|某/.test(m);
}

/**
 * 判定提问是否「与族谱/世系/氏族关系资料相关」——用于检索来源过滤。
 * 命中后，document/general 检索路径只允许后台 canonical 人物记录、上册/下册、
 * 族谱整理和族谱分析，不得混入村史宣传文案、纪录片脚本、新闻或文化礼堂资料。
 */
function isLineageRelated(msg) {
  const m = String(msg || '').trim();
  if (!m) return false;
  if (LINEAGE_KEYWORDS.some(k => m.includes(k))) return true;
  if (/族谱|宗谱|家谱|世次|世代|辈分|谢氏|谢家|氏族|分支|父系|母系|申伯|东山|下渡|石马|下谢|枫槎本宗|出继|入继|承嗣|炎帝|神农氏|起源|源流|始迁祖|迁徙|字辈/.test(m)) return true;
  if (/(?:第\s*[0-9零〇一二两三四五六七八九十百]+\s*[世代])/.test(m)) return true;
  // 亲属关系式："A 和 B 什么关系" / "A 和 B 的关系"
  if (/关系/.test(m)) return true;
  return false;
}

// 文献/村史类关键词
const DOCUMENT_KEYWORDS = [
  '村史', '迁徙', '记载', '生平', '上册', '下册', '字辈', '宗谱', '家谱',
  '族谱', '历史', '贤达', '宗祠', '敦睦', '望府', '银毫', '起源', '来历',
  '名人', '典故', '事件', '修谱', '圆谱', '始迁', '始祖', '排行诗',
];

/** 判定意图 */
function classifyIntent(msg, nameIndex) {
  const m = String(msg || '').trim();
  if (isLineageRequest(m)) return 'lineage';

  // 命中文献关键词或站内已知人名 → document
  const kwHit = DOCUMENT_KEYWORDS.some(k => m.includes(k));
  if (kwHit) return 'document';

  if (nameIndex && typeof nameIndex === 'object') {
    // 提取消息里的名字（最长 2-8 字片段命中姓名索引）
    for (const n of Object.keys(nameIndex)) {
      if (n.length >= 2 && m.includes(n)) return 'document';
    }
  }
  return 'general';
}

module.exports = { classifyIntent, isLineageRequest, isPersonPrivacyRequest, isLineageRelated, LINEAGE_KEYWORDS, PERSONAL_KEYWORDS, DOCUMENT_KEYWORDS };
