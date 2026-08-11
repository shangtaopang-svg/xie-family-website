/* 世代时间轴 v4 - HTML/CSS 横向卷轴，手机端整图压缩填满（桌面端渲染不变） */
(function() {
  var dynInfo = [
    {min:0,max:60,label:'上古·传说',color:'#8B5CF6',text:'#C4B5FD'},
    {min:61,max:80,label:'周',color:'#F59E0B',text:'#FDE68A'},
    {min:81,max:100,label:'秦汉',color:'#3B82F6',text:'#93C5FD'},
    {min:101,max:120,label:'魏晋南北朝',color:'#EC4899',text:'#F9A8D4'},
    {min:121,max:130,label:'隋唐',color:'#10B981',text:'#6EE7B7'},
    {min:131,max:140,label:'宋',color:'#F97316',text:'#FDBA74'},
    {min:141,max:150,label:'元明',color:'#EF4444',text:'#FCA5A5'},
    {min:151,max:165,label:'清·近代',color:'#6366F1',text:'#A5B4FC'},
  ];
  function getDynColor(g) {
    for (var i=0;i<dynInfo.length;i++){if(g>=dynInfo[i].min&&g<=dynInfo[i].max)return dynInfo[i].color;}
    return '#6366F1';
  }
  function getDynLabel(g) {
    for (var i=0;i<dynInfo.length;i++){if(g>=dynInfo[i].min&&g<=dynInfo[i].max)return dynInfo[i];}
    return null;
  }
  var COL_W = 10, GAP = 1;
  var _origWrapStyle = null; // 首次渲染时捕获 wrap 原始内联样式，桌面端原样恢复
  function isCompact() {
    try { return window.matchMedia && window.matchMedia('(max-width: 768px)').matches; }
    catch(e) { return false; }
  }
  function renderTimeline() {
    var wrap = document.getElementById('timeline-wrap');
    if (!wrap) return;
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : null;
    if (!data || data.length === 0) { wrap.innerHTML = '<div style="padding:40px;color:var(--text-tertiary);font-size:13px;">暂无数据</div>'; return; }

    var genPop = {}, genAlive = {}, genDeceased = {}, genChars = {}, genNames = {};
    data.forEach(function(p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genPop[g]) { genPop[g] = 0; genAlive[g] = 0; genDeceased[g] = 0; genNames[g] = []; }
      genPop[g]++;
      if (p.is_alive === '是') genAlive[g]++; else genDeceased[g]++;
      if (p.generation && p.generation !== '—') genChars[g] = p.generation;
      genNames[g].push(p.name);
    });
    var gens = Object.keys(genPop).map(Number).sort(function(a,b){return a-b});
    var maxPop = 1; gens.forEach(function(g){if(genPop[g]>maxPop)maxPop=genPop[g];});
    var maxH = Math.max(maxPop, 10);

    if (_origWrapStyle === null) _origWrapStyle = wrap.getAttribute('style') || '';
    var compact = isCompact();
    COL_W = compact ? 3 : 10;
    GAP = compact ? 0 : 1;
    var WAVE_H = 48;

    var keyWords = {1:'炎帝',65:'申伯',130:'小四',132:'文杲',147:'彬公'};
    function findKeyName(g, names) {
      var kw = keyWords[g];
      if (kw) return kw;
      for (var i=0;i<names.length;i++) {
        var n = names[i];
        if (n.indexOf('炎帝')>=0||n.indexOf('申伯')>=0||n.indexOf('小四')>=0||
            n.indexOf('文杲')>=0||n.indexOf('彬')>=0||n.indexOf('乾')>=0||
            n.indexOf('深甫')>=0||n.indexOf('云先')>=0) {
          return n.replace(/[（(].*[）)]/g,'').substring(0,6);
        }
      }
      return '';
    }

    var html = '', legendHtml = '';
    if (compact) {
      // ===== 手机端：整图压缩填满卡片宽 =====
      // 覆盖 wrap 行内样式：flex 改列向让图例在顶部、取消 min-height/min-width
      wrap.style.cssText = _origWrapStyle + ';flex-direction:column;min-height:auto;min-width:0px';
      var unit = COL_W + GAP;

      // 朝代图例（顶部通栏）
      legendHtml = '<div style="display:flex;gap:0;margin-bottom:8px;border-radius:6px;overflow:hidden;">';
      dynInfo.forEach(function(d){
        var w = ((d.max-d.min+1)/165)*100;
        legendHtml += '<div style="flex:'+w+';height:16px;background:'+d.color+';display:flex;align-items:center;justify-content:center;"><span style="font-size:7px;color:'+d.text+';font-weight:600;white-space:nowrap;">'+d.label+'</span></div>';
      });
      legendHtml += '</div>';

      // 波形（84 世全部一格）
      html += '<div data-wave style="display:flex;align-items:flex-end;height:'+WAVE_H+'px;gap:'+GAP+'px;padding:0 1px;">';
      gens.forEach(function(g) {
        var pop = genPop[g]||0;
        var dc = getDynColor(g);
        var barH = pop > 0 ? Math.max(2, (pop / maxPop) * WAVE_H * 0.85) : 0;
        html += '<div class="tl-g" data-g="'+g+'" style="width:'+COL_W+'px;height:'+WAVE_H+'px;flex-shrink:0;cursor:pointer;" title="第'+g+'世 '+pop+'人">';
        html += '<div style="width:100%;height:'+barH+'px;border-radius:1px 1px 0 0;background:'+(dc||'#3fb950')+';opacity:'+(pop>0?'0.9':'0.15')+';min-height:'+(pop>0?'2px':'0')+';"></div>';
        html += '</div>';
      });
      html += '</div>';

      // 稀疏世代号（绝对定位，不撑宽格子）
      var step = Math.max(1, Math.round(gens.length / 8));
      html += '<div style="position:relative;height:9px;margin-top:1px;">';
      gens.forEach(function(g, i) {
        if (i % step !== 0 && i !== gens.length - 1 && !keyWords[g]) return;
        var left = 1 + i * unit + COL_W / 2;
        html += '<div style="position:absolute;left:'+left+'px;top:0;transform:translateX(-50%);font-size:7px;color:rgba(255,255,255,0.4);line-height:1;white-space:nowrap;">'+g+'</div>';
      });
      html += '</div>';

      // 关键人名标记（重叠折行）
      var keyPos = [];
      gens.forEach(function(g, i) {
        var kn = findKeyName(g, genNames[g]||[]);
        if (!kn) return;
        keyPos.push({name: kn, left: 1 + i * unit + COL_W / 2});
      });
      var lastL0 = -1e9, lastL1 = -1e9;
      keyPos.forEach(function(k) {
        if (lastL0 + 20 <= k.left) { k.line = 0; lastL0 = k.left; }
        else { k.line = 1; lastL1 = Math.max(lastL1, k.left); }
      });
      var keyRowH = keyPos.some(function(k){return k.line===1;}) ? 20 : 9;
      html += '<div style="position:relative;height:'+keyRowH+'px;margin-top:2px;">';
      keyPos.forEach(function(k) {
        html += '<div style="position:absolute;left:'+k.left+'px;top:'+(k.line===1?'10px':'0')+';transform:translateX(-50%);font-size:'+(k.line===1?'7px':'8px')+';color:#ff6b00;font-weight:600;line-height:1;white-space:nowrap;">'+k.name+'</div>';
      });
      html += '</div>';

      wrap.innerHTML = legendHtml + html;
    } else {
      // ===== 桌面端：渲染不变 =====
      // 用首次捕获的原始内联样式整体恢复（含 min-height:240px），桌面端逐字节不变
      wrap.style.cssText = _origWrapStyle;

      legendHtml = '<div style="display:flex;gap:0;margin-bottom:10px;border-radius:6px;overflow:hidden;">';
      dynInfo.forEach(function(d){
        var w = ((d.max-d.min+1)/165)*100;
        legendHtml += '<div style="flex:'+w+';height:20px;background:'+d.color+';display:flex;align-items:center;justify-content:center;"><span style="font-size:9px;color:'+d.text+';font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,0.5);">'+d.label+'</span></div>';
      });
      legendHtml += '</div>';

      // 波形图：横轴世代，纵轴人数
      html = '<div style="position:relative;padding:4px 0 0;min-height:'+(WAVE_H+30)+'px;">';
      // 波形区域
      html += '<div style="display:flex;align-items:flex-end;height:'+WAVE_H+'px;padding:0 2px;gap:1px;">';
      gens.forEach(function(g) {
        var pop = genPop[g]||0;
        var names = genNames[g]||[];
        var keyName = findKeyName(g, names);
        var dc = getDynColor(g);
        var barH = pop > 0 ? Math.max(2, (pop / maxPop) * WAVE_H * 0.85) : 0;
        html += '<div class="tl-g" data-g="'+g+'" style="display:flex;flex-direction:column;align-items:center;cursor:pointer;position:relative;" title="第'+g+'世 '+pop+'人">';
        // 柱条 + 朝代色
        html += '<div style="width:'+COL_W+'px;height:'+barH+'px;border-radius:1px 1px 0 0;background:'+(dc||'#3fb950')+';opacity:'+(pop>0?'0.9':'0.15')+';transition:opacity 0.15s;min-height:'+(pop>0?'2px':'0')+';"></div>';
        // 世代号
        html += '<div style="font-size:7px;color:'+(pop>0?'rgba(255,255,255,0.4)':'rgba(255,255,255,0.12)')+';line-height:1;margin-top:1px;white-space:nowrap;">'+g+'</div>';
        html += '</div>';
      });
      html += '</div>';
      // 关键人物标记行
      html += '<div style="display:flex;gap:1px;padding:0 2px;margin-top:2px;">';
      gens.forEach(function(g) {
        var names = genNames[g]||[];
        var keyName = findKeyName(g, names);
        html += '<div style="width:'+COL_W+'px;flex-shrink:0;text-align:center;font-size:6px;color:#ff6b00;font-weight:600;line-height:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+(keyName||'')+'</div>';
      });
      html += '</div>';
      html += '</div>';

      wrap.innerHTML = legendHtml + html;
    }

    wrap._genPop = genPop; wrap._genAlive = genAlive; wrap._genDeceased = genDeceased; wrap._genNames = genNames; wrap._genChars = genChars; wrap._genNums = gens;
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
      var alive = (wrap._genAlive||{})[g]||0;
      var deceased = (wrap._genDeceased||{})[g]||0;
      var ch = (wrap._genChars||{})[g]||'';
      var names = (wrap._genNames||{})[g]||[];
      ch = (ch&&ch!=='—')?'「'+ch+'」字辈·':'';
      var dyn = getDynLabel(g);
      var dynStr = dyn ? '<span style="color:'+dyn.text+'">'+dyn.label+'</span> ' : '';
      var showN = Math.min(names.length, 8);
      var nameList = names.slice(0,showN).join('、');
      if (names.length > showN) nameList += '…';
      tip.innerHTML = dynStr+ch+'第'+g+'世<br><b>'+pop+'人</b>  <span style="color:#22c55e;">在世'+alive+'</span> · <span style="color:#999;">已故'+deceased+'</span>'+(names.length?'<br><span style="font-size:11px;opacity:0.7;">'+nameList+'</span>':'');
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
      if (el) {
        var g = parseInt(el.getAttribute('data-g'));
        if (!isNaN(g)) showGenPeople(g);
        return;
      }
      // 手机压缩模式：点波形任意处取最近的世（柱子只有 3px，扩大命中区域）
      if (isCompact()) {
        var row = wrap.querySelector('[data-wave]');
        if (!row) return;
        var cells = row.querySelectorAll('.tl-g');
        if (!cells.length) return;
        var first = cells[0].getBoundingClientRect();
        var u = cells.length > 1 ? (cells[1].getBoundingClientRect().left - first.left) : (COL_W);
        var idx = Math.round((e.clientX - first.left) / u);
        idx = Math.max(0, Math.min(cells.length - 1, idx));
        var g2 = parseInt(cells[idx].getAttribute('data-g'));
        if (!isNaN(g2)) showGenPeople(g2);
      }
    });
  });

  // 断点切换（手机↔桌面）时重渲染；仅当压缩状态变化才重建，避免桌面端被重排
  var lastCompact = null;
  function checkResize() {
    var c = isCompact();
    if (c !== lastCompact) { lastCompact = c; renderTimeline(); }
  }
  window.addEventListener('resize', checkResize);
  window.addEventListener('orientationchange', function(){ setTimeout(checkResize, 200); });

  window.showGenPeople = function(gen) {
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    var people = data.filter(function(p){return parseInt(p.generation_num)===gen;});
    if (!people.length) return;
    var ch = people[0]&&people[0].generation;
    var gl = (ch&&ch!=='—')?'「'+ch+'」字辈·':'';
    var title = gl+'第'+gen+'世 共'+people.length+'人';
    var overlay=document.createElement('div'); overlay.className='person-detail-modal'; overlay.onclick=function(ev){if(ev.target===overlay)overlay.remove();};
    var box=document.createElement('div'); box.className='person-detail-box'; box.style.maxWidth='550px';
    var inner='<div style="padding:20px;max-height:70vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h3 style="margin:0;font-family:var(--font-title);color:var(--accent-orange);font-size:18px;font-weight:600;">'+title+'</h3></div><div style="display:grid;gap:8px;" id="tl-people-list">';
    people.sort(function(a,b){return(a.name||'').localeCompare(b.name||'');});
    people.forEach(function(p){
      var pBg = p.is_alive==='是'?'rgba(220,38,38,0.06)':'rgba(0,0,0,0.1)';
inner += '<div onclick="showPersonDetail('+p.id+',getGenealogyData())" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:'+pBg+';border:1px solid '+(p.is_alive==='是'?'rgba(220,38,38,0.15)':'rgba(255,255,255,0.05)')+';border-radius:8px;cursor:pointer;"><div><span style="font-weight:600;color:var(--text-primary);">'+escapeHtml(p.name)+'</span><span style="font-size:12px;color:var(--text-tertiary);margin-left:8px;">'+(p.gender||'')+'</span></div><div style="font-size:12px;">'+(p.is_alive==='是'?'<span style="color:#ef4444;font-weight:600;">在世</span>':'<span style="color:rgba(255,255,255,0.45);">已故</span>')+'<span style="margin-left:12px;color:var(--accent-orange);">→ 详情</span></div></div>';
    });
    inner += '</div></div>';
    box.innerHTML = inner;
    // Create close button with DOM (avoid HTML entity issues)
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);';
    closeBtn.onclick = function() { overlay.remove(); };
    box.querySelector('div[style*="display:flex"]').appendChild(closeBtn);
    overlay.appendChild(box); document.body.appendChild(overlay);
  };
})();
