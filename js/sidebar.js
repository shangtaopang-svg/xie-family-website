// ── 左侧导航栏 (全自动注入: CSS + HTML + JS) ──
(function() {
  if (document.querySelector('.sidebar')) return;

  // 1. 注入 CSS
  var css = '.sidebar{position:fixed;left:0;top:0;width:220px;height:100vh;z-index:100;background:rgb(25,38,60);display:none;flex-direction:column;align-items:center;justify-content:space-between;padding:36px 0;box-shadow:rgba(0,0,0,0.24) 0px 3px 8px 0px;overflow-y:auto}' +
    '.sidebar .s-logo{text-align:center;padding:0;margin-bottom:16px}' +
    '.sidebar .s-logo .s-seal{width:100px;height:100px;margin:0 auto;background:#a83030;border-radius:8px;display:grid;place-items:center;font-size:44px;font-weight:900;color:#f5e6c8;position:relative}' +
    '.sidebar .s-logo .s-seal::after{content:\"\";position:absolute;inset:6px;border:1px solid rgba(245,230,200,0.1);border-radius:6px}' +
    '.sidebar .s-logo .s-name{font-size:16px;color:#f5e6c8;letter-spacing:0.08em;margin-top:16px;font-weight:600}' +
    '.sidebar .s-logo .s-sub{font-size:11px;color:rgba(245,230,200,0.15);letter-spacing:0.06em;margin-top:2px}' +
    '.sidebar .s-nav{width:100%;padding:0;flex:1;overflow-y:auto;border-top:1px solid rgb(71,85,105);border-bottom:1px solid rgb(71,85,105)}' +
    '.sidebar .s-nav a{display:block;padding:15px 24px;color:#fff;font-size:14px;letter-spacing:0.04em;text-decoration:none;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);border-bottom:1px solid rgb(71,85,105);line-height:20px}' +
    '.sidebar .s-nav a:last-of-type{border-bottom:none}' +
    '.sidebar .s-nav a:hover{color:#04BF00;letter-spacing:0.12em}' +
    '.sidebar .s-nav a.active{color:#04BF00;letter-spacing:0.08em}' +
    '.sidebar .s-bottom{text-align:center;padding:16px 0 0;width:100%}' +
    '.sidebar .s-bottom .s-toggle{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;cursor:pointer;user-select:none}' +
    '.sidebar .s-bottom .s-toggle .track{width:44px;height:22px;border-radius:11px;background:rgb(50,65,90);position:relative;transition:background 0.3s;flex:none}' +
    '.sidebar .s-bottom .s-toggle .track.active{background:#04BF00}' +
    '.sidebar .s-bottom .s-toggle .track .thumb{width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:all 0.3s;box-shadow:0 1px 4px rgba(0,0,0,0.2)}' +
    '.sidebar .s-bottom .s-toggle .track.active .thumb{left:24px}' +
    '.sidebar .s-bottom .s-toggle .s-icon{font-size:13px;color:rgba(245,230,200,0.15);transition:color 0.3s;line-height:1}' +
    '.sidebar .s-bottom .s-toggle .s-icon.active{color:rgba(245,230,200,0.5)}' +
    '.sidebar .s-bottom a{display:block;padding:10px 0;color:rgba(245,230,200,0.2);font-size:12px;letter-spacing:0.06em;text-decoration:none;transition:all 0.3s}' +
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
      '<div class="s-toggle" id="themeToggle">' +
        '<span class="s-icon" id="themeIcon">☀️</span>' +
        '<div class="track" id="themeTrack"><div class="thumb"></div></div>' +
        '<span class="s-icon" id="themeIcon2">🌙</span>' +
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
  var isDark = localStorage.getItem('theme') !== 'light';

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
