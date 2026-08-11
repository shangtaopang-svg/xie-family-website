/**
 * server/ai/tts.js — Edge 神经语音合成（甜美女声）
 *
 * 直接实现微软 Edge「大声朗读」的 WebSocket 协议（无需 API key，免费）。
 * 协议来源：rany2/edge-tts（Python）2026 现行实现：
 *   - URL 带 Sec-MS-GEC（Windows FILETIME 纪元、向下取整到 5 分钟、SHA256 大写 HEX）
 *   - 音频格式 audio-24khz-48kbitrate-mono-mp3
 *   - 二进制帧 = 2 字节大端长度 + 文本头(Path:audio) + MP3 数据
 * 唯一依赖：ws（Node 20 无原生 WebSocket）。
 *
 * 用法：const { synthesize } = require('./tts.js');
 *       const mp3 = await synthesize('你好', { voice: 'zh-CN-XiaoxiaoNeural' });
 */
'use strict';
const WebSocket = require('ws');
const crypto = require('crypto');

const TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CHROMIUM = '143.0.3650.75';
const BASE = 'speech.platform.bing.com/consumer/speech/synthesize/readaloud';
const OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

// 允许的音色白名单（防 SSML 注入；只放中文女声）
const ALLOWED_VOICES = new Set([
  'zh-CN-XiaoxiaoNeural', // 晓晓：温暖甜美，默认
  'zh-CN-XiaoyiNeural',   // 晓伊：活泼
  'zh-CN-XiaomoNeural',   // 晓墨：温和
  'zh-CN-XiaohanNeural',  // 晓涵
  'zh-CN-XiaoruiNeural',  // 晓睿
  'zh-CN-liaoning-XiaobeiNeural', // 辽宁晓北
]);

function uuid() { return crypto.randomUUID(); }
function muid() { return crypto.randomBytes(16).toString('hex').toUpperCase(); }
function nowHttpDate() { return new Date().toUTCString(); }

/** 生成 Sec-MS-GEC：当前时间(Windows FILETIME 纪元)向下取整到 5 分钟 → 拼接 token → SHA256 大写 HEX */
function secMsGec() {
  let ticks = Date.now() / 1000;
  ticks += 11644473600;          // WIN_EPOCH（1601-01-01 与 Unix 纪元的秒差）
  ticks -= ticks % 300;          // 向下取整到 5 分钟
  ticks *= 1e7;                  // 转为 100ns 间隔（Windows FILETIME）
  const str = Math.round(ticks).toString() + TOKEN;
  return crypto.createHash('sha256').update(str).digest('hex').toUpperCase();
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 合成语音 → MP3 Buffer
 * @param {string} text
 * @param {object} [opts] { voice, rate, volume, pitch }
 */
function synthesize(text, opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {};
    const voice = ALLOWED_VOICES.has(opts.voice) ? opts.voice : 'zh-CN-XiaoxiaoNeural';
    const rate = /^[+-]?\d+%$/.test(opts.rate || '') ? opts.rate : '+8%';
    const volume = /^[+-]?\d+%$/.test(opts.volume || '') ? opts.volume : '+8%';
    const pitch = /^[+-]?\d+(Hz|%)$/.test(opts.pitch || '') ? opts.pitch : '+6Hz';

    const url = `wss://${BASE}/edge/v1?TrustedClientToken=${TOKEN}` +
      `&ConnectionId=${uuid()}&Sec-MS-GEC=${secMsGec()}&Sec-MS-GEC-Version=1-${CHROMIUM}`;

    const ws = new WebSocket(url, {
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': `muid=${muid()};`
      }
    });

    const chunks = [];
    const timeout = setTimeout(() => { try { ws.terminate(); } catch (e) {} reject(new Error('语音合成超时')); }, 30000);

    ws.on('open', () => {
      const ts = nowHttpDate();
      const config = `X-Timestamp:${ts}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"${OUTPUT_FORMAT}"}}}}`;
      const ssmlText = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">` +
        `<voice name="${voice}"><prosody rate="${rate}" volume="${volume}" pitch="${pitch}">${escapeXml(text)}</prosody></voice></speak>`;
      const ssmlMsg = `X-RequestId:${uuid()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${ts}\r\nPath:ssml\r\n\r\n${ssmlText}`;
      ws.send(config);
      ws.send(ssmlMsg);
    });

    ws.on('message', (data, isBinary) => {
      if (isBinary) {
        const buf = Buffer.from(data);
        // 二进制帧：2 字节大端头长度 + 文本头 + 音频数据
        if (buf.length < 2) return;
        const hlen = buf.readUInt16BE(0);
        const header = buf.slice(2, 2 + hlen).toString('utf8');
        if (header.indexOf('Path:audio') !== -1) {
          chunks.push(buf.slice(2 + hlen));
        }
      } else {
        const str = data.toString('utf8');
        if (str.indexOf('Path:turn.end') !== -1) {
          clearTimeout(timeout);
          try { ws.close(); } catch (e) {}
          resolve(Buffer.concat(chunks));
        } else if (str.indexOf('Path:turn.start') === -1 && str.indexOf('Path:response') === -1 && str.indexOf('Path:audio.metadata') === -1) {
          // 其他文本帧：忽略
        }
      }
    });

    ws.on('error', (e) => { clearTimeout(timeout); reject(new Error('语音服务连接失败')); });
    ws.on('close', (code, reason) => {
      clearTimeout(timeout);
      if (!chunks.length) reject(new Error('语音合成中断 code=' + code));
    });
  });
}

/* ---------------- 进程内缓存（同一句话重复朗读直接命中） ---------------- */
const cache = new Map();
const CACHE_MAX = 200;

function cacheKey(text, voice) { return crypto.createHash('sha1').update(voice + '|' + text).digest('hex'); }

function getCached(text, voice) {
  const k = cacheKey(text, voice);
  if (cache.has(k)) {
    const e = cache.get(k);
    if (Date.now() < e.exp) { e.hits = (e.hits || 0) + 1; return e.buf; }
    cache.delete(k);
  }
  return null;
}

function setCache(text, voice, buf) {
  const k = cacheKey(text, voice);
  cache.set(k, { buf, exp: Date.now() + 30 * 60 * 1000 }); // 30 分钟 TTL
  if (cache.size > CACHE_MAX) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
}

/** 带缓存的合成入口 */
async function synthesizeCached(text, opts) {
  const voice = opts && ALLOWED_VOICES.has(opts.voice) ? opts.voice : 'zh-CN-XiaoxiaoNeural';
  const hit = getCached(text, voice);
  if (hit) return hit;
  const buf = await synthesize(text, opts);
  setCache(text, voice, buf);
  return buf;
}

module.exports = { synthesize, synthesizeCached, ALLOWED_VOICES };
