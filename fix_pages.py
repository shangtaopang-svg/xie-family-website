import os, re, subprocess

SCSS = """    .sidebar{position:fixed;left:0;top:0;width:180px;height:100vh;z-index:100;background:rgb(7,16,31) !important;display:none;flex-direction:column;align-items:center;justify-content:space-between;padding:28px 0;box-shadow:rgba(0,0,0,0.24) 0px 3px 8px 0px;overflow-y:auto}
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
    .sidebar .s-bottom{text-align:center;padding:16px 0 0;width:100%}
    .sidebar .s-bottom .s-toggle{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;cursor:pointer;user-select:none}
    .sidebar .s-bottom .s-toggle .track{width:44px;height:22px;border-radius:11px;background:rgb(50,65,90);position:relative;transition:background 0.3s;flex:none}
    .sidebar .s-bottom .s-toggle .track.active{background:#04BF00}
    .sidebar .s-bottom .s-toggle .track .thumb{width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:all 0.3s;box-shadow:0 1px 4px rgba(0,0,0,0.2)}
    .sidebar .s-bottom .s-toggle .track.active .thumb{left:24px}
    .sidebar .s-bottom .s-toggle .s-icon{font-size:13px;color:rgba(245,230,200,0.15);transition:color 0.3s;line-height:1}
    .sidebar .s-bottom .s-toggle .s-icon.active{color:rgba(245,230,200,0.5)}
    .sidebar .s-bottom a{display:block;padding:10px 0;color:rgba(245,230,200,0.2);font-size:12px;letter-spacing:0.06em;text-decoration:none;transition:all 0.3s}
    .sidebar .s-bottom a:hover{color:#04BF00;letter-spacing:0.1em}
    @media(min-width:901px){.sidebar{display:flex !important}}
    .content{margin-left:0}@media(min-width:901px){.content{margin-left:180px !important}}@media(min-width:901px){body{margin-left:180px}}
    @media(min-width:901px){.site-header{display:none !important}}"""

CCSS = """
    .sidebar .s-controls{padding:8px 10px 4px;border-top:1px solid rgb(71,85,105);width:100%}
    .sidebar .s-controls .sc-row{display:flex;align-items:center;justify-content:space-evenly;gap:2px}
    .sidebar .s-controls .sc-btn{width:28px;height:28px;border-radius:50%;border:1px solid rgba(245,230,200,0.04);background:transparent;color:rgba(245,230,200,0.15);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.25s;padding:0;line-height:1}
    .sidebar .s-controls .sc-btn:hover{color:#04BF00;border-color:rgba(4,191,0,0.15);transform:scale(1.1)}
    .sidebar .s-controls .sc-div{width:1px;height:16px;background:rgb(71,85,105)}"""

ALL_CSS = SCSS + CCSS

