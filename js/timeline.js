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
  // 各朝代在数据中实际出现的柱体数（图例各段宽度按此与上方柱体颜色逐列对齐）
  function eraBarCounts(gens) {
    var out = [];
    for (var i=0;i<dynInfo.length;i++){
      var d = dynInfo[i], cnt = 0;
      for (var j=0;j<gens.length;j++){ if (gens[j]>=d.min && gens[j]<=d.max) cnt++; }
      out.push(cnt);
    }
    return out;
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
    // 重渲染（含手机↔桌面断点切换）时重置内联缩放状态
    INLINE_Z = 1;
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
      wrap.style.cssText = _origWrapStyle + ';flex-direction:column;min-height:auto;min-width:0px;position:relative';
      var unit = COL_W + GAP;

      // 朝代图例（顶部通栏）
      legendHtml = '<div style="display:flex;gap:'+GAP+'px;margin-bottom:8px;padding:0 1px;border-radius:6px;overflow:hidden;">';
      eraBarCounts(gens).forEach(function(cnt, i){
        var d = dynInfo[i];
        var w = cnt * (COL_W + GAP) - (cnt > 0 ? GAP : 0);
        legendHtml += '<div style="width:'+w+'px;height:16px;background:'+d.color+';display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;"><span style="font-size:7px;color:'+d.text+';font-weight:600;white-space:nowrap;">'+d.label+'</span></div>';
      });
      legendHtml += '</div>';

      // 波形（84 世全部一格，柱体从底部向上生长）
      html += '<div data-wave style="display:flex;align-items:flex-end;height:'+WAVE_H+'px;gap:'+GAP+'px;padding:0 1px;">';
      gens.forEach(function(g) {
        var pop = genPop[g]||0;
        var dc = getDynColor(g);
        var barH = pop > 0 ? Math.max(2, (pop / maxPop) * WAVE_H * 0.85) : 0;
        html += '<div class="tl-g" data-g="'+g+'" style="width:'+COL_W+'px;height:'+WAVE_H+'px;flex-shrink:0;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;" title="第'+g+'世 '+pop+'人">';
        html += '<div style="width:100%;height:'+barH+'px;border-radius:1px 1px 0 0;background:'+(dc||'#3fb950')+';opacity:'+(pop>0?'0.9':'0.15')+';min-height:'+(pop>0?'2px':'0')+';"></div>';
        html += '</div>';
      });
      html += '</div>';

      // 稀疏「代数/人数」标注（绝对定位，不撑宽格子）
      var step = Math.max(1, Math.round(gens.length / 8));
      html += '<div style="position:relative;height:10px;margin-top:2px;">';
      gens.forEach(function(g, i) {
        if (i % step !== 0 && i !== gens.length - 1 && !keyWords[g]) return;
        var left = 1 + i * unit + COL_W / 2;
        var pop = genPop[g] || 0;
        html += '<div style="position:absolute;left:'+left+'px;top:0;transform:translateX(-50%);font-size:7px;color:rgba(255,255,255,0.5);line-height:1;white-space:nowrap;">'+g+'/'+pop+'</div>';
      });
      html += '</div>';

      wrap.innerHTML = legendHtml + html;
    } else {
      // ===== 桌面端：柱状图在上，朝代图例移到柱状图下方（用户要求）=====
      // wrap 恢复原始内联样式（flex row，min-height:240px），但只放一个列向子容器
      wrap.style.cssText = _origWrapStyle;

      legendHtml = '<div style="display:flex;gap:'+GAP+'px;margin-top:10px;padding:0 2px;border-radius:6px;overflow:hidden;">';
      eraBarCounts(gens).forEach(function(cnt, i){
        var d = dynInfo[i];
        var w = cnt * (COL_W + GAP) - (cnt > 0 ? GAP : 0);
        legendHtml += '<div style="width:'+w+'px;height:20px;background:'+d.color+';display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;"><span style="font-size:9px;color:'+d.text+';font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,0.5);">'+d.label+'</span></div>';
      });
      legendHtml += '</div>';

      // 波形图：横轴世代，纵轴人数（内容高度，图例紧贴其下）
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

      // 列向子容器：图例紧贴柱状图下方，卡片剩余高度留白在底部
      wrap.innerHTML = '<div style="display:flex;flex-direction:column;align-self:flex-start;min-width:0;">' + html + legendHtml + '</div>';
    }

    wrap._genPop = genPop; wrap._genAlive = genAlive; wrap._genDeceased = genDeceased; wrap._genNames = genNames; wrap._genChars = genChars; wrap._genNums = gens;
    ensureFsBtn();
  }

  window.renderTimeline = renderTimeline;

  // ===== 全屏查看：捏合/滚轮缩放、拖动平移、逐柱「代数/人数」 =====
  var FS_COL = 30, FS_GAP = 2, FS_WAVE = 200;

  // ===== 桌面端内联缩放：放大后可以平移、可缩放大小（用户要求）=====
  // 只用 transform 缩放：现代浏览器 scrollWidth/scrollHeight 计入 transform 后的可视范围，
  // 滚动容器自动按缩放后尺寸产生水平/垂直滚动（平移），无需额外的宽高补偿。
  var inlineWrap = null, inlineContainer = null, inlineVal = null;
  var INLINE_Z = 1;
  function applyInlineZoom(z) {
    INLINE_Z = Math.max(1, Math.min(6, Math.round(z * 100) / 100));
    if (!inlineWrap || !inlineContainer) return;
    if (INLINE_Z === 1) {
      inlineWrap.style.transform = ''; inlineWrap.style.transformOrigin = '';
      inlineContainer.style.overflowY = 'hidden';
      inlineContainer.style.cursor = '';
    } else {
      inlineWrap.style.transform = 'scale(' + INLINE_Z + ')';
      inlineWrap.style.transformOrigin = 'top left';
      inlineContainer.style.overflowY = 'auto';
      inlineContainer.style.cursor = 'grab';
    }
    if (inlineVal) inlineVal.textContent = Math.round(INLINE_Z * 100) + '%';
  }
  function zoomAt(px, py, factor) {
    if (!inlineContainer) return;
    var ns = Math.max(1, Math.min(6, INLINE_Z * factor));
    if (ns === INLINE_Z) return;
    var cx = px, cy = py;
    var qx = (inlineContainer.scrollLeft + cx) / INLINE_Z;
    var qy = (inlineContainer.scrollTop + cy) / INLINE_Z;
    applyInlineZoom(ns);
    inlineContainer.scrollLeft = Math.max(0, qx * ns - cx);
    inlineContainer.scrollTop = Math.max(0, qy * ns - cy);
  }
  // 拖动平移（放大后），拖动超过阈值不算点击
  var dragState = null;
  function initInlineDrag() {
    if (!inlineContainer) return;
    inlineContainer.addEventListener('pointerdown', function(e) {
      if (INLINE_Z <= 1) return;
      dragState = { x: e.clientX, y: e.clientY, sl: inlineContainer.scrollLeft, st: inlineContainer.scrollTop, moved: 0 };
      try { inlineContainer.setPointerCapture(e.pointerId); } catch(err) {}
    });
    inlineContainer.addEventListener('pointermove', function(e) {
      if (!dragState) return;
      var dx = e.clientX - dragState.x, dy = e.clientY - dragState.y;
      dragState.moved += Math.abs(dx) + Math.abs(dy);
      if (dragState.moved > 6) {
        inlineContainer.scrollLeft = dragState.sl - dx;
        inlineContainer.scrollTop = dragState.st - dy;
        inlineContainer.style.cursor = 'grabbing';
      }
    });
    function endDrag(e) {
      if (dragState && dragState.moved > 6) {
        inlineContainer.style.cursor = INLINE_Z > 1 ? 'grab' : '';
        inlineContainer._tlJustDragged = true;
        setTimeout(function(){ if (inlineContainer) inlineContainer._tlJustDragged = false; }, 80);
      }
      dragState = null;
    }
    inlineContainer.addEventListener('pointerup', endDrag);
    inlineContainer.addEventListener('pointercancel', endDrag);
    inlineContainer.addEventListener('wheel', function(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        var r = inlineContainer.getBoundingClientRect();
        zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.15 : 1 / 1.15);
      }
    }, { passive: false });
  }

  function ensureFsBtn() {
    var card = document.getElementById('genealogy-timeline');
    if (!card) return;
    var h3 = card.querySelector('h3');
    if (!h3) return;
    inlineWrap = document.getElementById('timeline-wrap');
    inlineContainer = inlineWrap ? inlineWrap.parentElement : null;
    var bar = h3.querySelector('.tl-ctrl-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'tl-ctrl-bar';
      bar.style.cssText = 'display:flex;align-items:center;gap:4px;flex-shrink:0;';
      h3.appendChild(bar);
      // 内联缩放按钮已按用户要求移除（缩放走 Ctrl+滚轮）；控制栏只保留全屏按钮
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tl-fs-btn';
      btn.title = '全屏查看 · 可缩放';
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
      btn.style.cssText = 'align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;background:rgba(251,146,60,0.14);color:var(--accent-orange,#ff9a3c);border:1px solid rgba(251,146,60,0.35);cursor:pointer;flex-shrink:0;padding:0;';
      btn.onclick = function(ev) { ev.stopPropagation(); openFullscreen(); };
      bar.appendChild(btn);
      initInlineDrag();
    }
    // 控制栏只保留全屏按钮（内联缩放走 Ctrl+滚轮），手机/桌面都显示
    bar.style.display = 'flex';
    h3.style.display = 'flex'; h3.style.alignItems = 'center'; h3.style.justifyContent = 'space-between';
  }

  function openFullscreen() {
    var wrap = document.getElementById('timeline-wrap');
    if (!wrap) return;
    var gens = wrap._genNums || [], genPop = wrap._genPop || {};
    if (!gens.length) return;
    closeFullscreen();
    var maxPop = 1;
    gens.forEach(function(g){ if ((genPop[g]||0) > maxPop) maxPop = genPop[g]; });
    var pad = 24;
    var naturalW = pad*2 + gens.length*(FS_COL+FS_GAP);
    var naturalH = 30 + FS_WAVE + 28 + pad;

    var ov = document.createElement('div');
    ov.id = 'tl-fs';
    ov.style.cssText = 'position:fixed;inset:0;z-index:200000;background:rgba(6,8,14,0.97);display:flex;flex-direction:column;color:#fff;font-family:inherit;';

    var head = '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;">';
    head += '<div style="font-size:14px;font-weight:600;">📅 世代时间轴 <span style="font-size:11px;color:rgba(255,255,255,0.45);font-weight:400;margin-left:8px;">捏合/滚轮缩放 · 拖动平移 · 点击柱子查看该世族人</span></div>';
    head += '<button type="button" style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#fff;font-size:18px;cursor:pointer;line-height:1;flex-shrink:0;">✕</button>';
    head += '</div>';

    // 图例各段宽度 = 该朝代实际柱体数 × 柱宽（与上方柱体颜色逐列对齐，而非名义世次区间）
    var legend = '<div style="display:flex;gap:'+FS_GAP+'px;margin-top:10px;border-radius:6px;overflow:hidden;">';
    eraBarCounts(gens).forEach(function(cnt, i){
      var d = dynInfo[i];
      var w = cnt * (FS_COL + FS_GAP) - (cnt > 0 ? FS_GAP : 0);
      legend += '<div style="width:'+w+'px;height:22px;background:'+d.color+';display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;"><span style="font-size:11px;color:'+d.text+';font-weight:600;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.4);">'+d.label+'</span></div>';
    });
    legend += '</div>';

    var wave = '<div style="display:flex;align-items:flex-end;gap:'+FS_GAP+'px;">';
    gens.forEach(function(g) {
      var pop = genPop[g]||0;
      var dc = getDynColor(g);
      var barH = pop > 0 ? Math.max(3, (pop / maxPop) * FS_WAVE * 0.85) : 0;
      wave += '<div class="tl-fs-g" data-g="'+g+'" style="display:flex;flex-direction:column;justify-content:flex-end;align-items:center;cursor:pointer;" title="第'+g+'世 '+pop+'人">';
      wave += '<div style="width:'+FS_COL+'px;height:'+barH+'px;border-radius:3px 3px 0 0;background:'+(dc||'#3fb950')+';opacity:'+(pop>0?'0.95':'0.15')+';min-height:'+(pop>0?'3px':'0')+';"></div>';
      wave += '<div style="font-size:10px;color:rgba(255,255,255,0.55);margin-top:3px;line-height:1;white-space:nowrap;">'+g+'/'+(pop||0)+'</div>';
      wave += '</div>';
    });
    wave += '</div>';

    var content = document.createElement('div');
    content.id = 'tl-fs-content';
    content.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform;width:'+naturalW+'px;box-sizing:border-box;padding:14px '+pad+'px 0;-webkit-user-select:none;user-select:none;';
    content.innerHTML = wave + legend;

    ov.innerHTML = head + '<div id="tl-fs-view" style="flex:1;position:relative;overflow:hidden;touch-action:none;cursor:grab;-webkit-user-select:none;user-select:none;"></div>';
    ov.querySelector('#tl-fs-view').appendChild(content);
    document.body.appendChild(ov);

    var view = ov.querySelector('#tl-fs-view');
    var S = 1, TX = 0, TY = 0;
    var MIN_S = 0.2, MAX_S = 6; // 下限低于初始适配比例，放大后可缩回整图
    function clampV(x,a,b){ return Math.max(a, Math.min(b, x)); }
    function apply(){ content.style.transform = 'translate('+TX.toFixed(1)+'px,'+TY.toFixed(1)+'px) scale('+S.toFixed(3)+')'; }
    function fit() {
      var vw = view.clientWidth, vh = view.clientHeight;
      S = clampV((vw - 12) / naturalW, 0.25, 1);
      TX = (vw - naturalW*S) / 2;
      TY = Math.max(8, (vh - naturalH*S) / 2);
      apply();
    }
    fit();

    var pts = {}, lastPt = null, pinch = null, moved = 0;
    function dist(a,b){ return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)); }
    function mid(a,b){ return {x:(a.x+b.x)/2, y:(a.y+b.y)/2}; }
    view.addEventListener('pointerdown', function(e){
      try { view.setPointerCapture(e.pointerId); } catch(err){}
      pts[e.pointerId] = {x:e.clientX, y:e.clientY};
      moved = 0;
      var ids = Object.keys(pts);
      if (ids.length === 1) { pinch = null; lastPt = {x:e.clientX, y:e.clientY}; }
      else if (ids.length === 2) { pinch = { d0: Math.max(1, dist(pts[ids[0]], pts[ids[1]])), m0: mid(pts[ids[0]], pts[ids[1]]), s0: S, t0x: TX, t0y: TY }; }
    });
    view.addEventListener('pointermove', function(e){
      if (pts[e.pointerId] === undefined) return;
      var prev = pts[e.pointerId];
      moved += Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y);
      pts[e.pointerId] = {x:e.clientX, y:e.clientY};
      var ids = Object.keys(pts);
      if (ids.length === 2 && pinch) {
        var a = pts[ids[0]], b = pts[ids[1]];
        var d = Math.max(1, dist(a,b));
        var m = mid(a,b);
        var ns = clampV(pinch.s0 * d / pinch.d0, MIN_S, MAX_S);
        TX = pinch.m0.x*pinch.s0 + pinch.t0x - m.x*ns;
        TY = pinch.m0.y*pinch.s0 + pinch.t0y - m.y*ns;
        S = ns; apply();
      } else if (ids.length === 1 && !pinch && lastPt) {
        // 平移始终可用（去掉 S>1.01 限制，解决“最大化后不能平移”），并夹紧在视图内防止拖丢
        var sw = naturalW * S, sh = naturalH * S;
        TX = clampV(TX + (e.clientX - lastPt.x), Math.min(0, view.clientWidth - sw), Math.max(0, view.clientWidth - sw));
        TY = clampV(TY + (e.clientY - lastPt.y), Math.min(0, view.clientHeight - sh), Math.max(0, view.clientHeight - sh));
        apply();
        view.style.cursor = 'grabbing';
        lastPt = {x:e.clientX, y:e.clientY};
      }
    });
    function endPointer(e){
      delete pts[e.pointerId];
      if (Object.keys(pts).length < 2) pinch = null;
      view.style.cursor = 'grab';
    }
    view.addEventListener('pointerup', endPointer);
    view.addEventListener('pointercancel', endPointer);
    view.addEventListener('wheel', function(e){
      e.preventDefault();
      var factor = e.deltaY < 0 ? 1.15 : 1/1.15;
      var ns = clampV(S*factor, MIN_S, MAX_S);
      var r = view.getBoundingClientRect();
      var vx = e.clientX - r.left, vy = e.clientY - r.top;
      TX = vx - (vx - TX)*(ns/S);
      TY = vy - (vy - TY)*(ns/S);
      S = ns; apply();
    }, {passive:false});
    view.addEventListener('dblclick', function(e){
      var ns = S > 1.5 ? 1 : 2.5;
      var r = view.getBoundingClientRect();
      var vx = e.clientX - r.left, vy = e.clientY - r.top;
      TX = vx - (vx - TX)*(ns/S);
      TY = vy - (vy - TY)*(ns/S);
      S = ns; apply();
    });
    view.addEventListener('click', function(e){
      if (moved > 6) return;
      // 真实浏览器 setPointerCapture 会把 click 重定向到 view（e.target 不再是柱体），
      // 因此用 elementFromPoint（含 transform 坐标命中）找柱体；兜底遍历 rect
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var gEl = el && el.closest('.tl-fs-g');
      if (!gEl) {
        var bars = view.querySelectorAll('.tl-fs-g');
        for (var bi = 0; bi < bars.length; bi++) {
          var br = bars[bi].getBoundingClientRect();
          if (e.clientX >= br.left && e.clientX <= br.right && e.clientY >= br.top && e.clientY <= br.bottom) { gEl = bars[bi]; break; }
        }
      }
      if (gEl) showGenPeople(parseInt(gEl.getAttribute('data-g')));
    });

    var onKey = function(e){ if (e.key === 'Escape') closeFullscreen(); };
    ov._onKey = onKey;
    document.addEventListener('keydown', onKey);
    ov.querySelector('button').onclick = function(){ closeFullscreen(); };
  }

  function closeFullscreen() {
    var ov = document.getElementById('tl-fs');
    if (!ov) return;
    if (ov._onKey) document.removeEventListener('keydown', ov._onKey);
    ov.remove();
  }

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
      // 放大后拖动平移刚结束 → 不算点击
      if (inlineContainer && inlineContainer._tlJustDragged) return;
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

    // 放大时 pointer capture 会把 click 事件重定向到滚动容器（inlineContainer，事件不再经过 wrap），
    // 因此在容器层再挂一个监听：只有当点击对象就是容器本身（即捕获重定向的情形）才用坐标命中柱子。
    // 坐标基于 getBoundingClientRect（已含 scale 变换），任何缩放级别都准确。
    if (inlineContainer) {
      inlineContainer.addEventListener('click', function(e) {
        if (e.target !== inlineContainer) return; // 未放大时事件从 wrap 冒泡上来，wrap 已处理，避免重复
        if (inlineContainer._tlJustDragged) return;
        var el = null;
        var hit = document.elementFromPoint(e.clientX, e.clientY);
        if (hit && !hit.closest('#timeline-tooltip')) el = hit.closest('.tl-g');
        if (!el) {
          var bars = wrap.querySelectorAll('.tl-g');
          for (var bi = 0; bi < bars.length; bi++) {
            var br = bars[bi].getBoundingClientRect();
            if (e.clientX >= br.left && e.clientX <= br.right && e.clientY >= br.top && e.clientY <= br.bottom) { el = bars[bi]; break; }
          }
        }
        if (el) {
          var g3 = parseInt(el.getAttribute('data-g'));
          if (!isNaN(g3)) showGenPeople(g3);
        }
      });
    }
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
