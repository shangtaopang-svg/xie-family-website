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
    // 血缘/最亲：我的，或「和X血缘最近/最亲」（无「我」也算，如「和沦最亲的10个人」）；与服务端 intent.js 镜像
    if (/血缘|最亲|血亲/.test(m) && (/我|本人/.test(m) || /(和|与)[^，。？！\s]{1,12}?(血缘|最亲|血亲)/.test(m))) return true;
    return false;
  }
  /* 族人个人信息（隐私）镜像判定：与 server/ai/intent.js 的 isPersonPrivacyRequest 对应，
     用于未验证时即时弹验证表单；服务端仍是最终安全边界。 */
  var PRIV = ['生平', '简历', '简介', '介绍', '是谁', '什么来历', '来历', '情况', '资料', '信息', '生卒', '出生', '生辰', '生日', '去世', '死亡', '殁', '葬', '年纪', '年龄', '几岁', '多大', '多少岁', '配偶', '妻子', '丈夫', '夫人', '娶', '嫁', '改嫁', '续弦', '子女', '儿女', '家庭', '家属', '家人', '媳妇', '女婿', '职业', '工作', '住址', '地址', '住哪', '哪里人', '电话', '手机', '联系方式', '身份证'];
  function looksPrivacy(m) {
    if (!m) return false;
    var hit = false;
    for (var i = 0; i < PRIV.length; i++) if (m.indexOf(PRIV[i]) !== -1) { hit = true; break; }
    if (!hit) return false;
    // 具体指向某人：姓名词 + 的 + 隐私词（如：敬乙的生平）
    if (/(.{2,8})的(生平|生卒|出生|生辰|生日|去世|死亡|葬|配偶|妻子|丈夫|子女|儿女|家庭|家属|家人|媳妇|女婿|职业|工作|住址|地址|电话|手机|联系方式|身份证|年纪|年龄|几岁|简历|简介|情况|资料|信息)/.test(m)) return true;
    // 指向本人/他人（我们村、你们村不误拦）
    if (/(我的|本人|我自己|他|她|族人|族亲|他们)/.test(m)) return true;
    return false;
  }

  var CHIPS = [
    { t: '请从炎帝神农氏开始，呈现我的世系图', lock: true },
    { t: '请列出和我血缘最亲的人', lock: true },
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
  var LS_CLOSURE = 'ai_last_closure'; // 诊断：记录面板最近一次关闭来源
  var MAX_HIST = 50;
  var APP_VERSION = 'v64'; // 与 scripts/inject-ai-html.js 的 VERSION 保持一致（面板状态栏显示，用于诊断缓存）
  var IS_MOBILE = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches;
  var WELCOME = '您好，我是下枫槎谢氏家族的 AI 助手 🤖\n可以问我村史、族谱、字辈等公开问题。涉及个人世系、族人个人信息的查询，需先完成族人身份验证。';

  var fab, panel, msgs, chipsEl, input, sendBtn, statusEl, goBottom, header, bubble, soundBtn, stopBtn, maxBtn, subEl;
  var hist = [];
  var isOpen = false;
  var ttsMuted = true; // 语音朗读开关（v17 起默认关闭：回答不自动念，用户可点 🔊 开启）
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
      '    <button type="button" class="ai-sound ai-max" id="ai-max" aria-label="放大到整屏" title="放大到整屏">⛶</button>' +
      '    <button type="button" class="ai-sound" id="ai-sound" aria-label="语音朗读开关" title="语音朗读">🔊</button>' +
      '    <button type="button" class="ai-sound" id="ai-stop" aria-label="暂停口播" title="暂停口播" hidden>⏸</button>' +
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

    // 独立全屏字幕层：口播时浮在屏幕底部，不占面板位置；一行、加宽，手机端同理
    subLayer = document.createElement('div');
    subLayer.className = 'ai-subtitle-layer';
    subLayer.id = 'ai-subtitle-layer';
    subLayer.hidden = true;
    subLayer.innerHTML = '<div class="ai-subtitle" id="ai-subtitle"></div>';
    document.body.appendChild(subLayer);

    msgs = $('#ai-msgs', panel);
    chipsEl = $('#ai-chips', panel);
    input = $('#ai-input', panel);
    sendBtn = $('#ai-send', panel);
    statusEl = $('#ai-status', panel);
    header = $('.ai-header', panel);
    soundBtn = $('#ai-sound', panel);
    stopBtn = $('#ai-stop', panel);
    maxBtn = $('#ai-max', panel);
    subEl = $('#ai-subtitle', subLayer);

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
    if (isOpen && !panel.hidden) return;
    if (isOpen && panel.hidden) isOpen = false; // 状态残留修复：isOpen=true 但面板实际隐藏 → 复位后重新打开
    isOpen = true;
    panel.hidden = false;
    hideBubble(); // 打开面板时收起问候气泡
    // 用户点开咨询面板 = 表达已进入浏览 → 收起 entrance 欢迎验证遮罩层（若有），避免其 z-index(99999) 挡住 AI 面板交互
    var wl = document.getElementById('wl-overlay');
    if (wl && !wl.classList.contains('hide')) {
      wl.classList.add('hide');
      try { localStorage.setItem('wl_done', '1'); } catch (e) {}
    }
    document.body.style.overflow = 'hidden';
    renderHistory();
    // （v39）移除可见诊断横幅：上次关闭来源 + 近1小时面板异常条数，均会误报（page-nav 正常跳转 / 树/血缘 overlay 合法覆盖）。
    // 底层诊断日志（localStorage ai_last_closure / ai_diag）保留写入，供「窗口莫名消失」复发时排查。
    updateStatus();
    positionFab();
    if (isMb() || panel.classList.contains('ai-fullscreen')) {
      // 手机全屏 / 桌面放大到整屏：清掉桌面拖拽遗留的 inline 定位，让 CSS inset:0 生效
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

  /** 面板放大到整屏 / 恢复小窗（桌面端；手机端面板本就全屏，按钮已隐藏） */
  function toggleMaximize() {
    if (!panel || !maxBtn) return;
    var fs = panel.classList.toggle('ai-fullscreen');
    // 清掉任何 inline 定位，避免与 CSS inset:0 冲突（拖拽/panelPos 遗留）
    panel.style.left = ''; panel.style.top = ''; panel.style.right = ''; panel.style.bottom = '';
    panel.style.width = ''; panel.style.height = '';
    if (fs) {
      maxBtn.textContent = '🗗';
      maxBtn.title = '恢复小窗';
      maxBtn.setAttribute('aria-label', '恢复小窗');
    } else {
      maxBtn.textContent = '⛶';
      maxBtn.title = '放大到整屏';
      maxBtn.setAttribute('aria-label', '放大到整屏');
    }
    diagLog('maximize', fs ? 'fullscreen' : 'window');
  }

  function closePanel(skipBack, source) {
    if (!isOpen) return;
    isOpen = false;
    panel.hidden = true;
    stopSpeak(); // 关闭窗口同时停止朗读：避免出现「窗口关了但声音还在响」的诡异状态
    showBubble(); // 面板关闭后重新显示问候气泡
    document.body.style.overflow = '';
    input.blur();
    resetViewport();
    // 记录关闭来源（诊断用）：下次打开面板时若为「非用户显式操作」会在消息区提示原因
    try { localStorage.setItem(LS_CLOSURE, JSON.stringify({ s: source || 'unknown', t: Date.now() })); } catch (e) {}
    diagLog('closed-by', source || 'unknown');
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
    // 头像（美化）：bot 机器人 / user 族人人形，位于气泡外侧
    var ava = document.createElement('span');
    ava.className = 'ai-ava';
    ava.setAttribute('aria-hidden', 'true');
    ava.textContent = role === 'user' ? '🙋' : '🤖';
    el.appendChild(ava);
    var body = document.createElement('div');
    body.className = 'ai-txt';
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
    if ((looksLineage(t) || looksPrivacy(t)) && !getToken()) {
      showVerify(t, looksLineage(t) ? null : '该问题涉及族人的个人信息（隐私），请先完成族人身份验证（与站内验证一致，填姓名、父亲、祖父）。');
      return;
    }
    chat(t);
  }

  /* ---------------- 与后端通信（SSE） ---------------- */
  function chat(text) {
    var botEl = appendMessage('bot', '思考中…');
    var body = botEl.querySelector('.ai-txt') || botEl.lastChild;
    var done = false;

    var finish = function (answer, sources, tree, ownerIsSelf, closest, closestTree) {
      if (done) return;
      done = true;
      body.textContent = answer || '（无回答）';
      // 血缘最亲：口播按呈现的「家族血缘关系图」沿树朗读（closestTree 存在时），
      // 而非照读聊天框里的排名清单（用户 2026-08-12 要求）；聊天框仍显示排名清单
      var spokenText = (closestTree && closestTree.root) ? spokenFromClosestTree(closestTree.root, closestTree.targetName) : answer;
      if (spokenText && spokenText !== '（无回答）') { lastAnswer = spokenText; speak(spokenText); } // 自动朗读每次回复
      if (sources && sources.length) {
        var src = document.createElement('div');
        src.className = 'ai-src';
        src.textContent = '📚 参考：' + sources.join('、');
        (body || botEl).appendChild(src); // 放入文本节点内，头像布局下不错位
      }
      if (tree && tree.length) showTreeOverlay(tree, ownerIsSelf); // 世系图：呈现+朗读的同时弹出树状图
      if (closest && closest.length) showClosestOverlay(closest, closestTree); // 血缘最亲：弹出家族关系树 + 亲密系数图
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
          if (j.ok) finish(j.answer, j.sources || [], j.tree, j.ownerIsSelf !== false, j.closest || [], j.closestTree || null);
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
          finish(j.answer || collect, j.sources || [], j.tree, j.ownerIsSelf !== false, j.closest || [], j.closestTree || null);
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
      if (!moved && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) moved = true;
      if (!moved) return;
      var c = clampPos(startL + dx, startT + dy, 56, 56);
      fab.style.left = c.x + 'px';
      fab.style.top = c.y + 'px';
      fab.style.right = 'auto';
      fab.style.bottom = 'auto';
    });
    var endFabDrag = function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      // 只有「最终真的拖出一段距离(>8px)」才算拖拽；点击时的轻微抖动（移出去又回到原点）不算，
      // 否则电脑端鼠标点击略有抖动就被误判为拖拽，导致点悬浮球永远打不开面板。
      if (moved && dist > 8) {
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
      if (panel.classList.contains('ai-fullscreen')) return;         // 放大到整屏时不拖动
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
  function updateTtsBtns() { // 同步主面板 + 世系图弹层 + 血缘关系图弹层三处声音按钮图标
    var icon = ttsMuted ? '🔇' : '🔊';
    if (soundBtn) soundBtn.textContent = icon;
    if (treeOverlay) {
      var tb = treeOverlay.querySelector('.ai-tree-sound');
      if (tb) { tb.textContent = icon; tb.title = ttsMuted ? '打开声音' : '静音'; tb.setAttribute('aria-label', ttsMuted ? '打开声音' : '静音'); }
    }
    if (closestOverlay) { // 血缘关系图弹层的播音开关
      var cb = closestOverlay.querySelector('.ai-closest-sound');
      if (cb) { cb.textContent = icon; cb.title = ttsMuted ? '打开声音' : '静音'; cb.setAttribute('aria-label', ttsMuted ? '打开声音' : '静音'); }
    }
  }
  function initTts() {
    try { ttsMuted = localStorage.getItem(LS_TTS_MUTED) !== '0'; } catch (e) { ttsMuted = true; }
    updateTtsBtns();
  }
  function toggleTts() {
    ttsMuted = !ttsMuted;
    try { localStorage.setItem(LS_TTS_MUTED, ttsMuted ? '1' : '0'); } catch (e) {}
    updateTtsBtns();
    if (!ttsMuted && audioEl) { try { audioEl.play().catch(noop); } catch (e) {} } // 重新打开时恢复播放
  }
  /** 口播控制按钮（暂停/继续/重听）统一渲染：同步主面板 #ai-stop + 世系图弹层 .ai-tree-stop 两处 */
  function renderNarBtn(icon, title, label, show, autoHide) {
    var showBtn = show !== false;
    if (stopBtn) {
      stopBtn.hidden = !showBtn;
      stopBtn.textContent = icon;
      stopBtn.title = title;
      stopBtn.setAttribute('aria-label', label);
    }
    if (treeOverlay) {
      var tb = treeOverlay.querySelector('.ai-tree-stop');
      if (tb) {
        tb.hidden = !showBtn;
        tb.textContent = icon;
        tb.title = title;
        tb.setAttribute('aria-label', label);
      }
    }
    if (closestOverlay) { // 血缘关系图弹层暂停/继续/重听按钮同步（与世系图弹层同状态机）
      var cb2 = closestOverlay.querySelector('.ai-closest-stop');
      if (cb2) {
        cb2.hidden = !showBtn;
        cb2.textContent = icon;
        cb2.title = title;
        cb2.setAttribute('aria-label', label);
      }
    }
    if (autoHide) { // TTS 失败等临时提示，超时后收起
      setTimeout(function () {
        if (stopBtn && narState === 'none') stopBtn.hidden = true;
        if (treeOverlay) {
          var t2 = treeOverlay.querySelector('.ai-tree-stop');
          if (t2 && narState === 'none') t2.hidden = true;
        }
        if (closestOverlay) {
          var c3 = closestOverlay.querySelector('.ai-closest-stop');
          if (c3 && narState === 'none') c3.hidden = true;
        }
      }, autoHide);
    }
  }
  /** 按当前口播状态推断按钮（供树弹层打开时初始化） */
  function syncNarBtn() {
    if (narState === 'paused') renderNarBtn('▶', '继续口播', '继续口播', true);
    else if (narState === 'ended') renderNarBtn('🔁', '重新听一遍', '重新听一遍', true);
    else if (narState === 'playing') renderNarBtn('⏸', '暂停口播', '暂停口播', true);
    else renderNarBtn('⏸', '暂停口播', '暂停口播', false);
  }
  /** 口播按钮状态机：none 无 | playing 朗读中 | paused 已暂停(可继续) | ended 已读完(可重听) */
  var narState = 'none';
  var lastAnswer = '';   // 最近一次回答原文，供「重新听」回放
  // —— 口播字幕条（电报打字感，跟随词边界逐渐揭示） ——
  var subText = '';        // 当前朗读全文
  var subCharTimes = null; // 逐字符揭示时间轴（服务端 charTimes，长度=subText.length，精确驱动逐字卡拉OK）
  var subDur = 0;          // 音频总时长（无 charTimes 时按音频时长比例兜底）
  var subLastN = -1;       // 已渲染的已读字符数（避免每帧重建 DOM）
  var subDoneEl = null, subCurEl = null, subRestEl = null; // 字幕三个 span 缓存引用
  var subRaf = null;       // rAF 句柄
  var subHideTimer = null; // 读完后收起字幕条的定时器
  var subLayer = null;     // 独立全屏字幕层容器（口播时浮在屏幕底部，一行加宽）
  function stopSpeak() { // 完全停止并清空（发送新问题/关窗/Esc 等沿用）
    narState = 'none';
    stopSubtitle();
    if (audioEl) { try { audioEl.pause(); audioEl.removeAttribute('src'); audioEl.load(); } catch (e) {} }
    renderNarBtn('⏸', '暂停口播', '暂停口播', false); // 两处口播按钮都收起
  }
  function pauseNarration() { // 暂停，保留进度可继续
    if (!audioEl || narState !== 'playing') return;
    narState = 'paused';
    try { audioEl.pause(); } catch (e) {}
    if (subRaf) { cancelAnimationFrame(subRaf); subRaf = null; } // 冻结字幕（currentTime 已停，文字停在当前处）
    renderNarBtn('▶', '继续口播', '继续口播', true);
  }
  function resumeNarration() { // 从暂停处继续
    if (!audioEl || narState !== 'paused') return;
    narState = 'playing';
    audioEl.play().catch(noop);
    renderNarBtn('⏸', '暂停口播', '暂停口播', true);
  }
  function replayLast() { // 整段读完后再听一遍
    if (narState !== 'ended' || !lastAnswer) return;
    speak(lastAnswer); // 重新生成并朗读最近一次回答
  }

  /* ---------------- 口播字幕条（电报打字感，跟随口播逐渐出现） ---------------- */
  /** 把服务端返回的 base64 MP3 转成 Blob（/api/tts 改返回 JSON 后使用） */
  function base64ToBlob(b64, mime) {
    var bin = atob(b64);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }
  /** 开始字幕条：记录全文与词级时间戳，预计算每个词结束时的累计字符数，并按标点切句 */
  function startSubtitle(text, charTimes) {
    if (!subEl || !subLayer) return;
    subText = text || '';
    // 服务端 charTimes：每个字符的揭示时间（秒），长度与 subText 一致 → 逐字卡拉OK精确同步；
    // 缺失/长度不符时退回音频时长比例（subTick 兜底），保证字幕仍能跟进。
    subCharTimes = (Array.isArray(charTimes) && charTimes.length === subText.length) ? charTimes : null;
    subDur = 0;
    subLastN = -1;
    subDoneEl = subCurEl = subRestEl = null;
    subEl.textContent = '';
    subEl.scrollLeft = 0;
    subLayer.hidden = false;
    document.body.classList.add('ai-sub-on'); // 手机端让全屏树/面板让出底部条带，字幕不遮挡其他内容
    startSubLoop();
  }
  /** 启动揭示循环（幂等；playing/resume 后由事件再次拉起） */
  function startSubLoop() {
    if (!subEl || !subLayer || subLayer.hidden) return;
    if (!subRaf) subRaf = requestAnimationFrame(subTick);
  }
  /** 字幕比声音略提前揭示（约 150ms），符合中文口播字幕惯例，感知为「跟得上」；感觉滞后/超前可微调 */
  var SUB_LEAD = 0.15;
  /** 二分：当前时刻 ct 已揭示的字符数（charTimes[i] <= ct 的个数） */
  function charPosAt(ct, times) {
    var lo = 0, hi = times.length - 1, ans = 0;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (times[mid] <= ct) { ans = mid + 1; lo = mid + 1; }
      else { hi = mid - 1; }
    }
    return ans;
  }
  /** 每帧：精确算出已读字符数。
   *  优先用服务端 charTimes（词边界对齐到含标点原文的逐字符时间轴）→ 每个字在口播念到的时刻亮起，与口播逐字贴合；
   *  缺失时退回音频时长比例（ct/dur 跟随 currentTime），暂停冻结、恢复推进、结束补全。 */
  function subTick() {
    subRaf = requestAnimationFrame(subTick);
    if (!subEl || !subLayer || subLayer.hidden || !audioEl) return;
    var ct = (audioEl.currentTime || 0) + SUB_LEAD;
    var n;
    if (subCharTimes) {
      n = charPosAt(ct, subCharTimes);
    } else {
      var dur = subDur;
      if (!(dur > 0)) {
        var ad = audioEl.duration;
        dur = (isFinite(ad) && ad > 0) ? ad : 1;
      }
      n = subText.length * Math.max(0, Math.min(1, ct / dur));
    }
    n = Math.max(0, Math.min(Math.floor(n), subText.length));
    renderSubtitle(n);
  }
  /** 按中文标点（句号/问号/叹号/分号/省略号）切句，字幕条只显示「当前正在读的那句」，避免整段横滚 */
  function splitSentences(txt) {
    var out = [];
    var s = 0;
    for (var i = 0; i < txt.length; i++) {
      if ('。！？；…，、：'.indexOf(txt.charAt(i)) !== -1) {
        out.push({ s: s, e: i + 1 });
        s = i + 1;
      }
    }
    if (s < txt.length) out.push({ s: s, e: txt.length });
    return out;
  }
  /** 定位当前已读位置 n 所在的句子 */
  function findSeg(n) {
    for (var i = 0; i < subSent.length; i++) {
      if (subSent[i].s <= n && n <= subSent[i].e) return subSent[i];
    }
    return subSent[subSent.length - 1] || { s: 0, e: subText.length };
  }
  /** 渲染字幕：单行横滚展示（全文在一个 <span> 里，每个字都在字幕中，不漏字），
   *  已读亮色 + 当前字高亮块(光标闪烁) + 未读极淡；
   *  字幕条横向滚动让「当前字」始终停在可视区中部，口播念到哪字就看到哪字。 */
  function renderSubtitle(n) {
    if (!subEl) return;
    if (!subDoneEl || !subDoneEl.isConnected) {
      subEl.innerHTML = '<span class="ai-sub-done"></span><span class="ai-sub-cur"></span><span class="ai-sub-rest"></span>';
      subDoneEl = subEl.firstChild;
      subCurEl = subDoneEl.nextSibling;
      subRestEl = subCurEl.nextSibling;
      subLastN = -1;
    }
    if (subLastN !== n) {
      subDoneEl.textContent = subText.slice(0, n);
      subCurEl.textContent = subText.charAt(n);
      subRestEl.textContent = subText.slice(n + 1);
      subLastN = n;
    }
    if (subEl.scrollWidth > subEl.clientWidth + 4) {
      var target = subCurEl.offsetLeft - subEl.clientWidth / 2 + subCurEl.offsetWidth / 2;
      subEl.scrollLeft = Math.max(0, Math.min(target, subEl.scrollWidth - subEl.clientWidth));
    }
  }
  /** 自然读完：全文全部亮起，停留 2.6s 后自动收起 */
  function finishSubtitle() {
    if (!subEl || !subLayer || subLayer.hidden) return;
    if (subRaf) { cancelAnimationFrame(subRaf); subRaf = null; }
    if (!subDoneEl || !subDoneEl.isConnected) {
      subEl.innerHTML = '<span class="ai-sub-done"></span><span class="ai-sub-cur"></span><span class="ai-sub-rest"></span>';
      subDoneEl = subEl.firstChild; subCurEl = subDoneEl.nextSibling; subRestEl = subCurEl.nextSibling;
    }
    subDoneEl.textContent = subText;
    subCurEl.textContent = '';
    subRestEl.textContent = '';
    subEl.scrollLeft = 0;
    if (subHideTimer) clearTimeout(subHideTimer);
    subHideTimer = setTimeout(function () {
      if (subLayer) { subLayer.hidden = true; subEl.textContent = ''; }
      document.body.classList.remove('ai-sub-on');
      subText = ''; subCharTimes = null; subLastN = -1; subDoneEl = subCurEl = subRestEl = null;
    }, 2600);
  }
  /** 停止并清空字幕（发送新问题/关窗/停止口播等沿用） */
  function stopSubtitle() {
    if (subRaf) { cancelAnimationFrame(subRaf); subRaf = null; }
    if (subHideTimer) { clearTimeout(subHideTimer); subHideTimer = null; }
    if (subLayer) subLayer.hidden = true;
    if (subEl) subEl.textContent = '';
    document.body.classList.remove('ai-sub-on');
    subText = ''; subCharTimes = null; subLastN = -1; subDoneEl = subCurEl = subRestEl = null;
  }

  var audioBound = false;
  function bindAudioEl() {
    if (audioBound || !audioEl) return;
    audioBound = true;
    // 注意：自然结束时 Chromium 先触发 pause 再触发 ended；这里不监听 pause，
    // 因为 stopSpeak/pauseNarration/ended 三条路径都显式管理了状态，监听 pause 反而会把「自然读完」误判成停止清掉 🔁。
    audioEl.addEventListener('loadedmetadata', function () { subDur = audioEl.duration || 0; });
    audioEl.addEventListener('playing', function () {
      narState = 'playing';
      startSubLoop(); // 口播继续 → 字幕继续揭示
      renderNarBtn('⏸', '暂停口播', '暂停口播', true);
    });
    audioEl.addEventListener('ended', function () {
      narState = 'ended';
      finishSubtitle(); // 口播读完 → 字幕补全后收起
      try { URL.revokeObjectURL(audioEl.src); } catch (e) {}
      renderNarBtn('🔁', '重新听一遍', '重新听一遍', true);
    });
    audioEl.addEventListener('error', function () { stopSpeak(); });
  }
  /** 把答案文本处理成适合朗读的流畅句子 */
  function prepareSpoken(text) {
    return String(text)
      .replace(/\*\*/g, '')                // 去掉 ** 加粗标记（不念出来）
      .replace(/←\s*([^\s，,（]+)/g, '，是$1本人') // 世系图箭头「← 您/← 被查族人」
      .replace(/[→➜▶|]/g, '，')             // 各类箭头/竖线 → 逗号
      .replace(/[●◆▪•★☆]/g, '，')           // 列表符号 → 逗号
      .replace(/^\d+\.\s+/gm, '')            // 行首排名/编号「1. 2. …」不念（血缘最亲的 1/2/4/7/10 等，显示仍保留）
      .replace(/【([^】]*)】/g, '$1')        // 【…】去掉括号但保留内容朗读
      .replace(/[《》""]/g, '')               // 去掉书名号/引号
      .replace(/\s*\n+\s*/g, '，')           // 换行 → 逗号
      .replace(/[，、]{2,}/g, '，')           // 合并连续顿号/逗号
      .replace(/[：:][，,]/g, '：')           // 「：，」→「：」（换行转逗号时紧跟在冒号后产生）
      .replace(/[，,]+$/g, '')
      .replace(/[。！？!?]+$/, '。')
      .trim()
      .slice(0, 800); // 与服务器 /api/tts 的 800 字上限对齐，避免超长回答静默失败
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
      return r.json();
    }).then(function (j) {
      if (ttsMuted) return;
      // v15 守卫：TTS 生成期间面板可能已被关闭（Esc/✕/机器人等），此时 audioEl 还是 null，
      // closePanel 的 stopSpeak() 拦不住 —— 若继续起播就会出现「窗口消失、声音还在响」。
      // 必须在起播前确认面板仍打开；被跳过则记入诊断，便于确认竞态确实被拦截。
      if (!isOpen || panel.hidden) { diagLog('tts-skipped-panel-closed', ''); return; }
      if (!audioEl) { audioEl = new Audio(); bindAudioEl(); }
      audioEl.src = URL.createObjectURL(base64ToBlob(j.audio, 'audio/mpeg'));
      startSubtitle(spoken, j.charTimes); // 字幕条开始，随 charTimes 逐字卡拉OK揭示（词边界精确同步，不漏字）
      audioEl.play().catch(function (e) {
        // 播放被拦/解码失败：不能静默（否则「口播没开始、字幕也没出现」用户无感知），给出可重试提示
        diagLog('tts-play-fail', String(e && e.message || e));
        renderNarBtn('🔁', '播放失败，点击重听', '播放失败，点击重听', true);
      });
    }).catch(function (err) {
      // TTS 生成失败：不静默吞掉（口播/字幕都会没有）——口播按钮短暂提示「朗读失败」，可点击重听
      diagLog('tts-error', String(err && err.message || err));
      renderNarBtn('😶', '朗读失败，点击重听', '朗读失败，点击重听', true, 3500);
    });
  }

  /* ---------------- 世系树状弹出层（呈现+朗读的同时弹出） ---------------- */
  function esc(s) {
    if (s === undefined || s === null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  /** 迁徙阶段 → 徽标配色类 */
  function branchCls(b) {
    b = b || '';
    if (b.indexOf('远古') !== -1) return 'tb-ancient';
    if (b.indexOf('申伯') !== -1) return 'tb-shenbo';
    if (b.indexOf('东山') !== -1) return 'tb-dongshan';
    if (b.indexOf('临海') !== -1) return 'tb-linhai';
    if (b.indexOf('石马') !== -1) return 'tb-shima';
    if (b.indexOf('枫槎') !== -1) return 'tb-fengcha';
    return 'tb-other';
  }
  var treeOverlay = null;
  function showTreeOverlay(nodes, ownerIsSelf) {
    if (!nodes || !nodes.length) return;
    closeTreeOverlay();
    var last = nodes[nodes.length - 1];
    var ov = document.createElement('div');
    ov.id = 'ai-tree-overlay';
    ov.innerHTML =
      '<div class="ai-tree-modal">' +
      '  <div class="ai-tree-head"><span class="ai-tree-title">🌳 世系图 · 从炎帝神农氏到' + esc(last.name) + '</span>' +
      '    <span class="ai-tree-headbtns">' +
      '      <button type="button" class="ai-tree-stop" aria-label="暂停口播" title="暂停口播" hidden>⏸</button>' +
      '      <button type="button" class="ai-tree-sound" aria-label="' + (ttsMuted ? '打开声音' : '静音') + '" title="' + (ttsMuted ? '打开声音' : '静音') + '">' + (ttsMuted ? '🔇' : '🔊') + '</button>' +
      '      <button type="button" class="ai-tree-close" aria-label="关闭">✕</button>' +
      '    </span></div>' +
      '  <div class="ai-tree-body"></div>' +
      '</div>';
    document.body.appendChild(ov);
    treeOverlay = ov;
    var tbody = ov.querySelector('.ai-tree-body');
    var frag = document.createDocumentFragment();
    nodes.forEach(function (n) {
      var row = document.createElement('div');
      row.className = 'ai-tree-node' + (n.isSelf ? ' self' : '');
      var badges = '';
      if (n.adopt) badges += '<span class="ai-tree-badge adopt" title="' + esc(n.adopt) + '">⚠ ' + esc(n.adopt) + '</span>';
      if (n.branch) badges += '<span class="ai-tree-badge ' + branchCls(n.branch) + '">' + esc(n.branch) + '</span>';
      var note = n.adopt ? '' : (n.note ? n.note : '');
      row.innerHTML =
        '<div class="ai-tree-sh"><span class="ai-tree-shi">第' + esc(n.shi) + '世</span>' + (n.isSelf ? '<span class="ai-tree-you">' + esc(ownerIsSelf ? '您' : n.name) + '</span>' : '') + '</div>' +
        '<div class="ai-tree-name">' + esc(n.name) + '</div>' +
        (note ? '<div class="ai-tree-note">' + esc(note) + '</div>' : '') +
        (badges ? '<div class="ai-tree-badges">' + badges + '</div>' : '');
      frag.appendChild(row);
    });
    tbody.appendChild(frag);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeTreeOverlay(); });
    var treeSoundBtn = ov.querySelector('.ai-tree-sound');
    if (treeSoundBtn) treeSoundBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleTts(); });
    var treeStopBtn = ov.querySelector('.ai-tree-stop');
    if (treeStopBtn) treeStopBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (narState === 'playing') pauseNarration();
      else if (narState === 'paused') resumeNarration();
      else if (narState === 'ended') replayLast();
      else if (lastAnswer) replayLast(); // TTS 失败/已停止但有最近回答 → 点击重听
    });
    ov.querySelector('.ai-tree-close').addEventListener('click', closeTreeOverlay);
    var onKey = function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation(); // 捕获阶段拦截，避免面板自身的 Esc 关闭逻辑一起触发
        closeTreeOverlay();
        document.removeEventListener('keydown', onKey, true);
      }
    };
    document.addEventListener('keydown', onKey, true);
    syncNarBtn(); // 树弹层打开时按当前口播状态显示暂停/继续按钮
    scrollBottom(true);
  }
  function closeTreeOverlay() {
    if (treeOverlay) { try { treeOverlay.parentNode.removeChild(treeOverlay); } catch (e) {} treeOverlay = null; }
  }

  /* ---------------- 血缘最亲 N 人：基因共享率弹层（#72；v41 改为遗传学亲等 r） ---------------- */
  var closestOverlay = null;
  /* 血缘树节点（#82）：递归生成 <li> 结构，ul/li 经典 CSS 树连接线由 .ai-cl-tree 控制 */
  function renderClosestNode(node) {
    var tierCls = node.self ? ' self' : (node.tier ? ' t' + node.tier : '');
    var shared = node.shared ? '<em>' + node.shared + '%</em>' : '';
    var people = (node.people && node.people.length)
      ? node.people.map(function (p) {
          return '<span class="ai-cl-p' + (p.alive ? '' : ' dead') + '">' + esc(p.name) + '</span>';
        }).join('')
      : '<span class="ai-cl-p empty">暂无记录</span>';
    var note = node.note ? '<div class="ai-cl-note">' + esc(node.note) + '</div>' : '';
    var children = '';
    if (node.children && node.children.length) {
      children = '<ul>' + node.children.map(renderClosestNode).join('') + '</ul>';
    }
    return '<li>' +
      '<div class="ai-cl-node' + tierCls + '">' +
        '<div class="ai-cl-rel">' + esc(node.rel) + shared + '</div>' +
        '<div class="ai-cl-ppl">' + people + '</div>' +
        note +
      '</div>' + children +
    '</li>';
  }
  /* 血缘树口播（用户 2026-08-12 要求）：按呈现的「家族血缘关系图」逐节点朗读——
     沿树 DFS 顺序（先长辈、再同辈、后晚辈），与 renderClosestNode 的展示顺序一致，
     每层念「关系（父亲/母亲的备注）+基因共享%+人名」，不再照读聊天框里的排名清单 */
  function spokenFromClosestTree(root, targetName) {
    if (!root) return '';
    var who = (targetName && targetName !== '您') ? targetName : '您'; // 查他人时念其姓名
    var parts = [];
    (function walk(node) {
      var names = (node.people && node.people.length)
        ? node.people.map(function (p) { return p && p.name; }).filter(Boolean)
        : [];
      var label = node.self ? (who === '您' ? '您本人' : '本人') : String(node.rel || '').replace(/\s*\/\s*/g, '、');
      var note = node.note ? '，' + String(node.note).replace(/\s*\/\s*/g, '、') : '';
      var shared = node.shared ? '，基因共享 ' + node.shared + '%' : '';
      var namePart;
      if (node.self) namePart = names[0] || '';
      else if (names.length === 1) namePart = names[0];
      else if (names.length > 1) namePart = names.slice(0, 3).join('、') + (names.length > 3 ? ' 等' + names.length + '人' : '');
      else namePart = '暂无记录';
      parts.push(label + note + shared + '：' + namePart);
      if (node.children && node.children.length) node.children.forEach(walk);
    })(root);
    if (!parts.length) return '';
    return '这是' + (who === '您' ? '您的' : who + '的') + '家族血缘关系图：' + parts.join('。') + '。';
  }
  /* 血缘树缩放（#85）：transform:scale 缩放 .ai-cl-zoom-canvas 并补偿宽高，
     .ai-cl-zoom-wrap 负责横向滚动/拖拽平移；支持按钮/Ctrl+滚轮/触控板捏合/双指捏合 */
  function initClosestZoom(rootEl) {
    var wrap = rootEl.querySelector('.ai-cl-zoom-wrap');
    var canvas = rootEl.querySelector('.ai-cl-zoom-canvas');
    var valEl = rootEl.querySelector('.ai-cl-zoom-val');
    if (!wrap || !canvas) return;
    var tree = canvas.querySelector('.ai-cl-tree');
    var baseW = tree.scrollWidth, baseH = tree.scrollHeight;
    var z = 1, MIN = 0.4, MAX = 3;
    /* prevZ：缩放前的 z，用于缩放时保持视口中心锚定（内容点不动） */
    function applyZoom(prevZ) {
      var cx = wrap.clientWidth / 2, cy = wrap.clientHeight / 2;
      var pz = prevZ || z;
      var px = (wrap.scrollLeft + cx) / pz, py = (wrap.scrollTop + cy) / pz;
      canvas.style.transformOrigin = 'top left';
      canvas.style.transform = 'scale(' + z + ')';
      canvas.style.width = Math.round(baseW * z) + 'px';
      canvas.style.height = Math.round(baseH * z) + 'px';
      if (valEl) valEl.textContent = Math.round(z * 100) + '%';
      wrap.scrollLeft = Math.max(0, px * z - cx);
      wrap.scrollTop = Math.max(0, py * z - cy);
    }
    applyZoom(1);
    wrap.scrollLeft = Math.max(0, (baseW * z - wrap.clientWidth) / 2); // 初始水平居中到「你本人」附近
    function toggleFullscreen() {
      var ov = document.getElementById('ai-closest-overlay');
      if (!ov) return;
      var fs = ov.classList.toggle('ai-closest-fs');
      var btn = ov.querySelector('.ai-cl-fsbtn');
      if (btn) { btn.textContent = fs ? '🗗' : '⛶'; btn.title = fs ? '退出全屏' : '全屏'; }
      // 全屏/退出后视口尺寸变化，重新适配并居中到「您本人」
      requestAnimationFrame(function () {
        z = 1; applyZoom(1);
        wrap.scrollLeft = Math.max(0, (baseW * z - wrap.clientWidth) / 2);
        wrap.scrollTop = Math.max(0, (baseH * z - wrap.clientHeight) / 2);
      });
    }
    rootEl.querySelectorAll('.ai-cl-zbtn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var prevZ = z;
        var act = btn.getAttribute('data-z');
        if (act === 'in') z = Math.min(MAX, z * 1.25);
        else if (act === 'out') z = Math.max(MIN, z * 0.8);
        else if (act === 'fs') { toggleFullscreen(); return; }
        else z = 1;
        applyZoom(prevZ);
      });
    });
    // Ctrl+滚轮 / 触控板捏合 → 缩放；普通滚轮 → 滚动
    wrap.addEventListener('wheel', function (e) {
      if (e.ctrlKey) {
        e.preventDefault();
        var prevZ = z;
        z = Math.max(MIN, Math.min(MAX, z * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
        applyZoom(prevZ);
      }
    }, { passive: false });
    // 鼠标拖拽平移
    var drag = null;
    wrap.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') {
        drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: wrap.scrollLeft, sy: wrap.scrollTop };
        wrap.classList.add('dragging');
      }
    });
    wrap.addEventListener('pointermove', function (e) {
      if (drag && e.pointerId === drag.id) {
        wrap.scrollLeft = drag.sx - (e.clientX - drag.x);
        wrap.scrollTop = drag.sy - (e.clientY - drag.y);
      }
    });
    wrap.addEventListener('pointerup', function (e) {
      if (drag && e.pointerId === drag.id) drag = null;
      wrap.classList.remove('dragging');
    });
    wrap.addEventListener('pointercancel', function () { drag = null; wrap.classList.remove('dragging'); });
    // 触摸双指捏合缩放
    var pts = {}, pinch = null;
    function pinchDist() {
      var ids = Object.keys(pts);
      if (ids.length < 2) return 0;
      var a = pts[ids[0]], b = pts[ids[1]];
      return Math.hypot(a.x - b.x, a.y - b.y);
    }
    wrap.addEventListener('pointerdown', function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (Object.keys(pts).length === 2) pinch = { d0: pinchDist(), z0: z };
    });
    wrap.addEventListener('pointermove', function (e) {
      if (pts[e.pointerId]) pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (pinch && Object.keys(pts).length === 2) {
        var d = pinchDist();
        if (d > 0) {
          var prevZ = z;
          var nz = Math.max(MIN, Math.min(MAX, pinch.z0 * (d / pinch.d0)));
          if (Math.abs(nz - z) > 0.005) { z = nz; applyZoom(prevZ); }
        }
      }
    });
    var endPinch = function (e) {
      delete pts[e.pointerId];
      if (Object.keys(pts).length < 2) pinch = null;
    };
    wrap.addEventListener('pointerup', endPinch);
    wrap.addEventListener('pointercancel', endPinch);
  }
  function showClosestOverlay(list, tree) {
    if ((!list || !list.length) && !(tree && tree.root)) return;
    closeClosestOverlay();
    var ov = document.createElement('div');
    ov.id = 'ai-closest-overlay';
    // 查任意族人时（如「和沦最亲的10个人」），标题带上被查者姓名
    var tName = (tree && tree.targetName) || '';
    var title = (tree && tree.root)
      ? '家族血缘关系图' + (tName && tName !== '您' ? ' · ' + tName : '')
      : ('❤️ 与您血缘最近的 ' + list.length + ' 位族人');
    ov.innerHTML =
      '<div class="ai-closest-modal">' +
      '  <div class="ai-tree-head"><span class="ai-tree-title">' + title + '</span>' +
      '    <span class="ai-tree-headbtns">' +
      '      <button type="button" class="ai-closest-sound" aria-label="' + (ttsMuted ? '打开声音' : '静音') + '" title="' + (ttsMuted ? '打开声音' : '静音') + '">' + (ttsMuted ? '🔇' : '🔊') + '</button>' +
      '      <button type="button" class="ai-closest-stop" aria-label="暂停口播" title="暂停口播" hidden>⏸</button>' +
      '      <button type="button" class="ai-closest-close" aria-label="关闭">✕</button>' +
      '    </span></div>' +
      '  <div class="ai-closest-body"></div>' +
      '</div>';
    document.body.appendChild(ov);
    closestOverlay = ov;
    var body = ov.querySelector('.ai-closest-body');
    // #82 血缘树：画出家族关系树（用户 ASCII 模板：曾祖父12.5→祖父25→父亲50，旁系25，同辈50）
    // 只画树不画排名列表（用户要求去掉下方的「按基因共享率排名」列表，树上的百分比已足够）
    if (tree && tree.root) {
      var treeWrap = document.createElement('div');
      treeWrap.className = 'ai-cl-tree-wrap';
      treeWrap.innerHTML =
        '<div class="ai-cl-zoom">' +
        '  <div class="ai-cl-zoom-bar">' +
        '    <button type="button" class="ai-cl-zbtn" data-z="out" aria-label="缩小" title="缩小">−</button>' +
        '    <span class="ai-cl-zoom-val" aria-live="polite">100%</span>' +
        '    <button type="button" class="ai-cl-zbtn" data-z="in" aria-label="放大" title="放大">＋</button>' +
        '    <button type="button" class="ai-cl-zbtn" data-z="reset" aria-label="还原 100%" title="还原 100%">⟳</button>' +
        '    <button type="button" class="ai-cl-zbtn ai-cl-fsbtn" data-z="fs" aria-label="全屏" title="全屏">⛶</button>' +
        '  </div>' +
        '  <div class="ai-cl-zoom-wrap">' +
        '    <div class="ai-cl-zoom-canvas">' +
        '      <div class="ai-cl-tree"><ul>' + renderClosestNode(tree.root) + '</ul></div>' +
        '    </div>' +
        '  </div>' +
        '</div>' +
        '<div class="ai-cl-legend">' +
        '  <span class="ai-cl-lg t1"><i></i>第一梯队（50%）</span>' +
        '  <span class="ai-cl-lg t2"><i></i>第二梯队（25%）</span>' +
        '  <span class="ai-cl-lg t3"><i></i>第三梯队（12.5%）</span>' +
        '</div>';
      body.appendChild(treeWrap);
      initClosestZoom(treeWrap);
    } else if (list && list.length) {
      // 兜底：无树时保留原来的排名列表
      var frag = document.createDocumentFragment();
      list.forEach(function (r, i) {
      var pct = Math.round((r.shared || 0) * 100);
      var row = document.createElement('div');
      row.className = 'ai-closest-row' + ((r.shared || 0) >= 0.25 ? ' hot' : '');
      var shi = (r.shi && Number(r.shi) >= 1) ? ' · 第' + esc(r.shi) + '世' : '';
      var b = (r.branch && r.branch !== '—') ? '<span class="ai-closest-branch">' + esc(r.branch) + '</span>' : '';
      row.innerHTML =
        '<span class="ai-closest-rank">' + (r.rank || (i + 1)) + '</span>' +
        '<div class="ai-closest-info">' +
        '  <div class="ai-closest-name">' + esc(r.name) + '</div>' +
        '  <div class="ai-closest-rel">' + esc(r.rel) + shi + '</div>' +
        '</div>' +
        '<span class="ai-closest-coef" title="基因共享率：最高 50%（父母/子女/亲兄弟姐妹），越高越亲">' + pct + '%</span>' + b;
        frag.appendChild(row);
      });
      body.appendChild(frag);
    }
    ov.addEventListener('click', function (e) { if (e.target === ov) closeClosestOverlay(); });
    var soundBtn = ov.querySelector('.ai-closest-sound');
    if (soundBtn) soundBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleTts(); });
    var closestStopBtn = ov.querySelector('.ai-closest-stop');
    if (closestStopBtn) closestStopBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (narState === 'playing') pauseNarration();
      else if (narState === 'paused') resumeNarration();
      else if (narState === 'ended') replayLast();
      else if (lastAnswer) replayLast(); // TTS 失败/已停止但有最近回答 → 点击重听
    });
    ov.querySelector('.ai-closest-close').addEventListener('click', closeClosestOverlay);
    var onKey = function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeClosestOverlay();
        document.removeEventListener('keydown', onKey, true);
      }
    };
    document.addEventListener('keydown', onKey, true);
    syncNarBtn(); // 血缘关系图弹层打开时按当前口播状态显示暂停/继续/重听按钮
    scrollBottom(true);
  }
  function closeClosestOverlay() {
    if (closestOverlay) { try { closestOverlay.parentNode.removeChild(closestOverlay); } catch (e) {} closestOverlay = null; }
  }

  /* ---------------- v15 看门狗与诊断（防「窗口莫名消失、只剩声音」复发） ---------------- */
  function diagLog(ev, detail) {
    try {
      var arr = JSON.parse(localStorage.getItem('ai_diag') || '[]');
      if (!Array.isArray(arr)) arr = [];
      arr.push({ ev: ev, d: detail || '', t: Date.now(), v: APP_VERSION });
      arr = arr.slice(-30);
      localStorage.setItem('ai_diag', JSON.stringify(arr));
    } catch (e) {}
  }
  function recentDiag(maxMs) {
    try {
      var arr = JSON.parse(localStorage.getItem('ai_diag') || '[]');
      if (!Array.isArray(arr)) return [];
      var now = Date.now();
      var ms = maxMs || 3600000;
      return arr.filter(function (e) { return now - e.t < ms; });
    } catch (e) { return []; }
  }

  var watchT = null;
  // 每 600ms 检查一次：面板处于打开状态(isOpen=true)却不可见（hidden / 移出视口 / 被更高层覆盖）
  // → 自愈（恢复显示）+ 记录诊断原因。保证「窗口莫名消失」不会再持续，且下次打开能看到原因。
  function watchPanel() {
    clearTimeout(watchT);
    watchT = setTimeout(function () {
      try {
        if (!isOpen || !panel) { watchPanel(); return; }
        // 情形 A：isOpen=true 但面板被直接置 hidden（没走 closePanel → 不会停语音）
        if (panel.hidden) {
          diagLog('hidden-while-open', '');
          isOpen = false;
          openPanel(); // 自愈：重新打开
          watchPanel();
          return;
        }
        var rect = panel.getBoundingClientRect();
        var inView = rect.width > 0 && rect.height > 0 &&
          rect.right > 0 && rect.bottom > 0 &&
          rect.left < window.innerWidth && rect.top < window.innerHeight;
        if (!inView) {
          // 情形 B：面板被移出可视区（异常定位/旧拖拽遗留）→ 复位右下角
          diagLog('offscreen', JSON.stringify({ l: Math.round(rect.left), t: Math.round(rect.top), w: Math.round(rect.width), h: Math.round(rect.height) }));
          panel.style.left = ''; panel.style.top = ''; panel.style.right = '24px'; panel.style.bottom = '0';
          panelPos = null;
          try { localStorage.removeItem(LS_PANEL_POS); } catch (e) {}
          watchPanel();
          return;
        }
        // 情形 C：面板区域被更高层级元素覆盖 → 提升层级
        // 世系树遮罩 / 血缘最亲遮罩打开时合法覆盖面板，不算异常，跳过。
        // 注意：z-index 来自 CSS 类不是内联 style，故用 isConnected 判断遮罩是否存活（close*Overlay 会置空）。
        if (treeOverlay && treeOverlay.isConnected) { watchPanel(); return; }
        if (closestOverlay && closestOverlay.isConnected) { watchPanel(); return; }
        var el = document.elementFromPoint(rect.left + Math.min(rect.width / 2, 160), rect.top + Math.min(rect.height / 2, 40));
        if (el && !panel.contains(el)) {
          var cs = (el.tagName || '') + (el.id ? '#' + el.id : '') + '.' + String(el.className || '').slice(0, 40) + ' z=' + (getComputedStyle(el).zIndex || '');
          diagLog('covered-by', cs);
          panel.style.zIndex = '2147483001';
          fab.style.zIndex = '2147483000';
        }
      } catch (e) {}
      watchPanel();
    }, 600);
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
      if (isOpen && !panel.hidden) {
        // 面板可见：朗读中点击悬浮球 → 只停语音不关面板（用户本意通常是静音/暂停，而不是关闭窗口）
        if (audioEl && !audioEl.paused && !audioEl.ended) { stopSpeak(); return; }
        closePanel(false, 'fab');
      } else {
        // 面板隐藏/未开（含 isOpen 状态残留）→ 强制打开
        openPanel();
      }
    });

    $('#ai-close', panel).addEventListener('click', function () { closePanel(false, 'close-btn'); });
    if (maxBtn) maxBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleMaximize(); });
    if (soundBtn) soundBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleTts(); });
    if (stopBtn) stopBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (narState === 'playing') pauseNarration();
      else if (narState === 'paused') resumeNarration();
      else if (narState === 'ended') replayLast();
      else if (lastAnswer) replayLast(); // TTS 失败/已停止但有最近回答 → 点击重听
      else stopSpeak();
    });

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

    // 页面刷新/跳转导致面板随页面销毁 → 记录来源，下次打开面板时提示「页面导航」（诊断页面级消失）
    window.addEventListener('pagehide', function () {
      if (isOpen) {
        try { localStorage.setItem(LS_CLOSURE, JSON.stringify({ s: 'page-nav', t: Date.now() })); } catch (e) {}
      }
    });

    // 返回键 / Esc
    // popstate：仅手机端返回键用于关闭面板；桌面端直接忽略（浏览器后退手势/鼠标侧键/页面返回按钮不会再误关窗口）
    window.addEventListener('popstate', function () {
      if (!isOpen) return;
      if (!isMb()) return;
      if (audioEl && !audioEl.paused && !audioEl.ended) { stopSpeak(); return; }
      closePanel(true, 'popstate-mb');
    });
    document.addEventListener('keydown', function (e) {
      // 世系树遮罩打开时，Esc 只关遮罩，不关面板（遮罩用捕获阶段先拦截）
      if (e.key === 'Escape' && treeOverlay) return;
      if (e.key === 'Escape' && isOpen) {
        // 正在朗读语音时按 Esc：先停语音，不关面板（避免用户想关声音却把窗口关了）
        if (audioEl && !audioEl.paused && !audioEl.ended) { stopSpeak(); return; }
        closePanel(false, 'esc');
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
    watchPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