SHTML = '<aside class="sidebar">\n  <div class="s-logo"><div class="s-seal">\u8c22</div><div class="s-name">\u4e0b\u67ab\u6930\u8c22\u6c0f</div><div class="s-sub">\u5b81\u6d77 \u00b7 \u4e0b\u67ab\u6930\u6751</div></div>\n  <nav class="s-nav">\n    <a href="../index.html">\U0001f3e0 \u9996\u9875</a>\n    <a href="history.html">\U0001f4dc \u5386\u53f2</a>\n    <a href="genealogy.html">\U0001f333 \u65cf\u8c31</a>\n    <a href="celebrities.html">\U0001f3c6 \u540d\u4eba</a>\n    <a href="merit-scroll.html">\U0001f4dc \u529f\u5fb7</a>\n    <a href="news.html">\U0001f4f0 \u6d88\u606f</a>\n    <a href="members.html">\U0001f465 \u6210\u5458</a>\n    <a href="activities.html">\U0001f3aa \u6d3b\u52a8</a>\n    <a href="today.html">\U0001f4f8 \u4eca\u65e5</a>\n    <a href="reports.html">\U0001f4cb \u62a5\u9053</a>\n    <a href="audio.html">\U0001f3a7 \u542c</a>\n    <a href="vinyl-player.html">\U0001f3b5 \u7559\u58f0\u673a</a>\n    <a href="xie-collection.html">\U0001f4da \u96c6\u8403</a>\n    <a href="contact.html">\u2709 \u8054\u7cfb</a>\n    <a href="admin.html">\U0001f510 \u7ba1\u7406</a>\n  </nav>\n  <div class="s-controls"><div class="sc-row">\n      <button class="sc-btn" onclick="changeWeather(\'sun\')">\u2600</button>\n      <button class="sc-btn" onclick="changeWeather(\'rain\')">\U0001f327</button>\n      <button class="sc-btn" onclick="changeWeather(\'snow\')">\u2744</button>\n      <span class="sc-div"></span>\n      <button class="sc-btn" id="musicBtn" onclick="toggleMusic()">\U0001f3b5</button>\n      <button class="sc-btn" onclick="changeVolume(-0.2)">\U0001f509</button>\n      <button class="sc-btn" onclick="changeVolume(0.2)">\U0001f50a</button>\n      <span class="sc-div"></span>\n      <button class="sc-btn" onclick="window.zoomGenealogyTree&&zoomGenealogyTree(0.8)">\U0001f50d-</button>\n      <button class="sc-btn" onclick="window.zoomGenealogyTree&&zoomGenealogyTree(1.2)">\U0001f50d+</button>\n    </div></div>\n  <div class="s-bottom"><div class="s-toggle" id="themeToggle"><span class="s-icon" id="themeIcon">\u2600\ufe0f</span><div class="track" id="themeTrack"><div class="thumb"></div></div><span class="s-icon" id="themeIcon2">\U0001f319</span></div><a href="../index.html">\u2726 \u8fd4\u56de\u9996\u9875</a></div>\n</aside>'

JS = '<script>\nwindow.changeWeather=function(t){var c=document.getElementById("weather-canvas");if(c)c.style.display="block";localStorage.setItem("xie_weather",t);};\nwindow.toggleMusic=function(){var b=document.getElementById("musicBtn"),a=document.getElementById("bg-music");if(!a)return;if(a.paused){a.play().catch(function(){});if(b){b.textContent="\\u23f8";b.style.color="#04BF00";}}else{a.pause();if(b){b.textContent="\\U0001f3b5";b.style.color="";}}};\nwindow.changeVolume=function(d){var a=document.getElementById("bg-music");if(a)a.volume=Math.max(0,Math.min(1,a.volume+d));};\nvar t=document.getElementById("themeToggle"),k=document.getElementById("themeTrack"),i1=document.getElementById("themeIcon"),i2=document.getElementById("themeIcon2");var d=localStorage.getItem("theme")!=="light";function a(){document.documentElement.setAttribute("data-theme",d?"dark":"light");if(k)k.classList.toggle("active",d);if(i1)i1.classList.toggle("active",!d);if(i2)i2.classList.toggle("active",d);localStorage.setItem("theme",d?"dark":"light");}if(t)t.addEventListener("click",function(){d=!d;a();});a();\n</script>'

for fname in ['index.html', 'pages/genealogy.html', 'pages/reports.html']:
    subprocess.run(['git', 'checkout', '663f92a', '--', fname], capture_output=True)
    with open(fname, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('</head>', '<style>\n' + ALL_CSS + '\n</style>\n</head>')
    c = c.replace('<body>', '<body>\n' + SHTML)
    if 'genealogy' in fname:
        c = c.replace('href="genealogy.html"', 'href="genealogy.html" class="active"')
    elif 'reports' in fname:
        c = c.replace('href="reports.html"', 'href="reports.html" class="active"')
    c = c.replace('</body>', JS + '\n</body>')
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(c)
    o = c.count('<style>')
    cl = c.count('</style>')
    print(f'{fname}: {o}/{cl} - {"OK" if o==cl else "BROKEN"}')

print('Done!')
