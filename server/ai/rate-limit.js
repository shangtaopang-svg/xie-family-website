/**
 * server/ai/rate-limit.js
 * 内存滑动窗口限流 + SSE 并发控制（单进程 PM2 够用）。
 *   - 未验证 IP：5 次/分钟
 *   - 已验证 IP：30 次/分钟、120 次/小时
 *   - 每 IP 同时最多 3 个 SSE 流
 */
'use strict';

const buckets = new Map();
const activeStreams = new Map();

function _bucket(key, windowMs) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || b.reset < now) {
    b = { count: 0, reset: now + windowMs };
    buckets.set(key, b);
  }
  return b;
}

/**
 * @param {string} key
 * @param {{windowMs:number, max:number}} spec
 * @returns {{allowed:boolean, retryAfter?:number}}
 */
function rateLimit(key, spec) {
  const b = _bucket(key, spec.windowMs);
  if (b.count >= spec.max) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((b.reset - Date.now()) / 1000)) };
  }
  b.count++;
  return { allowed: true };
}

function acquireStream(ip) {
  const n = activeStreams.get(ip) || 0;
  if (n >= 3) return false;
  activeStreams.set(ip, n + 1);
  return true;
}

function releaseStream(ip) {
  const n = activeStreams.get(ip) || 0;
  if (n <= 1) activeStreams.delete(ip); else activeStreams.set(ip, n - 1);
}

function clientIp(req) {
  const fwd = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.socket.remoteAddress || 'unknown';
}

module.exports = { rateLimit, acquireStream, releaseStream, clientIp };
