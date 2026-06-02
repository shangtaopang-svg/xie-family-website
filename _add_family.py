#!/usr/bin/env python3
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('pages/genealogy.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Find the ancestor button line and insert family chart call before it
idx = c.find('showAncestors(\' + person.id + \');')
if idx > 0:
    # Find the beginning of this html += line
    line_start = c.rfind('\n', 0, idx)
    line_end = c.find('\n', idx)
    old_line = c[line_start:line_end]

    # Insert family chart call before this line
    insert = '\n    html += buildFamilyChart(person, data);\n'
    c = c[:line_start] + insert + c[line_start:]
    print('Family chart call added')
else:
    print('Pattern not found')

with open('pages/genealogy.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
