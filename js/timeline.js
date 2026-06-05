/* 世代时间轴 v3 - HTML/CSS 横向卷轴 */
(function() {
  function estimateYear(genNum) {
    return Math.round(-2800 + genNum * 28.6);
  }

  function renderTimeline() {
    var wrap = document.getElementById('timeline-wrap');
    if (!wrap) return;
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : null;
    if (!data || data.length === 0) { wrap.innerHTML = '<div style="padding:40px;color:var(--text-tertiary);font-size:13px;">暂无数据</div>'; return; }

    // Group by generation
    var genPop = {}, genChars = {}, genNames = {};
    data.forEach(function(p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genPop[g]) { genPop[g] = 0; genNames[g] = []; }
      genPop[g]++;
      if (p.generation && p.generation !== '—') genChars[g] = p.generation;
      genNames[g].push(p.name.replace(/[（(].*[）)]/g,'').substring(0,8));
    });
    var genNums = Object.keys(genPop).map(Number).sort(function(a,b){return a-b});
    var maxPop = 1;
    genNums.forEach(function(g) { if (genPop[g] > maxPop) maxPop = genPop[g]; });

    // Dynasties
    var dynasties = [
      {start:0,end:60,label:'上古',color:'#8B5CF6'},
      {start:61,end:80,label:'周',color:'#F59E0B'},
      {start:81,end:100,label:'秦汉',color:'#3B82F6'},
      {start:101,end:120,label:'魏晋南北朝',color:'#EC4899'},
      {start:121,end:130,label:'隋唐',color:'#10B981'},
      {start:131,end:140,label:'宋',color:'#F97316'},
      {start:141,end:150,label:'元明',color:'#EF4444'},
      {start:151,end:165,label:'清·近代',color:'#6366F1'},
    ];

    // Key ancestors
    var keyAncestors = {};
    data.forEach(function(p) {
      var gn = parseInt(p.generation_num) || 0;
      if (!keyAncestors[gn] && /^(炎帝|申伯|小四|文杲|攒|撰|彬|乾|深甫|云先|临魁|谢安|谢玄)/.test(p.name)) {
        keyAncestors[gn] = p.name.replace(/[（(].*[）)]/g,'').substring(0,6);
      }
    });

    // Estimate max people for bar height scaling
    var maxPopForScale = Math.max(maxPop, 10);

    // Build HTML
    var html = '';
    genNums.forEach(function(g, idx) {
      var pop = genPop[g] || 0;
      var yr = estimateYear(g);
      var yrStr = (yr < 0 ? (-yr) + 'BC' : yr);
      var ch = genChars[g] || '';
      var chStr = (ch && ch !== '—') ? ch : '';
      var names = genNames[g] || [];
      var keyName = keyAncestors[g] || '';

      // Dynasty color
      var dyColor = '';
      for (var d = 0; d < dynasties.length; d++) {
        if (g >= dynasties[d].start && g <= dynasties[d].end) {
          dyColor = dynasties[d].color;
          break;
        }
      }

      // Bar height (proportional to population)
      var barH = Math.max(8, (pop / maxPopForScale) * 160);

      // Pop count color intensity
      var intensity = Math.min(1, 0.35 + (pop / maxPopForScale) * 0.65);

      html += '<div class="tl-gen" data-gen="' + g + '" style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:60px;cursor:pointer;padding:6px 2px;border-radius:6px;transition:background 0.2s;position:relative;" onmouseover="this.style.background=\'rgba(251,146,60,0.15)\';var t=document.getElementById(\'timeline-tooltip\');t.style.display=\'block\';t.innerHTML=\'' + (chStr ? '「' + chStr + '」字辈 · ' : '') + '第' + g + '世 (' + yrStr + ')<br><b>' + pop + '人</b>' + (names.length > 0 ? '<br><span style=\\"font-size:11px;opacity:0.7;\\">' + names.slice(0,4).join('、') + '</span>' : '') + '\' onmousemove="var t=document.getElementById(\'timeline-tooltip\');var r=this.closest(\'.glass-card\').getBoundingClientRect();t.style.left=Math.min(event.clientX-r.left+14,580)+\'px\';t.style.top=(event.clientY-r.top-50)+\'px\';" onmouseout="document.getElementById(\'timeline-tooltip\').style.display=\'none\';this.style.background=\'transparent\'" onclick="showGenPeople(' + g + ')">';

      // Dynasty indicator top bar
      if (dyColor) {
        html += '<div style="width:40px;height:3px;border-radius:2px;background:' + dyColor + ';margin-bottom:6px;opacity:0.8;"></div>';
      } else {
        html += '<div style="height:9px;"></div>';
      }

      // Population bar
      html += '<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;min-height:180px;padding:2px 0;">';
      // Key ancestor name
      if (keyName) {
        html += '<div style="font-size:9px;color:#fb923c;font-weight:700;text-align:center;line-height:1.2;margin-bottom:2px;white-space:nowrap;">' + keyName + '</div>';
      }
      // Bar
      html += '<div style="width:28px;height:' + barH + 'px;border-radius:4px 4px 2px 2px;background:rgba(251,146,60,' + intensity + ');transition:all 0.2s;position:relative;display:flex;align-items:flex-start;justify-content:center;" onmouseover="this.style.opacity=\'0.8\';this.style.transform=\'scaleX(1.2)\'" onmouseout="this.style.opacity=\'1\';this.style.transform=\'scaleX(1)\'">';
      // Pop count on bar
      if (pop > 1 || pop === 0) {
        html += '<span style="font-size:9px;color:rgba(255,255,255,0.8);margin-top:3px;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,0.5);">' + pop + '</span>';
      }
      html += '</div></div>';

      // Character + gen number
      if (chStr) {
        html += '<div style="font-size:11px;color:var(--accent-orange);font-weight:600;margin-top:4px;line-height:1.2;">' + chStr + '</div>';
      }
      html += '<div style="font-size:10px;color:var(--text-tertiary);line-height:1.3;">' + g + '世</div>';
      html += '<div style="font-size:8px;color:var(--text-muted);opacity:0.5;line-height:1.2;">' + yrStr + '</div>';
      html += '</div>';
    });

    wrap.innerHTML = html;

    // Store gen data for click handler
    wrap._genPop = genPop;
    wrap._genNames = genNames;
    wrap._genChars = genChars;
    wrap._genNums = genNums;
  }

  window.renderTimeline = renderTimeline;

  // Click handler for generation
  window.showGenPeople = function(gen) {
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    var people = data.filter(function(p) { return parseInt(p.generation_num) === gen; });
    if (!people.length) return;
    var ch = people[0] && people[0].generation;
    var gl = (ch && ch !== '—') ? '「' + ch + '」字辈 · ' : '';
    var title = gl + '第' + gen + '世 共' + people.length + '人';
    var htm = '<div style="padding:20px;max-height:70vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h3 style="margin:0;font-family:var(--font-title);color:var(--accent-orange);font-size:18px;font-weight:600;">' + title + '</h3><button onclick="this.closest(\'.person-detail-modal\').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);">&times;</button></div><div style="display:grid;gap:8px;">';
    people.sort(function(a,b){return (a.name||'').localeCompare(b.name||'');});
    people.forEach(function(p) {
      htm += '<div onclick="showPersonDetail(' + p.id + ',getGenealogyData())" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;"><div><span style="font-weight:600;color:var(--text-primary);">' + escapeHtml(p.name) + '</span><span style="font-size:12px;color:var(--text-tertiary);margin-left:8px;">' + (p.gender || '') + '</span></div><div style="font-size:12px;">' + (p.is_alive === '是' ? '<span style="color:#22c55e;">在世</span>' : '<span style="color:var(--text-tertiary);">已故</span>') + '<span style="margin-left:12px;color:var(--accent-orange);">→ 详情</span></div></div>';
    });
    htm += '</div></div>';
    var overlay = document.createElement('div'); overlay.className = 'person-detail-modal'; overlay.onclick = function(ev) { if (ev.target === overlay) overlay.remove(); };
    var box = document.createElement('div'); box.className = 'person-detail-box'; box.style.maxWidth = '550px'; box.innerHTML = htm; overlay.appendChild(box); document.body.appendChild(overlay);
  };

  // Auto-render
  document.addEventListener('DOMContentLoaded', function() {
    renderTimeline();
  });
})();
