/**
 * server/ai/token.js
 * 族人身份凭证 —— 自包含 HMAC-SHA256 签名 token（无状态，可跨进程重启）
 * 格式：base64url(payloadJSON) . base64url(sig)
 *   payload = { personId, name, exp, k: 'clan' }
 * 有效期 7 天。secret 取环境变量 CLAN_AI_SECRET，缺省回落固定默认值（与
 * server.js 中 ADMIN_PASSWORD 的默认值风格保持一致，生产请务必配置 CLAN_AI_SECRET）。
 */
const crypto = require('crypto');

const TOKEN_SECRET = process.env.CLAN_AI_SECRET || 'xie-family-ai-secret-2026';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str) {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

/** 为族谱人物签发身份 token */
function signPersonToken(person) {
  const payload = {
    personId: person.id,
    name: person.name,
    exp: Date.now() + TTL_MS,
    k: 'clan'
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest();
  return payloadB64 + '.' + b64url(sig);
}

/** 校验并解析 token；无效/过期返回 null */
function verifyPersonToken(token) {
  if (!token || typeof token !== 'string') return null;
  const dot = token.indexOf('.');
  if (dot <= 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest();
  const provided = Buffer.from(sigB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  if (expected.length !== provided.length) return null;
  if (!crypto.timingSafeEqual(expected, provided)) return null;
  try {
    const payload = JSON.parse(b64urlDecode(payloadB64));
    if (!payload.exp || payload.exp < Date.now()) return null;
    if (payload.k !== 'clan' || !payload.personId) return null;
    return { personId: payload.personId, name: payload.name };
  } catch (e) {
    return null;
  }
}

module.exports = { signPersonToken, verifyPersonToken };
