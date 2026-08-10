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

module.exports = { classifyIntent, isLineageRequest, LINEAGE_KEYWORDS, DOCUMENT_KEYWORDS };
