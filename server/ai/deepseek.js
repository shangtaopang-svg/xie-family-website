/**
 * server/ai/deepseek.js
 * DeepSeek Chat 客户端（零依赖，用内置 https）。
 * API Key 一律读环境变量 DEEPSEEK_API_KEY，绝不进入前端。
 */
'use strict';
const https = require('https');

const API_HOST = 'api.deepseek.com';
const API_PATH = '/chat/completions';
const MODEL = 'deepseek-chat';

/**
 * @param {object} opts
 * @param {Array<{role:string,content:string}>} opts.messages
 * @param {boolean} [opts.stream]
 * @param {(chunk:string)=>void} [opts.onDelta]   stream=true 时逐段回调文本
 * @param {AbortSignal} [opts.signal]
 * @param {number} [opts.maxTokens=800]
 * @param {number} [opts.temperature=0.3]
 * @returns {Promise<string>} stream=false 时返回完整文本；stream=true 时 resolve 空串
 */
function callDeepSeek(opts) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return Promise.reject(new Error('DEEPSEEK_API_KEY 未配置，无法调用大模型'));

  const stream = !!opts.stream;
  const payload = {
    model: MODEL,
    messages: opts.messages,
    stream,
    max_tokens: opts.maxTokens || 800,
    temperature: opts.temperature === undefined ? 0.3 : opts.temperature,
  };
  const body = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const req = https.request({
      host: API_HOST,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        let err = '';
        res.on('data', c => { err += c; });
        res.on('end', () => reject(new Error('DeepSeek ' + res.statusCode + ': ' + err.slice(0, 300))));
        return;
      }

      if (!stream) {
        let data = '';
        res.on('data', c => { data += c; });
        res.on('end', () => {
          try {
            const j = JSON.parse(data);
            const content = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
            resolve(content || '');
          } catch (e) { reject(e); }
        });
        res.on('error', reject);
        return;
      }

      // 流式：解析 SSE（data: {...}\n\n），逐 delta 回调
      let buf = '';
      const onLine = (line) => {
        const t = line.trim();
        if (!t.startsWith('data:')) return;
        const data = t.slice(5).trim();
        if (data === '[DONE]') return;
        try {
          const j = JSON.parse(data);
          const delta = j.choices && j.choices[0] && j.choices[0].delta;
          if (delta && typeof delta.content === 'string' && delta.content) {
            opts.onDelta && opts.onDelta(delta.content);
          }
        } catch (e) { /* 忽略残缺行 */ }
      };
      res.on('data', c => {
        buf += c;
        let idx;
        while ((idx = buf.indexOf('\n')) !== -1) {
          const line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          onLine(line);
        }
      });
      res.on('end', () => {
        if (buf.trim()) onLine(buf); // 尾行无换行
        resolve('');
      });
      res.on('error', reject);
    });

    req.setTimeout(60000, () => req.destroy(new Error('DeepSeek 超时(60s)')));
    if (opts.signal) {
      const abort = () => req.destroy(new Error('aborted'));
      if (opts.signal.aborted) abort(); else opts.signal.addEventListener('abort', abort, { once: true });
    }
    req.on('error', reject);
    req.end(body);
  });
}

module.exports = { callDeepSeek, MODEL };
