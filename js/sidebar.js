// ── 左侧导航栏 (全自动注入: CSS + HTML + JS) ──
(function() {
  if (document.querySelector('.sidebar')) return;

  // 1. 注入 CSS
  var css = '.sidebar{--sb-bg:rgba(245,240,235,0.9);--sb-thumb:#2b2b2b;--sb-name:#2a2a2a;--sb-sub:rgba(0,0,0,0.45);--sb-border:rgba(0,0,0,0.10);--sb-link:#1c1c1c;--sb-track:rgba(0,0,0,0.18);--sb-icon:rgba(0,0,0,0.55);--sb-icon-act:rgba(0,0,0,0.8);--sb-btn-bd:rgba(0,0,0,0.15);--sb-btn-bg:rgba(0,0,0,0.04);--sb-bottom:rgba(0,0,0,0.5);--sb-sep:rgba(0,0,0,0.12);position:fixed;left:0;top:0;width:220px;height:100vh;z-index:100;background:var(--sb-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);display:none;flex-direction:column;align-items:center;justify-content:space-between;padding:36px 0;box-shadow:rgba(0,0,0,0.24) 0px 3px 8px 0px;overflow-y:auto}' +
    '[data-theme="dark"] .sidebar{--sb-bg:rgb(25,38,60);--sb-thumb:#fff;--sb-name:#f5e6c8;--sb-sub:rgba(245,230,200,0.15);--sb-border:rgb(71,85,105);--sb-link:#fff;--sb-track:rgb(50,65,90);--sb-icon:rgba(245,230,200,0.15);--sb-icon-act:rgba(245,230,200,0.5);--sb-btn-bd:rgba(255,255,255,0.1);--sb-btn-bg:rgba(255,255,255,0.04);--sb-bottom:rgba(245,230,200,0.2);--sb-sep:rgb(71,85,105)}' +
    '.sidebar .s-logo{text-align:center;padding:0;margin-bottom:16px}' +
    '.sidebar .s-logo .s-seal{width:100px;height:100px;margin:0 auto;background:#a83030;border-radius:8px;display:grid;place-items:center;font-size:44px;font-weight:900;color:#f5e6c8;position:relative}' +
    '.sidebar .s-logo .s-seal::after{content:\"\";position:absolute;inset:6px;border:1px solid rgba(245,230,200,0.1);border-radius:6px}' +
    '.sidebar .s-logo .s-name{font-size:16px;color:var(--sb-name);letter-spacing:0.08em;margin-top:16px;font-weight:600}' +
    '.sidebar .s-logo .s-sub{font-size:11px;color:var(--sb-sub);letter-spacing:0.06em;margin-top:2px}' +
    '.sidebar .s-nav{width:100%;padding:0;flex:1;overflow-y:auto;border-top:1px solid var(--sb-border);border-bottom:1px solid var(--sb-border)}' +
    '.sidebar .s-nav a{display:block;padding:15px 24px;color:var(--sb-link);font-size:14px;letter-spacing:0.04em;text-decoration:none;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);border-bottom:1px solid var(--sb-border);line-height:20px}' +
    '.sidebar .s-nav a:last-of-type{border-bottom:none}' +
    '.sidebar .s-nav a:hover{color:#04BF00;letter-spacing:0.12em}' +
    '.sidebar .s-nav a.active{color:#04BF00;letter-spacing:0.08em}' +
    '.sidebar .s-bottom{text-align:center;padding:16px 0 0;width:100%}' +
    '.sidebar .s-toggle{display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;user-select:none}' +
    '.sidebar .s-toggle .track{width:44px;height:22px;border-radius:11px;background:var(--sb-track);position:relative;transition:background 0.3s;flex:none}' +
    '.sidebar .s-toggle .track.active{background:#04BF00}' +
    '.sidebar .s-toggle .track .thumb{width:18px;height:18px;border-radius:50%;background:var(--sb-thumb);position:absolute;top:2px;left:2px;transition:all 0.3s;box-shadow:0 1px 4px rgba(0,0,0,0.2)}' +
    '.sidebar .s-toggle .track.active .thumb{left:24px}' +
    '.sidebar .s-toggle .s-icon{font-size:13px;color:var(--sb-icon);transition:color 0.3s;line-height:1}' +
    '.sidebar .s-toggle .s-icon.active{color:var(--sb-icon-act)}' +
    '.sidebar .s-topbar{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:0 10px 16px;border-bottom:1px solid var(--sb-border)}' +
    '.sidebar .s-topbar a{font-size:11px;color:var(--sb-bottom);text-decoration:none;padding:4px 10px;border-radius:12px;border:1px solid var(--sb-btn-bd);white-space:nowrap;transition:all 0.3s}' +
    '.sidebar .s-topbar a:hover{color:#04BF00;border-color:rgba(4,191,0,0.3)}' +
    '.sidebar .s-controls{display:flex;align-items:center;justify-content:center;gap:3px;padding:6px 4px;flex-wrap:wrap;border-top:1px solid var(--sb-border);width:100%}' +
    '.sidebar .s-controls button{width:26px;height:26px;border-radius:50%;border:1px solid var(--sb-btn-bd);background:var(--sb-btn-bg);cursor:pointer;font-size:11px;display:inline-flex;align-items:center;justify-content:center;color:var(--sb-icon);transition:all 0.2s;padding:0;line-height:1}' +
    '.sidebar .s-controls button:hover{color:#04BF00;border-color:rgba(4,191,0,0.3)}' +
    '.sidebar .s-controls button.active{color:#04BF00;background:rgba(4,191,0,0.1)}' +
    '.sidebar .s-controls .sep{width:1px;height:14px;background:var(--sb-sep);flex:none}' +
    '.sidebar .s-bottom a{display:block;padding:10px 0;color:var(--sb-bottom);font-size:12px;letter-spacing:0.06em;text-decoration:none;transition:all 0.3s}' +
    '.sidebar .s-bottom a:hover{color:#04BF00;letter-spacing:0.1em}' +
    '@media(min-width:901px){.sidebar{display:flex !important}}' +
    '@media(min-width:901px){body{margin-left:220px}}' +
    '@media(min-width:901px){.site-header{display:none !important}}' +
    '@media(max-width:900px){body{margin-left:0}}' +
    '@media(max-width:900px){.sidebar{display:none !important}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // 2. 获取正确路径
  var inPages = window.location.pathname.indexOf('/pages/') > -1;
  function p(name) { return (inPages ? '' : 'pages/') + name + '.html'; }
  function root() { return inPages ? '../' : ''; }

  // 3. 注入 HTML
  var sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.innerHTML =
    '<div class="s-logo">' +
      '<div class="s-seal">谢</div>' +
      '<div class="s-name">下枫槎谢氏</div>' +
      '<div class="s-sub">宁海 · 下枫槎村</div>' +
    '</div>' +
    '<div class="s-topbar">' +
      '<div class="s-toggle" id="themeToggle">' +
        '<span class="s-icon" id="themeIcon">☀️</span>' +
        '<div class="track" id="themeTrack"><div class="thumb"></div></div>' +
        '<span class="s-icon" id="themeIcon2">🌙</span>' +
      '</div>' +
      '<a href="' + root() + 'entrance.html">⛩ 返回石门</a>' +
    '</div>' +
    '<nav class="s-nav">' +
      '<a href="' + root() + 'index.html">🏠 首页</a>' +
      '<a href="' + p('history') + '">📜 家族历史</a>' +
      '<a href="' + p('genealogy') + '">🌳 族谱查询</a>' +
      '<a href="' + p('celebrities') + '">🏆 名人事迹</a>' +
      '<a href="' + p('merit-scroll') + '">📜 功德卷轴</a>' +
      '<a href="' + p('news') + '">📰 消息发布</a>' +
      '<a href="' + p('members') + '">👥 家族成员</a>' +
      '<a href="' + p('activities') + '">🎪 家族活动</a>' +
      '<a href="' + p('today') + '">📸 今日下枫槎</a>' +
      '<a href="' + p('reports') + '">📋 新闻报道</a>' +
      '<a href="' + p('audio') + '">🎧 听下枫槎</a>' +
      '<a href="' + p('vinyl-player') + '">🎵 枫槎留声机</a>' +
      '<a href="' + p('xie-collection') + '">📚 谢氏集萃</a>' +
      '<a href="' + p('contact') + '">✉️ 联系我们</a>' +
      '<a href="' + p('admin') + '">🔐 管理后台</a>' +
    '</nav>' +
    '<div class="s-bottom">' +
      '<div class="s-controls">' +
        '<button id="musicPrevBtn" onclick="(window.prevTrack?prevTrack():toggleMusic())" title="上一首">⏮</button>' +
        '<button id="musicSideBtn" onclick="toggleMusic()" title="播放/暂停">🔈</button>' +
        '<button id="musicNextBtn" onclick="(window.nextTrack?nextTrack():toggleMusic())" title="下一首">⏭</button>' +
        '<span class="sep"></span>' +
        '<button onclick="window.changeVolume&&changeVolume(-0.2)" title="音量-">🔉</button>' +
        '<button onclick="window.changeVolume&&changeVolume(0.2)" title="音量+">🔊</button>' +
        '<span class="sep"></span>' +
        '<button onclick="window.toggleLanguage&&toggleLanguage()" title="English/中文">EN</button>' +
      '</div>' +
      '<a href="' + root() + 'index.html">✦ 返回首页</a>' +
    '</div>';

  document.body.insertBefore(sidebar, document.body.firstChild);

  // 4. 标记当前页面 active
  var current = window.location.pathname.split('/').pop().replace('.html', '');
  var links = sidebar.querySelectorAll('.s-nav a');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('href').indexOf(current) > -1 && current) {
      links[i].className = 'active';
    }
  }

  // 5. 日夜切换
  var toggle = document.getElementById('themeToggle');
  var track = document.getElementById('themeTrack');
  var icon1 = document.getElementById('themeIcon');
  var icon2 = document.getElementById('themeIcon2');
  // v3 一次性迁移：清掉旧 bug 卡死的深色。v2 只清了 theme，漏了 xie_theme——
  // main.js 靠 xie_theme 设 data-theme=dark，会让带「返回石门」的 .site-header 变深色。
  // 这里把两个 key 都恢复为浅色一次，之后主题完全由用户开关决定，不再自动覆盖。
  if (localStorage.getItem('theme_fix_v3') !== '1') {
    localStorage.setItem('theme_fix_v3', '1');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('xie_theme', 'light');
  }
  var isDark = localStorage.getItem('theme') === 'dark';

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (track) track.classList.toggle('active', isDark);
    if (icon1) icon1.classList.toggle('active', !isDark);
    if (icon2) icon2.classList.toggle('active', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  if (toggle) toggle.addEventListener('click', function() { isDark = !isDark; applyTheme(); });
  applyTheme();
})();

// 背景音乐切换（优先走 main.js 播放器，保持播放列表/进度状态一致）
window.toggleMusic = function() {
  var audio = document.getElementById('bg-music');
  var wasPaused = audio ? audio.paused : true;
  if (typeof window.toggleBgMusic === 'function') {
    window.toggleBgMusic(); // main.js 播放器（含列表/进度/按钮状态）
  } else if (audio) {
    if (!audio.src || audio.src === window.location.href || audio.src === '') {
      audio.src = (window.location.pathname.indexOf('/pages/') > -1 ? '../' : '') + 'music/background.mp3';
      audio.loop = true;
    }
    if (wasPaused) { audio.play().catch(function(){}); } else { audio.pause(); }
  }
  var btn = document.getElementById('musicSideBtn');
  if (btn) { btn.textContent = wasPaused ? '🔊' : '🔈'; btn.style.color = wasPaused ? '#04BF00' : ''; }
};
