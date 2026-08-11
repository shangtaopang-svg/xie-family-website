/**
 * js/ai-assistant.js — 家族 AI 咨询窗口（全站悬浮球）
 * 自包含、零依赖，通过 server.js 对所有 .html 统一注入，覆盖不加载 main.js 的页面。
 * 后端 /api/ai/chat（SSE 流式）；世系问题需先通过「姓名+父亲+祖父」验证身份。
 */
(function () {
  'use strict';
  if (window.__aiAssistantLoaded) return;
  window.__aiAssistantLoaded = true;

  /* ---- 与服务端 intent.js 镜像的世系判定（用于即时弹验证表单；服务端仍是最终安全边界） ---- */
  var LIN = ['世系', '直系', '祖先', '祖宗', '后代', '后裔', '子孙', '后辈', '几代', '第几代', '第几世', '辈分', '排行', '谱系', '爷爷', '奶奶', '父亲', '爸爸', '母亲', '妈妈', '太公', '儿子', '女儿', '侄子', '侄女', '叔伯', '叔叔', '伯伯', '姑姑', '堂兄弟', '堂姐妹', '表兄弟', '表姐妹', '兄弟', '姐妹', '高祖', '曾祖', '始祖', '先祖', '太爷爷', '太奶奶'];
  function looksLineage(m) {
    if (/我/.test(m) && LIN.some(function (k) { return m.indexOf(k) !== -1; })) return true;
    if (/(和|与).{1,20}?什么关系/.test(m)) return true;
    if (/(的后代|的子孙|的后裔|的祖先|的先祖|的世系|的谱系|的后辈)/.test(m)) return true;
    return false;
  }

  var CHIPS = [
    { t: '请列出我的直系10代族谱世系图', lock: true },
    { t: '下枫槎谢氏的始祖是谁？族谱记载了哪些早期祖先？', lock: false },
    { t: '谢氏家族是如何迁徙到宁海下枫槎村的？', lock: false },
    { t: '我现在是第几代？和我同辈的族人有哪些？', lock: true },
    { t: '字辈排行诗是什么？各世对应哪个字？', lock: false }
  ];

  var LS_HIST = 'ai_chat_history_v1';
  var LS_TOKEN = 'ai_clan_token';
  var LS_PERSON = 'ai_clan_person';
  var LS_FAB_POS = 'ai_fab_pos';
  var LS_PANEL_POS = 'ai_panel_pos';
  var LS_GREET = 'ai_greeting_done';
  var LS_TTS_MUTED = 'ai_tts_muted';
  var MAX_HIST = 50;
  var APP_VERSION = 'v10'; // 与 scripts/inject-ai-html.js 的 VERSION 保持一致（面板状态栏显示，用于诊断缓存）
  var IS_MOBILE = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches;
  var WELCOME = '您好，我是下枫槎谢氏家族的 AI 助手 🤖\n可以问我村史、族谱、字辈、世系等问题。涉及个人世系的查询需要先完成族人身份验证。';

  var fab, panel, msgs, chipsEl, input, sendBtn, statusEl, goBottom, header, bubble, soundBtn;
  var hist = [];
  var isOpen = false;
  var ttsMuted = false; // 语音朗读开关（用户可记忆）
  var audioEl = null;   // 复用的 <audio> 播放器
  var queuedMsg = null;
  var composing = false;
  var forceScroll = true;
  var fabPos = null;    // 用户拖拽后悬浮球的位置 {x,y}(left/top)
  var panelPos = null;  // 用户拖拽后面板的位置 {x,y}
  var fabMoved = false; // 本次点击是否为拖拽（用于抑制打开面板）
  var bubbleDismissed = false; // 用户是否关闭过问候气泡（记住，不再显示）

  function isMb() { return window.matchMedia('(max-width:768px)').matches; }
  function getToken() { try { return localStorage.getItem(LS_TOKEN) || ''; } catch (e) { return ''; } }
  function getPerson() { try { return JSON.parse(localStorage.getItem(LS_PERSON) || 'null'); } catch (e) { return null; } }

  function $(sel, root) { return (root || document).querySelector(sel); }

  /* ---------------- UI 构建 ---------------- */
  function buildUI() {
    if (document.getElementById('ai-fab')) return;
    fab = document.createElement('button');
    fab.id = 'ai-fab';
    fab.setAttribute('role', 'button');
    fab.setAttribute('aria-label', '家族 AI 咨询');
    // 机器人头像（参照腾讯 WorkBuddy「Buddy」风格：圆润可爱机器人，白色剪影适配橙/绿底色）
    fab.innerHTML =
      '<svg viewBox="0 0 56 56" width="46" height="46" aria-hidden="true">' +
      '  <line x1="28" y1="9" x2="28" y2="15" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>' +
      '  <circle cx="28" cy="6" r="4.5" fill="#fff"/>' +
      '  <rect x="6" y="13" width="44" height="35" rx="14" fill="#fff"/>' +
      '  <circle cx="20" cy="29" r="5.6" fill="#0a0a0a"/>' +
      '  <circle cx="36" cy="29" r="5.6" fill="#0a0a0a"/>' +
      '  <circle cx="18.2" cy="27" r="2.1" fill="#fff"/>' +
      '  <circle cx="34.2" cy="27" r="2.1" fill="#fff"/>' +
      '  <path d="M20 38 Q28 45 36 38" stroke="#0a0a0a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '  <rect x="2" y="24" width="5" height="13" rx="2.5" fill="#fff" opacity="0.9"/>' +
      '  <rect x="49" y="24" width="5" height="13" rx="2.5" fill="#fff" opacity="0.9"/>' +
      '</svg>' +
      '<span class="ai-bubble" id="ai-bubble" role="tooltip">' +
      '  <span class="ai-bubble-text">您好呀，我是下枫槎谢氏的小管家，族谱、村史、世系想问什么都可以哦～</span>' +
      '  <span class="ai-bubble-close" id="ai-bubble-close" role="button" aria-label="关闭问候">✕</span>' +
      '</span>';
    bubble = fab.querySelector('.ai-bubble');

    panel = document.createElement('div');
    panel.id = 'ai-panel';
    panel.hidden = true;
    panel.innerHTML =
      '<div class="ai-header">' +
      '  <div class="ai-title">' +
      '    <span class="ai-logo">🤖</span>' +
      '    <div><div class="ai-name">家族 AI 咨询</div><div class="ai-status" id="ai-status"></div></div>' +
      '  </div>' +
      '  <div class="ai-hbtns">' +
      '    <button type="button" class="ai-sound" id="ai-sound" aria-label="语音朗读开关" title="语音朗读">🔊</button>' +
      '    <button type="button" class="ai-close" id="ai-close" aria-label="关闭">✕</button>' +
      '  </div>' +
      '</div>' +
      '<div class="ai-msgs" id="ai-msgs"></div>' +
      '<div class="ai-chips" id="ai-chips"></div>' +
      '<div class="ai-input-row">' +
      '  <textarea id="ai-input" rows="1" placeholder="输入问题，如：谢氏家族是怎么迁徙来的？" enterkeyhint="send"></textarea>' +
      '  <button type="button" class="ai-send" id="ai-send" disabled>发送</button>' +
      '</div>';
    panel.appendChild((goBottom = document.createElement('button')));
    goBottom.className = 'ai-gobottom';
    goBottom.textContent = '↓ 回到最新';
    goBottom.hidden = true;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    msgs = $('#ai-msgs', panel);
    chipsEl = $('#ai-chips', panel);
    input = $('#ai-input', panel);
    sendBtn = $('#ai-send', panel);
    statusEl = $('#ai-status', panel);
    header = $('.ai-header', panel);
    soundBtn = $('#ai-sound', panel);

    // 预设问题 chips
    CHIPS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ai-chip';
      b.textContent = (c.lock ? '🔒 ' : '') + c.t;
      b.addEventListener('click', function () {
        if (c.lock && !getToken()) {
          // 先显示用户消息再弹验证，避免追问丢失在记录外
          appendMessage('user', c.t);
          hist.push({ role: 'user', content: c.t });
          persist();
          showVerify(c.t, null);
          return;
        }
        doSend(c.t);
      });
      chipsEl.appendChild(b);
    });
  }

  function clampPos(x, y, w, h, margin) {
    var m = margin || 8;
    x = Math.max(m, Math.min(x, window.innerWidth - w - m));
    y = Math.max(m, Math.min(y, window.innerHeight - h - m));
    return { x: x, y: y };
  }

  function positionFab() {
    if (fabPos) {
      // 用户拖拽过：用保存的位置（clamp 到视口内）
      var w = fab.offsetWidth || 56, h = fab.offsetHeight || 56;
      var c = clampPos(fabPos.x, fabPos.y, w, h);
      fab.style.left = c.x + 'px';
      fab.style.top = c.y + 'px';
      fab.style.right = 'auto';
      fab.style.bottom = 'auto';
      return;
    }
    if (isMb()) {
      fab.style.right = '16px';
      fab.style.bottom = 'calc(66px + env(safe-area-inset-bottom))';
      fab.style.left = 'auto';
      fab.style.top = 'auto';
    } else {
      // bottom 偏移以视口底部为基准：贴 float-toolbar 上方 14px
      var offset = 92;
      var ft = document.querySelector('.float-toolbar');
      if (ft) {
        var r = ft.getBoundingClientRect();
        if (r.height > 0 && r.bottom < window.innerHeight) offset = window.innerHeight - r.bottom + 14;
      }
      fab.style.right = '24px';
      fab.style.bottom = offset + 'px';
      fab.style.left = 'auto';
      fab.style.top = 'auto';
    }
  }

  function updateStatus() {
    var p = getPerson();
    statusEl.textContent = ((getToken() && p) ? '已验证 · ' + p.name : '未验证 · 仅公开问题') + ' · ' + APP_VERSION;
  }

  /* ---------------- 悬浮球问候气泡 ---------------- */
  function hideBubble() { if (bubble) bubble.style.display = 'none'; }
  function showBubble() { if (bubble && !bubbleDismissed) bubble.style.display = ''; }

  function setupBubble() {
    if (!bubble) return;
    // 旧版「永久关闭」标记作废：问候气泡每次访问都重新出现（用户反馈文字消失）
    // 手机端常驻显示，不再 4.5s 后收起为小圆点
    try { localStorage.removeItem(LS_GREET); } catch (e) {}
    bubbleDismissed = false;
    bubble.classList.remove('collapsed');
    bubble.addEventListener('click', function (e) {
      var closeBtn = document.getElementById('ai-bubble-close');
      if (e.target === closeBtn || (closeBtn && closeBtn.contains(e.target))) {
        e.stopPropagation();
        hideBubble();
        bubbleDismissed = true; // 仅本次会话收起，下次访问重新出现
        return;
      }
      // 点气泡本体 → 直接打开咨询面板（不依赖冒泡到 FAB，防止事件被拖拽/拦截吞掉导致面板不弹出）
      openPanel();
      e.stopPropagation();
    });
  }

  /* ---------------- 打开/关闭 ---------------- */
  function openPanel() {
    if (isOpen) return;
    isOpen = true;
    panel.hidden = false;
    // 面板打开期间隐藏悬浮球：防止面板/FAB被拖拽移开后 FAB 露出，朗读回答时用户误点 FAB（本意是静音/暂停）却触发了面板开关
    fab.style.visibility = 'hidden';
    fab.style.pointerEvents = 'none';
    hideBubble(); // 打开面板时收起问候气泡
    document.body.style.overflow = 'hidden';
    renderHistory();
    updateStatus();
    positionFab();
    if (isMb()) {
      // 手机全屏：清掉桌面拖拽遗留的 inline 定位，避免破坏 inset:0
      panel.style.left = ''; panel.style.top = ''; panel.style.right = ''; panel.style.bottom = '';
    } else if (panelPos) {
      // 用户拖拽过面板：恢复到保存的位置（至少让标题栏在可视区）
      var w = panel.offsetWidth || 380, h = panel.offsetHeight || 560;
      var px = Math.max(14 - w + 200, Math.min(panelPos.x, window.innerWidth - 200));
      var py = Math.max(0, Math.min(panelPos.y, window.innerHeight - 64));
      panel.style.left = px + 'px';
      panel.style.top = py + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    }
    // 桌面端自动聚焦；手机端等用户点输入框（避免自动弹键盘）
    if (!isMb()) setTimeout(function () { input.focus(); }, 120);
    try { history.pushState({ ai: true }, ''); } catch (e) {}
  }

  function closePanel(skipBack) {
    if (!isOpen) return;
    isOpen = false;
    panel.hidden = true;
    fab.style.visibility = '';
    fab.style.pointerEvents = ''; // 恢复悬浮球可点可拖
    showBubble(); // 面板关闭后重新显示问候气泡
    document.body.style.overflow = '';
    input.blur();
    resetViewport();
    if (!skipBack && history.state && history.state.ai) { try { history.back(); } catch (e) {} }
  }

  function renderHistory() {
    msgs.innerHTML = '';
    if (!hist.length) {
      appendMessage('bot', WELCOME);
      return;
    }
    hist.forEach(function (m) { appendMessage(m.role, m.content); });
    scrollBottom(true);
  }

  function persist() {
    try {
      hist = hist.slice(-MAX_HIST);
      localStorage.setItem(LS_HIST, JSON.stringify(hist));
    } catch (e) {}
  }

  /* ---------------- 消息 ---------------- */
  function appendMessage(role, text, opts) {
    var el = document.createElement('div');
    el.className = 'ai-msg ' + (role === 'user' ? 'ai-user' : 'ai-bot');
    // 移动端内联样式强制配色（终极兜底）：绕过任何陈旧 CSS 缓存，保证 bot 深底浅字、user 绿底黑字清晰可读
    if (IS_MOBILE) {
      if (role === 'user') {
        // 提问气泡：品牌橙渐变 + 白字（区别于 AI 回答的深灰底）
        el.style.setProperty('background', 'linear-gradient(135deg,#f5a623,#d97706)', 'important');
        el.style.setProperty('color', '#ffffff', 'important');
        el.style.setProperty('font-weight', '600', 'important');
      } else {
        el.style.setProperty('background', '#1c1c1c', 'important');
        el.style.setProperty('border', '1px solid #333', 'important');
        el.style.setProperty('color', '#f5f5f5', 'important');
      }
    }
    var body = document.createElement('div');
    body.textContent = text;
    el.appendChild(body);
    if (opts && opts.id) el.dataset.mid = opts.id;
    msgs.appendChild(el);
    scrollBottom(true);
    return el;
  }

  function scrollBottom(force) {
    if (force === true) forceScroll = true;
    if (!forceScroll) return;
    msgs.scrollTop = msgs.scrollHeight;
  }

  function doSend(text) {
    var t = (text || '').trim();
    if (!t) return;
    stopSpeak(); // 发送新问题，打断上一段朗读
    appendMessage('user', t);
    hist.push({ role: 'user', content: t });
    persist();
    if (looksLineage(t) && !getToken()) { showVerify(t, null); return; }
    chat(t);
  }

  /* ---------------- 与后端通信（SSE） ---------------- */
  function chat(text) {
    var botEl = appendMessage('bot', '思考中…');
    var body = botEl.firstChild;
    var done = false;

    var finish = function (answer, sources) {
      if (done) return;
      done = true;
      body.textContent = answer || '（无回答）';
      if (answer && answer !== '（无回答）') speak(answer); // 自动朗读每次回复
      if (sources && sources.length) {
        var src = document.createElement('div');
        src.className = 'ai-src';
        src.textContent = '📚 参考：' + sources.join('、');
        botEl.appendChild(src);
      }
      hist.push({ role: 'assistant', content: answer || '' });
      persist();
      scrollBottom(true);
    };

    var fail = function (err) {
      if (done) return;
      if (err && err.code === 'AUTH_REQUIRED') {
        botEl.remove();
        showVerify(text, err.message);
        return;
      }
      body.textContent = (err && err.message) || '出错了，请重试';
      done = true;
      scrollBottom(true);
    };

    var reqBody = { message: text, stream: true };
    var tok = getToken();
    if (tok) reqBody.token = tok;
    var histBody = hist.slice(-12).filter(function (m) { return m.content; }).map(function (m) { return { role: m.role, content: m.content }; });
    if (histBody.length) reqBody.history = histBody;

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    }).then(function (resp) {
      if (resp.status === 429) {
        return resp.json().then(function (j) { fail({ message: '提问太频繁，请' + (j.retryAfter || 10) + '秒后再试' }); });
      }
      var ct = resp.headers.get('content-type') || '';
      if (ct.indexOf('text/event-stream') === -1) {
        return resp.json().then(function (j) {
          if (j.ok) finish(j.answer, j.sources || []);
          else fail(j);
        });
      }
      var reader = resp.body.getReader();
      var dec = new TextDecoder();
      var buf = '';
      var collect = '';
      var parseBlock = function (block) {
        var ev = '', data = '';
        block.split('\n').forEach(function (l) {
          if (l.indexOf('event:') === 0) ev = l.slice(6).trim();
          else if (l.indexOf('data:') === 0) data += l.slice(5).trim();
        });
        if (!data) return;
        var j;
        try { j = JSON.parse(data); } catch (e) { return; }
        if (ev === 'meta') {
          if (!j.ok) fail(j);
        } else if (ev === 'delta') {
          if (j.t) { collect += j.t; body.textContent = collect; scrollBottom(false); }
        } else if (ev === 'done') {
          finish(j.answer || collect, j.sources || []);
        } else if (ev === 'error') {
          fail(j);
        }
      };
      var pump = function () {
        return reader.read().then(function (r) {
          if (r.done) return;
          buf += dec.decode(r.value, { stream: true });
          var idx;
          while ((idx = buf.indexOf('\n\n')) !== -1) {
            parseBlock(buf.slice(0, idx));
            buf = buf.slice(idx + 2);
          }
          return pump();
        });
      };
      return pump();
    }).catch(function (e) {
      fail({ message: '网络错误，请重试' });
    });
  }

  /* ---------------- 身份验证气泡 ---------------- */
  function showVerify(queued, hint) {
    queuedMsg = queued || queuedMsg;
    var old = msgs.querySelector('.ai-msg-verify');
    if (old) old.remove();

    var wrap = document.createElement('div');
    wrap.className = 'ai-msg ai-msg-verify';
    wrap.innerHTML =
      '<div class="ai-verify">' +
      '  <div class="ai-verify-tip">🔒 ' + (hint || '该问题涉及个人世系图谱，请先完成族人身份验证（与站内验证一致，填姓名、父亲、祖父）。') + '</div>' +
      '  <input id="ai-v-name" placeholder="您的姓名" autocomplete="off">' +
      '  <input id="ai-v-father" placeholder="父亲名字" autocomplete="off">' +
      '  <input id="ai-v-grandpa" placeholder="祖父名字（可留空）" autocomplete="off">' +
      '  <div class="ai-verify-err" id="ai-v-err"></div>' +
      '  <button type="button" class="ai-send" id="ai-v-submit">验证身份</button>' +
      '</div>';
    msgs.appendChild(wrap);
    scrollBottom(true);
    var errEl = $('#ai-v-err', wrap);
    $('#ai-v-name', wrap).focus();

    $('#ai-v-submit', wrap).addEventListener('click', function () {
      var name = $('#ai-v-name', wrap).value.trim();
      var father = $('#ai-v-father', wrap).value.trim();
      var grandpa = $('#ai-v-grandpa', wrap).value.trim();
      if (!name || !father) { errEl.textContent = '请填写姓名和父亲名字'; return; }
      errEl.textContent = '验证中…';
      fetch('/api/verify-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, fatherName: father, grandpaName: grandpa || undefined })
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res.verified) {
          try {
            localStorage.setItem(LS_TOKEN, res.token);
            localStorage.setItem(LS_PERSON, JSON.stringify({ personId: res.personId, name: res.name }));
          } catch (e) {}
          wrap.remove();
          updateStatus();
          var q = queuedMsg; queuedMsg = null;
          if (q) chat(q);
          else appendMessage('bot', '✅ 身份验证通过，现在可以查询您的个人世系了。');
        } else {
          errEl.textContent = res.message || '信息不符，请核对';
        }
      }).catch(function () { errEl.textContent = '网络错误，请重试'; });
    });
  }

  /* ---------------- 手机端软键盘（visualViewport） ---------------- */
  function adjustForKeyboard() {
    if (!isOpen || !isMb() || !window.visualViewport) return;
    var vv = window.visualViewport;
    panel.style.height = vv.height + 'px';
    panel.style.top = (vv.offsetTop || 0) + 'px';
  }
  function resetViewport() {
    panel.style.height = '';
    panel.style.top = '';
  }

  /* ---------------- 拖拽（悬浮球 + 面板） ---------------- */
  function setupFabDrag() {
    var startX = 0, startY = 0, startL = 0, startT = 0, dragging = false, moved = false;
    fab.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return; // 仅左键
      dragging = true; moved = false;
      startX = e.clientX; startY = e.clientY;
      var r = fab.getBoundingClientRect();
      startL = r.left; startT = r.top;
      try { fab.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    fab.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (!moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) moved = true;
      if (!moved) return;
      var c = clampPos(startL + dx, startT + dy, 56, 56);
      fab.style.left = c.x + 'px';
      fab.style.top = c.y + 'px';
      fab.style.right = 'auto';
      fab.style.bottom = 'auto';
    });
    var endFabDrag = function () {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        fabMoved = true;
        var r = fab.getBoundingClientRect();
        var p = { x: Math.round(r.left), y: Math.round(r.top) };
        fabPos = p;
        try { localStorage.setItem(LS_FAB_POS, JSON.stringify(p)); } catch (err) {}
      }
    };
    fab.addEventListener('pointerup', endFabDrag);
    fab.addEventListener('pointercancel', endFabDrag);
  }

  function setupPanelDrag() {
    if (!header) return;
    var startX = 0, startY = 0, startL = 0, startT = 0, dragging = false;
    header.addEventListener('pointerdown', function (e) {
      if (isMb()) return;                                            // 手机全屏不拖动
      if (e.target && e.target.closest && e.target.closest('.ai-close, .ai-sound')) return; // 点按钮不算拖动
      if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      var r = panel.getBoundingClientRect();
      startL = r.left; startT = r.top;
      // 从 bottom 锚定切换为 left/top 自由定位
      panel.style.left = r.left + 'px';
      panel.style.top = r.top + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      try { header.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    header.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var w = panel.offsetWidth || 380;
      var px = Math.max(14 - w + 200, Math.min(startL + (e.clientX - startX), window.innerWidth - 200));
      var py = Math.max(0, Math.min(startT + (e.clientY - startY), window.innerHeight - 64));
      panel.style.left = px + 'px';
      panel.style.top = py + 'px';
    });
    var endPanelDrag = function () {
      if (!dragging) return;
      dragging = false;
      var r = panel.getBoundingClientRect();
      var p = { x: Math.round(r.left), y: Math.round(r.top) };
      panelPos = p;
      try { localStorage.setItem(LS_PANEL_POS, JSON.stringify(p)); } catch (err) {}
    };
    header.addEventListener('pointerup', endPanelDrag);
    header.addEventListener('pointercancel', endPanelDrag);
  }

  /* ---------------- 语音朗读（Edge 神经女声） ---------------- */
  function noop() {}
  function initTts() {
    try { ttsMuted = localStorage.getItem(LS_TTS_MUTED) === '1'; } catch (e) { ttsMuted = false; }
    if (soundBtn) soundBtn.textContent = ttsMuted ? '🔇' : '🔊';
  }
  function toggleTts() {
    ttsMuted = !ttsMuted;
    try { localStorage.setItem(LS_TTS_MUTED, ttsMuted ? '1' : '0'); } catch (e) {}
    if (soundBtn) soundBtn.textContent = ttsMuted ? '🔇' : '🔊';
    if (!ttsMuted && audioEl) { try { audioEl.play().catch(noop); } catch (e) {} } // 重新打开时恢复播放
  }
  function stopSpeak() {
    if (audioEl) { try { audioEl.pause(); audioEl.removeAttribute('src'); audioEl.load(); } catch (e) {} }
  }
  /** 把答案文本处理成适合朗读的流畅句子 */
  function prepareSpoken(text) {
    return String(text)
      .replace(/←\s*您/g, '，是您本人')     // 世系图箭头「← 您」
      .replace(/[→➜▶|]/g, '，')             // 各类箭头/竖线 → 逗号
      .replace(/[●◆▪•★☆]/g, '，')           // 列表符号 → 逗号
      .replace(/【[^】]*】/g, '')            // 去掉【…】备注括号
      .replace(/[《》""]/g, '')               // 去掉书名号/引号
      .replace(/\s*\n+\s*/g, '，')           // 换行 → 逗号
      .replace(/[，、]{2,}/g, '，')           // 合并连续顿号/逗号
      .replace(/[，,]+$/g, '')
      .replace(/[。！？!?]+$/, '。')
      .trim()
      .slice(0, 600);
  }
  /** 朗读一段回复（自动，除非用户已静音） */
  function speak(text) {
    if (ttsMuted) return;
    var spoken = prepareSpoken(text);
    if (!spoken) return;
    stopSpeak();
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: spoken, voice: 'zh-CN-XiaoxiaoNeural' })
    }).then(function (r) {
      if (!r.ok) throw new Error('tts ' + r.status);
      return r.blob();
    }).then(function (blob) {
      if (ttsMuted) return;
      if (!audioEl) audioEl = new Audio();
      audioEl.src = URL.createObjectURL(blob);
      audioEl.onended = function () { try { URL.revokeObjectURL(audioEl.src); } catch (e) {} };
      audioEl.play().catch(noop);
    }).catch(noop); // 语音失败静默，不影响文字回复
  }

  /* ---------------- 配色兜底：防止陈旧 CSS 缓存导致气泡配色错乱（绿底白字等） ---------------- */
  function ensureAiColors() {
    if (document.getElementById('ai-color-guard')) return;
    var st = document.createElement('style');
    st.id = 'ai-color-guard';
    st.textContent = '@media (max-width:768px){' +
      '.ai-msg.ai-user{background:linear-gradient(135deg,#f5a623,#d97706) !important;color:#fff !important}' +
      '.ai-msg.ai-bot{background:#1c1c1c !important;border:1px solid #333 !important;color:#f5f5f5 !important}' +
      '#ai-fab .ai-bubble{background:#141414 !important;color:#eee !important;border-color:#2a2a2a !important}' +
      '#ai-fab .ai-bubble::after{background:#141414 !important;border-color:#2a2a2a !important}' +
      '.ai-msg.ai-bot .ai-src{color:rgba(238,238,238,.45) !important}' +
      '}';
    document.head.appendChild(st);
  }

  /* ---------------- 事件绑定 ---------------- */
  function bindEvents() {
    fab.addEventListener('click', function () {
      if (fabMoved) { fabMoved = false; return; } // 拖拽后不触发打开
      isOpen ? closePanel() : openPanel();
    });

    $('#ai-close', panel).addEventListener('click', function () { closePanel(); });
    if (soundBtn) soundBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleTts(); });

    // 发送
    sendBtn.addEventListener('click', function () { doSend(input.value); });
    input.addEventListener('input', function () {
      sendBtn.disabled = !input.value.trim();
      input.style.height = 'auto';
      input.style.height = Math.min(120, input.scrollHeight) + 'px';
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !composing) {
        e.preventDefault();
        doSend(input.value);
      }
    });
    input.addEventListener('compositionstart', function () { composing = true; });
    input.addEventListener('compositionend', function () { composing = false; });

    input.addEventListener('focus', function () {
      setTimeout(adjustForKeyboard, 80);
      if (!sendBtn.disabled) { try { input.scrollIntoView({ block: 'end' }); } catch (e) {} }
    });
    input.addEventListener('blur', function () { setTimeout(resetViewport, 200); });

    // 滚动控制
    msgs.addEventListener('scroll', function () {
      var near = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;
      forceScroll = near;
      goBottom.hidden = near;
    });
    goBottom.addEventListener('click', function () { scrollBottom(true); });

    // 返回键 / Esc
    // popstate：手机端返回键 / 桌面端浏览器后退手势(触摸板/鼠标侧键)都可能触发。朗读中误触 → 先停语音，不关面板（与 Esc 一致）
    window.addEventListener('popstate', function () {
      if (!isOpen) return;
      if (audioEl && !audioEl.paused && !audioEl.ended) { stopSpeak(); return; }
      closePanel(true);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        // 正在朗读语音时按 Esc：先停语音，不关面板（避免用户想关声音却把窗口关了）
        if (audioEl && !audioEl.paused && !audioEl.ended) { stopSpeak(); return; }
        closePanel();
      }
    });

    // 可视区域变化（键盘弹出/收起、旋转）
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', adjustForKeyboard);
      window.visualViewport.addEventListener('scroll', adjustForKeyboard);
    }
    window.addEventListener('resize', function () {
      positionFab();
      resetViewport();
    });
    document.addEventListener('DOMContentLoaded', positionFab);
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    try { hist = JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch (e) { hist = []; }
    if (!Array.isArray(hist)) hist = [];
    try { fabPos = JSON.parse(localStorage.getItem(LS_FAB_POS) || 'null'); } catch (e) { fabPos = null; }
    try { panelPos = JSON.parse(localStorage.getItem(LS_PANEL_POS) || 'null'); } catch (e) { panelPos = null; }
    buildUI();
    bindEvents();
    setupFabDrag();
    setupPanelDrag();
    positionFab();
    updateStatus();
    ensureAiColors();
    setupBubble();
    initTts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
