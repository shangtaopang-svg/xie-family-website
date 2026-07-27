import re

with open('pages/xie-collection.html', 'r', encoding='utf-8') as f:
    content = f.read()

old = """return '<div class="collect-card local-video" style="text-decoration:none;cursor:default"><div class="card-hover-wrap"><div class="card-cover" style="background:#1a1410;display:flex;align-items:center;justify-content:center;overflow:hidden"><video src="' + url + '" style="width:100%;height:100%;object-fit:cover" controls preload="metadata"></video></div></div><div class="info"><div class="title">' + (item.title||'') + '</div><div class="meta"><span class="tag video">"""

new = """return '<div class="collect-card local-video" style="text-decoration:none;cursor:pointer" onclick="var v=this.querySelector(\'video\');if(v.paused||v.ended){v.play();v.controls=true;this.style.cursor=\'default\'}else if(v.controls){window.open(v.src)}"><div class="card-hover-wrap"><div class="card-cover" style="background:#1a1410;display:flex;align-items:center;justify-content:center;overflow:hidden"><video src="' + url + '" style="width:100%;height:100%;object-fit:cover" preload="metadata" muted playsinline></video><div class="play-overlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center"><span class="play-circle" style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,0.92);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 16px rgba(0,0,0,0.15)">▶</span></div></div></div><div class="info"><div class="title">' + (item.title||'') + '</div><div class="meta"><span class="tag video">"""

if old in content:
    content = content.replace(old, new)
    with open('pages/xie-collection.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated successfully')
else:
    print('Pattern not found')
    # Show context around the pattern
    idx = content.find('collect-card local-video')
    if idx >= 0:
        print('Found around:', repr(content[idx:idx+200]))
