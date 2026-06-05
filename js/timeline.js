/* 世代时间轴 v3 - HTML/CSS 横向卷轴 */
(function() {
  function estimateYear(g) { return Math.round(-2800 + g * 28.6); }

  function renderTimeline() {
    var wrap = document.getElementById('timeline-wrap');
    if (!wrap) return;
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : null;
    if (!data || data.length === 0) { wrap.innerHTML = '<div style="padding:40px;color:var(--text-tertiary);font-size:13px;">暂无数据</div>'; return; }

    var genPop = {}, genChars = {}, genNames = {};
    data.forEach(function(p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genPop[g]) { genPop[g] = 0; genNames[g] = []; }
      genPop[g]++;
      if (p.generation && p.generation !== '—') genChars[g] = p.generation;
      genNames[g].push(p.name);
    });
    var gens = Object.keys(genPop).map(Number).sort(function(a,b){return a-b});
    var maxPop = 1; gens.forEach(function(g){if(genPop[g]>maxPop)maxPop=genPop[g];});
    var maxH = Math.max(maxPop, 10);

    var dynColors = {
      '0':'#8B5CF6','1':'#F59E0B','2':'#3B82F6','3':'#EC4899',
      '4':'#10B981','5':'#F97316','6':'#EF4444','7':'#6366F1'
    };
    function getDynColor(g) {
      if (g<=60) return dynColors['0']; if (g<=80) return dynColors['1'];
      if (g<=100) return dynColors['2']; if (g<=120) return dynColors['3'];
      if (g<=130) return dynColors['4']; if (g<=140) return dynColors['5'];
      if (g<=150) return dynColors['6']; return dynColors['7'];
    }

    var keyWords = {1:'炎帝',65:'申伯',130:'小四',132:'文柲',147:'彬公'};
    function findKeyName(g, names) {
      var kw = keyWords[g];
      if (kw) return kw;
      for (var i=0;i<names.length;i++) {
        var n = names[i];
        if (n.indexOf('炎帝')>=0||n.indexOf('申伯')>=0||n.indexOf('小四')>=0||
            n.indexOf('文柲')>=0||n.indexOf('彬')>=0||n.indexOf('乾')>=0||
            n.indexOf('深甫')>=0||n.indexOf('云先')>=0) {
          return n.replace(/[（(].*[）)]/g,'').substring(0,6);
        }
      }
      return '';
    }

    var html = '';
    gens.forEach(function(g) {
      var pop = genPop[g]||0;
      var yr = estimateYear(g);
      var yrStr = (yr<0?(-yr)+'BC':yr+'年');
      var ch = genChars[g]||'';
      var names = genNames[g]||[];
      var keyName = findKeyName(g, names);
      var dc = getDynColor(g);
      var barH = Math.max(8, (pop/maxH)*160);
      var bright = Math.min(1, 0.35+(pop/maxH)*0.65);

      html += '<div class="tl-g" data-g="'+g+'" style="display:inline-flex;flex-direction:column;align-items:center;width:58px;flex-shrink:0;padding:6px 2px;border-radius:6px;cursor:pointer;vertical-align:top;">';
      if (dc) html += '<div style="width:36px;height:3px;border-radius:2px;background:'+dc+';margin-bottom:5px;"></div>';
      else html += '<div style="height:8px;"></div>';
      html += '<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;min-height:175px;padding:2px 0;">';
      if (keyName) html += '<div style="font-size:9px;color:#fb923c;font-weight:700;line-height:1.2;margin-bottom:2px;white-space:nowrap;">'+keyName+'</div>';
      html += '<div class="tl-bar" style="width:26px;height:'+barH+'px;border-radius:4px 4px 2px 2px;background:rgba(251,146,60,'+bright+');transition:all 0.15s;display:flex;align-items:flex-start;justify-content:center;">';
      if (pop>0) html += '<span style="font-size:9px;color:#fff;margin-top:3px;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,0.5);">'+pop+'人</span>'; else html += '<span style="font-size:7px;color:rgba(255,255,255,0.3);margin-top:2px;">'+g+'</span>';
      html += '</div></div>';
      if (ch) html += '<div style="font-size:11px;color:var(--accent-orange);font-weight:600;margin-top:4px;line-height:1.2;">'+ch+'</div>';
      html += '<div style="font-size:10px;color:var(--text-tertiary);line-height:1.3;font-weight:600;">'+g+'世</div>';
      html += '<div style="font-size:8px;color:var(--text-muted);opacity:0.5;line-height:1.2;">'+yrStr+'</div>';
      html += '</div>';
    });
    wrap.innerHTML = html;

    wrap._genPop = genPop; wrap._genNames = genNames; wrap._genChars = genChars; wrap._genNums = gens;
  }

  window.renderTimeline = renderTimeline;

  // Delegated events on the wrap container
  document.addEventListener('DOMContentLoaded', function() {
    renderTimeline();
    var wrap = document.getElementById('timeline-wrap');
    var tip = document.getElementById('timeline-tooltip');
    if (!wrap || !tip) return;

    wrap.addEventListener('mouseover', function(e) {
      var el = e.target.closest('.tl-g');
      if (!el) { tip.style.display='none'; return; }
      var g = parseInt(el.getAttribute('data-g'));
      var pop = (wrap._genPop||{})[g]||0;
      var ch = (wrap._genChars||{})[g]||'';
      var names = (wrap._genNames||{})[g]||[];
      var yr = estimateYear(g);
      var yrStr = (yr<0?(-yr)+'BC':yr+'年');
      ch = (ch&&ch!=='—')?'「'+ch+'」字辈·':'';
      tip.innerHTML = ch+'第'+g+'世 ('+yrStr+')<br><b>'+pop+'人</b>'+(names.length?'<br><span style="font-size:11px;opacity:0.7;">'+names.slice(0,4).join('、')+'</span>':'');
      tip.style.display='block';
      el._tipGen = g;
    });

    wrap.addEventListener('mousemove', function(e) {
      var el = e.target.closest('.tl-g');
      if (!el) return;
      var r = wrap.closest('.glass-card').getBoundingClientRect();
      tip.style.left = Math.min(e.clientX-r.left+14, r.width-220)+'px';
      tip.style.top = (e.clientY-r.top-55)+'px';
    });

    wrap.addEventListener('mouseout', function(e) {
      if (e.target.closest('.tl-g')) tip.style.display='none';
    });

    wrap.addEventListener('click', function(e) {
      var el = e.target.closest('.tl-g');
      if (!el) return;
      var g = parseInt(el.getAttribute('data-g'));
      showGenPeople(g);
    });
  });

  window.showGenPeople = function(gen) {
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    var people = data.filter(function(p){return parseInt(p.generation_num)===gen;});
    if (!people.length) return;
    var ch = people[0]&&people[0].generation;
    var gl = (ch&&ch!=='—')?'「'+ch+'」字辈·':'';
    var title = gl+'第'+gen+'世 共'+people.length+'人';
    var htm = '<div style="padding:20px;max-height:70vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h3 style="margin:0;font-family:var(--font-title);color:var(--accent-orange);font-size:18px;font-weight:600;">'+title+'</h3><button onclick="this.closest(&#39;person-detail-modal&#39;).remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);">&times;</button></div><div style="display:grid;gap:8px;">';
    people.sort(function(a,b){return(a.name||'').localeCompare(b.name||'');});
    people.forEach(function(p){
      htm += '<div onclick="showPersonDetail('+p.id+',getGenealogyData())" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;"><div><span style="font-weight:600;color:var(--text-primary);">'+escapeHtml(p.name)+'</span><span style="font-size:12px;color:var(--text-tertiary);margin-left:8px;">'+(p.gender||'')+'</span></div><div style="font-size:12px;">'+(p.is_alive==='是'?'<span style="color:#22c55e;">在世</span>':'<span style="color:var(--text-tertiary);">已故</span>')+'<span style="margin-left:12px;color:var(--accent-orange);">→ 详情</span></div></div>';
    });
    htm += '</div></div>';
    var overlay=document.createElement('div'); overlay.className='person-detail-modal'; overlay.onclick=function(ev){if(ev.target===overlay)overlay.remove();};
    var box=document.createElement('div'); box.className='person-detail-box'; box.style.maxWidth='550px'; box.innerHTML=htm; overlay.appendChild(box); document.body.appendChild(overlay);
  };
})();
