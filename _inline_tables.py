# -*- coding: utf-8 -*-
# Fetch admin page, extract tables, embed in history page
import re

# Read admin page from server
import urllib.request
resp = urllib.request.urlopen('http://8.160.117.120/pages/admin.html')
admin = resp.read().decode('utf-8')

# Find all tables
tables = []
pos = 0
for i in range(20):
    ts = admin.find('<table', pos)
    if ts < 0: break
    te = admin.find('</table>', ts) + 8
    # Get 50 chars before table for context
    ctx = admin[max(0,ts-50):ts]
    header_text = ''
    # Find header text from thead
    th_match = re.search(r'<th[^>]*>([^<]+)', admin[ts:te])
    if th_match: header_text = th_match.group(1)
    tables.append({
        'html': admin[ts:te],
        'header': header_text,
        'context': ctx[-40:].strip()
    })
    pos = te

print(f'Found {len(tables)} tables')
for t in tables:
    print(f'  header="{t["header"]}" ctx="{t["context"][:30]}" len={len(t["html"])}')

# Find the right tables
# Table 0: 远古世系 (header starts with 世)
# Table 1: 申伯世系 (header: 炎帝世)
# Table 2: 始宁东山世系 (header: 炎帝世)
# Table 3: admin table (header: 姓名)

# We need tables 1 and 2 (shenbo and dongshan)
shenbo_table = tables[1]['html']
dongshan_table = tables[2]['html']

print(f'\nShenbo table: {len(shenbo_table)} bytes')
print(f'Dongshan table: {len(dongshan_table)} bytes')

# Read history.html
with open('pages/history.html', 'r', encoding='utf-8') as f:
    history = f.read()

# Replace the JS-rendered tree content with static tables
# 1. Replace renderShenboTree to use static table
# 2. Replace renderDongshanTree to use static table

shenbo_static_html = shenbo_table.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('\r', '')
dongshan_static_html = dongshan_table.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('\r', '')

# Build new function bodies
shenbo_new = """ {
        if (!DATA) { document.getElementById('tree-shenbo').innerHTML = '<div style="padding:20px;color:var(--text-tertiary);">暂无数据</div>'; return; }
        var html = '""" + shenbo_static_html + """';
        document.getElementById('tree-shenbo').innerHTML = html;
      }"""

dongshan_new = """ {
        if (!DATA) { document.getElementById('tree-dongshan').innerHTML = '<div style="padding:20px;color:var(--text-tertiary);">暂无数据</div>'; return; }
        var html = '""" + dongshan_static_html + """';
        document.getElementById('tree-dongshan').innerHTML = html;
      }"""

# Apply replacements
s2_fn = 'function renderShenboTree()'
d2_fn = 'function renderDongshanTree()'
rc_fn = 'function renderChain('

assert s2_fn in history, "s2 not found"
assert d2_fn in history, "d2 not found"

# Find and replace shenbo body
s2_pos = history.index(s2_fn)
s2_br = history.index('{', s2_pos)
d2_pos = history.index(d2_fn)
s2_close = s2_br + history[s2_br:d2_pos].rindex('\\n      }') + 8
history = history[:s2_br] + shenbo_new + history[s2_close:]

# Find and replace dongshan body
d2_pos = history.index(d2_fn)
rc_pos = history.index(rc_fn)
d2_br = history.index('{', d2_pos)
d2_close = d2_br + history[d2_br:rc_pos].rindex('\\n      }') + 8
history = history[:d2_br] + dongshan_new + history[d2_close:]

# Also keep the renderChainTable function but it's no longer needed for the main trees
# (it's still used by the shenbo and dongshan functions via the inline HTML)

# Verify
assert history.count('<!DOCTYPE html>') == 1, "DOCTYPE corrupted!"
assert history.count('</html>') == 1, "/html missing!"
print('\\nVerification:')
print(f'  DOCTYPE: 1 (OK)')
print(f'  /html: 1 (OK)')
print(f'  renderShenboTree: {"function renderShenboTree" in history}')
print(f'  renderDongshanTree: {"function renderDongshanTree" in history}')
print(f'  renderChain: {"function renderChain" in history}')
print(f'  Shenbo table embedded: {shenbo_table[:50] in history}')
print(f'  Dongshan table embedded: {dongshan_table[:50] in history}')
print(f'  Size: {len(history)}')

with open('pages/history.html', 'w', encoding='utf-8') as f:
    f.write(history)
print('Written!')
