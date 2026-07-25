import os, re

pages_dir = "D:/我的项目（网站）/宁海下枫槎村网站/pages"

sidebar_css = """    .sidebar{position:fixed;left:0;top:0;width:220px;height:100vh;z-index:100;background:rgb(25,38,60) !important;display:none;flex-direction:column;align-items:center;justify-content:space-between;padding:36px 0;box-shadow:rgba(0,0,0,0.24) 0px 3px 8px 0px;overflow-y:auto}
    .sidebar .s-logo{text-align:center;padding:0;margin-bottom:16px}
    .sidebar .s-logo .s-seal{width:100px;height:100px;margin:0 auto;background:#a83030;border-radius:8px;display:grid;place-items:center;font-family:'Noto Serif SC',serif;font-size:44px;font-weight:900;color:#f5e6c8;position:relative}
    .sidebar .s-logo .s-seal::after{content:'';position:absolute;inset:6px;border:1px solid rgba(245,230,200,0.1);border-radius:6px}
    .sidebar .s-logo .s-name{font-family:'Noto Serif SC',serif;font-size:16px;color:#f5e6c8;letter-spacing:0.08em;margin-top:16px;font-weight:600}
    .sidebar .s-logo .s-sub{font-size:11px;color:rgba(245,230,200,0.15);letter-spacing:0.06em;margin-top:2px}
    .sidebar .s-nav{width:100%;padding:0;flex:1;overflow-y:auto;border-top:1px solid rgb(71,85,105);border-bottom:1px solid rgb(71,85,105)}
    .sidebar .s-nav a{display:block;padding:15px 24px;color:#fff;font-size:14px;letter-spacing:0.04em;text-decoration:none;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);border-bottom:1px solid rgb(71,85,105);line-height:20px}
    .sidebar .s-nav a:last-of-type{border-bottom:none}
    .sidebar .s-nav a:hover{color:#04BF00;letter-spacing:0.12em}
    .sidebar .s-nav a.active{color:#04BF00;letter-spacing:0.08em}
    .sidebar .s-bottom{text-align:center;padding:20px 24px 0;width:100%}
    .sidebar .s-bottom a{display:block;padding:12px 0;color:rgba(245,230,200,0.2);font-size:12px;letter-spacing:0.06em;text-decoration:none;transition:all 0.3s;border-top:1px solid rgb(71,85,105)}
    .sidebar .s-bottom a:hover{color:#04BF00;letter-spacing:0.1em}
    @media(min-width:901px){.sidebar{display:flex !important}}
    .page-content{margin-left:0}@media(min-width:901px){.page-content{margin-left:220px !important}}
    @media(min-width:901px){.site-header{display:none !important}}
"""

sidebar_html = """<aside class="sidebar">
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
    <a href="../index.html">✦ 返回首页</a>
  </div>
</aside>"""

# Map filename to link href (for active class)
active_map = {
    'history.html': 'history',
    'genealogy.html': 'genealogy',
    'celebrities.html': 'celebrities',
    'merit-scroll.html': 'merit-scroll',
    'news.html': 'news',
    'members.html': 'members',
    'activities.html': 'activities',
    'today.html': 'today',
    'reports.html': 'reports',
    'audio.html': 'audio',
    'vinyl-player.html': 'vinyl-player',
    'xie-collection.html': 'xie-collection',
    'contact.html': 'contact',
    'admin.html': 'admin',
}

for fname in sorted(os.listdir(pages_dir)):
    if not fname.endswith('.html'):
        continue
    fpath = os.path.join(pages_dir, fname)

    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if sidebar already exists
    if 'class="sidebar"' in content:
        print(f"SKIP (has sidebar): {fname}")
        continue

    # Skip if no site-header
    if 'site-header' not in content:
        print(f"SKIP (no header): {fname}")
        continue

    # 1. Add sidebar CSS before </style>
    # Find the last </style> tag
    style_end = content.rfind('</style>')
    if style_end == -1:
        print(f"SKIP (no style): {fname}")
        continue

    content = content[:style_end] + '\n' + sidebar_css + content[style_end:]

    # 2. Add sidebar HTML after <body>
    body_match = re.search(r'<body[^>]*>', content)
    if not body_match:
        print(f"SKIP (no body): {fname}")
        continue

    # Insert sidebar after body tag
    body_end = body_match.end()
    content = content[:body_end] + '\n' + sidebar_html + content[body_end:]

    # 3. Set active class based on filename
    key = active_map.get(fname, '')
    if key:
        # Add class="active" to the matching link
        old = f'href="{key}.html"'
        new = f'href="{key}.html" class="active"'
        content = content.replace(old, new)

    # 4. Wrap main content with page-content div for margin
    # Find the main content wrapper - look for class="content" or main section
    # Many pages use .content class already, add page-content class
    content = content.replace('class="content"', 'class="content page-content"')

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"UPDATED: {fname}")

print("\nDone!")
