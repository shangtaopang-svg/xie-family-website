"""将首页的侧栏 CSS + HTML 精确复制到所有页面"""
import os, re

# 1. 从 index.html 提取侧栏 CSS 块
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# 提取 CSS (从 .sidebar{ 到最后一个 @media 规则)
m = re.search(r'    \.sidebar\{.*?@media\(min-width:901px\)\{\.site-header\{display:none !important\}\}', idx, re.DOTALL)
sidebar_css = m.group() if m else ''
print(f'Sidebar CSS: {len(sidebar_css)} chars')

# 2. 构建要注入的完整 CSS + HTML
# 每个页面已有的 <style> 里已经有原始的页面样式，我们追加侧栏 CSS
# 侧栏 HTML 插在 <body> 后面

# 侧栏 HTML
sidebar_html = '''<aside class="sidebar">
  <div class="s-logo">
    <div class="s-seal">谢</div>
    <div class="s-name">下枫槎谢氏</div>
    <div class="s-sub">宁海 · 下枫槎村</div>
  </div>
  <nav class="s-nav">
    <a href="../index.html">🏠 首页</a>
    <a href="history.html">📜 家族历史</a>
    <a href="genealogy.html">🌳 族谱查询</a>
    <a href="celebrities.html">🏆 名人事迹</a>
    <a href="merit-scroll.html">📜 功德卷轴</a>
    <a href="news.html">📰 消息发布</a>
    <a href="members.html">👥 家族成员</a>
    <a href="activities.html">🎪 家族活动</a>
    <a href="today.html">📸 今日下枫槎</a>
    <a href="reports.html">📋 新闻报道</a>
    <a href="audio.html">🎧 听下枫槎</a>
    <a href="vinyl-player.html">🎵 枫槎留声机</a>
    <a href="xie-collection.html">📚 谢氏集萃</a>
    <a href="contact.html">✉️ 联系我们</a>
    <a href="admin.html">🔐 管理后台</a>
  </nav>
  <div class="s-bottom">
    <div class="s-toggle" id="themeToggle">
      <span class="s-icon" id="themeIcon">☀️</span>
      <div class="track" id="themeTrack"><div class="thumb"></div></div>
      <span class="s-icon" id="themeIcon2">🌙</span>
    </div>
    <a href="../index.html">✦ 返回首页</a>
  </div>
</aside>'''

# 主题切换 JS
toggle_js = '''<script>
(function(){var t=document.getElementById('themeToggle'),k=document.getElementById('themeTrack'),i1=document.getElementById('themeIcon'),i2=document.getElementById('themeIcon2');var d=localStorage.getItem('theme')!=='light';function a(){document.documentElement.setAttribute('data-theme',d?'dark':'light');if(k)k.classList.toggle('active',d);if(i1)i1.classList.toggle('active',!d);if(i2)i2.classList.toggle('active',d);localStorage.setItem('theme',d?'dark':'light');}if(t)t.addEventListener('click',function(){d=!d;a();});a();})();
</script>'''

# 3. 处理所有页面
pages_dir = 'pages'
for fname in sorted(os.listdir(pages_dir)):
    if not fname.endswith('.html'): continue
    fpath = os.path.join(pages_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f: content = f.read()

    # 跳过已处理的
    if 'class="sidebar"' in content:
        print(f'SKIP (already has sidebar): {fname}')
        continue

    # 注入 CSS: 在 </style> 前插入侧栏 CSS
    style_end = content.rfind('</style>')
    if style_end == -1:
        print(f'SKIP (no style): {fname}')
        continue
    content = content[:style_end] + '\n' + sidebar_css + '\n' + content[style_end:]

    # 注入 HTML: 在 <body> 标签后插入侧栏
    m = re.search(r'<body[^>]*>', content)
    if not m:
        print(f'SKIP (no body): {fname}')
        continue
    content = content[:m.end()] + '\n' + sidebar_html + content[m.end():]

    # 注入 Toggle JS: 在 </body> 前
    content = content.replace('</body>', toggle_js + '\n</body>')

    # 标记 active 类
    current = fname.replace('.html', '')
    content = content.replace('href="' + current + '.html"', 'href="' + current + '.html" class="active"')

    # 给内容添加 margin-left
    content = content.replace('class="content"', 'class="content" style="margin-left:0"')

    with open(fpath, 'w', encoding='utf-8') as f: f.write(content)
    print(f'OK: {fname}')

print('Done!')
