/* 世代时间轴 v4 - HTML/CSS 横向卷轴，手机端整图压缩填满（桌面端渲染不变） */
(function() {
  var dynInfo = [
    {min:1,max:53,label:'上古·传说',color:'#8B5CF6',text:'#C4B5FD'},
    {min:54,max:80,label:'周',color:'#F59E0B',text:'#FDE68A'},
    {min:81,max:100,label:'秦汉',color:'#3B82F6',text:'#93C5FD'},
    {min:101,max:120,label:'魏晋南北朝',color:'#EC4899',text:'#F9A8D4'},
    {min:121,max:129,label:'隋唐',color:'#10B981',text:'#6EE7B7'},
    {min:130,max:140,label:'宋',color:'#F97316',text:'#FDBA74'},
    {min:141,max:150,label:'元明',color:'#EF4444',text:'#FCA5A5'},
    {min:151,max:160,label:'清',color:'#6366F1',text:'#A5B4FC'},
    {min:161,max:197,label:'近现代',color:'#06B6D4',text:'#A5F3FC'},
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
  // 时代标注条：无底色，等间距分段，数学标注两点间距离的样式——每段一条细线 + 左◀右▶箭头 + 中间朝代名
  // totalW 与柱状图总宽对齐，每段宽度 = totalW / dynInfo.length，保证标注距离一致
  // 不用 overflow:hidden：让标注条像柱状图一样随卡片横向滚动，末段不会被裁掉
  function buildLegend(gens, unit, h, fs, gap, pad, mTop, textColor, lineColor) {
    var totalW = gens.length * unit - (gap > 0 ? gap : 0);
    var segW = totalW / dynInfo.length;
    var arrowFs = Math.max(fs - 2, 6);
    var html = '<div style="display:flex;margin-top:'+mTop+'px;padding:0 '+pad+'px;">';
    for (var i=0;i<dynInfo.length;i++){
      var d = dynInfo[i];
      html += '<div style="width:'+segW+'px;height:'+h+'px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;gap:1px;">';
      // 朝代名（无底色，居中于细线上方）
      html += '<div style="font-size:'+fs+'px;color:'+textColor+';font-weight:600;line-height:1;white-space:nowrap;">'+d.label+'</div>';
      // 细线 + 两端箭头（标注两点间距离）
      html += '<div style="width:100%;display:flex;align-items:center;">';
      html += '<div style="font-size:'+arrowFs+'px;color:'+lineColor+';line-height:1;flex-shrink:0;">◀</div>';
      html += '<div style="flex:1;height:1px;background:'+lineColor+';margin:0 1px;"></div>';
      html += '<div style="font-size:'+arrowFs+'px;color:'+lineColor+';line-height:1;flex-shrink:0;">▶</div>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }
  var COL_W = 10, GAP = 1;
  var _origWrapStyle = null; // 首次渲染时捕获 wrap 原始内联样式，桌面端原样恢复
  var _tlFakeRotated = false; // 时间轴全屏 CSS 假横屏态：点代详情弹层需同步旋转横屏（用户：详情页也要横屏展示）
  function isCompact() {
    try { return window.matchMedia && window.matchMedia('(max-width: 768px)').matches; }
    catch(e) { return false; }
  }

  // ===== 动态效果：柱体升起 + 柱顶趋势连线画出（CSS 关键帧，只注入一次） =====
  var _animInjected = false;
  function ensureAnimStyle() {
    if (_animInjected) return;
    _animInjected = true;
    try {
      var st = document.createElement('style');
      st.id = 'tl-anim-style';
      st.textContent = '@keyframes tlBarIn{from{transform:scaleY(0)}to{transform:scaleY(1)}}' +
        '@media (prefers-reduced-motion: reduce){.tl-g>div,.tl-fs-g>div{animation:none!important}}' +
        /* 时间轴假横屏时点代详情弹层同步旋转横屏（用户：点击某一代出来的详情页也要横屏展示）。
           竖屏视口下 rotate90 后视觉 bbox=横屏：视觉宽=布局高=100vw、视觉高=布局宽=100vh。
           ★滚动修复（用户：全屏详情不能上下滑动、下面信息看不到）——旋转移到 overlay 整层，
           box 内反旋 rotate(-90deg) 净0：若 box 自身 rotate90 再 overflow-y:auto，布局Y轴
           会映射到视觉水平方向（只能左右滚）；反旋后 box 的 overflow-y 才是视觉上下滚动。 */
        '.tl-fs-rotated-detail{position:fixed!important;top:50%!important;left:50%!important;width:100vh!important;height:100vw!important;max-width:none!important;max-height:none!important;padding:0!important;margin:0!important;transform:translate(-50%,-50%) rotate(90deg)!important;transform-origin:center!important;display:flex;align-items:center;justify-content:center}' +
        '.tl-fs-rotated-detail .person-detail-box{position:relative!important;top:auto!important;left:auto!important;width:calc(100vw - 40px)!important;max-width:none!important;height:calc(100vh - 40px)!important;max-height:none!important;padding:0!important;margin:0!important;transform:rotate(-90deg)!important;transform-origin:center!important;overflow-y:auto;overflow-x:hidden;border-radius:12px}' +
        '.tl-fs-rotated-detail .person-detail-box>div:first-child{max-height:none!important;overflow:visible!important}' +
        '.tl-fs-rotated-detail .ancestor-tree-modal-box{position:relative!important;top:auto!important;left:auto!important;width:calc(100vw - 40px)!important;max-width:none!important;height:calc(100vh - 40px)!important;max-height:none!important;margin:0!important;transform:rotate(-90deg)!important;transform-origin:center!important;overflow-y:auto;overflow-x:hidden}';
      // 手机端全屏 CSS 假横屏的旋转样式不在此注入：view 的几何（宽高/位置/rotate90）由
      // openFullscreen 内 tlTryLandscape 用 JS 行内样式设置（行内样式可压过 view 的
      // 行内 position:relative/flex:1，避免 class 被行内样式覆盖的陷阱），.tl-fs-rotated 仅作状态标记。
      (document.head || document.documentElement).appendChild(st);
    } catch(e) {}
  }

  function renderTimeline() {
    ensureAnimStyle();
    var wrap = document.getElementById('timeline-wrap');
    if (!wrap) return;
    // 重渲染（含手机↔桌面断点切换）时重置内联缩放状态
    INLINE_Z = 1;
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : null;
    if (!data || data.length === 0) { wrap.innerHTML = '<div style="padding:40px;color:var(--text-tertiary);font-size:13px;">暂无数据</div>'; return; }
    // 世代体系统一：getGenealogyData() 已在数据源层完成换算（权威本地世次+131 → 炎帝全局世系，远古世系本就是全局值），
    // 这里不再重复平移，避免双重偏移（本地16世 +131+131=278世 错误）。用户确认：炎帝=1世、申伯=65世。

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

    var keyWords = {1:'炎帝',65:'申伯',130:'小四',132:'文杲',147:'彬·乾'};
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

      // 时代标注条：无底色，数学标注两点间距离样式（细线+两端箭头+中间朝代名）
      legendHtml = buildLegend(gens, unit, 14, 7, GAP, 1, 4, 'var(--text-secondary)', 'var(--text-tertiary)');

      // 波形（84 世全部一格，柱体从底部向上生长）
      html += '<div data-wave style="display:flex;align-items:flex-end;height:'+WAVE_H+'px;gap:'+GAP+'px;padding:0 1px;position:relative;">';
      gens.forEach(function(g, i) {
        var pop = genPop[g]||0;
        var dc = getDynColor(g);
        var barH = pop > 0 ? Math.max(2, (pop / maxPop) * WAVE_H * 0.85) : 0;
        html += '<div class="tl-g" data-g="'+g+'" style="width:'+COL_W+'px;height:'+WAVE_H+'px;flex-shrink:0;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;" title="第'+g+'世 '+pop+'人">';
        html += '<div style="width:100%;height:'+barH+'px;border-radius:1px 1px 0 0;background:'+(dc||'#3fb950')+';opacity:'+(pop>0?'0.9':'0.15')+';min-height:'+(pop>0?'2px':'0')+';transform-origin:bottom;animation:tlBarIn .45s cubic-bezier(.22,.9,.3,1) '+(i*0.008).toFixed(3)+'s both;"></div>';
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

      // 柱状图 + 稀疏标注在上，时代标注条在柱体下方
      wrap.innerHTML = html + legendHtml;
    } else {
      // ===== 桌面端：柱状图在上，朝代图例移到柱状图下方（用户要求）=====
      // wrap 恢复原始内联样式（flex row，min-height:240px），但只放一个列向子容器
      wrap.style.cssText = _origWrapStyle;

      // 时代标注条：无底色，数学标注两点间距离样式（细线+两端箭头+中间朝代名）
      legendHtml = buildLegend(gens, COL_W + GAP, 20, 9, GAP, 2, 10, 'var(--text-secondary)', 'var(--text-tertiary)');

      // 波形图：横轴世代，纵轴人数（内容高度，图例紧贴其下）
      html = '<div style="position:relative;padding:4px 0 0;min-height:'+(WAVE_H+30)+'px;">';
      // 波形区域
      html += '<div style="display:flex;align-items:flex-end;height:'+WAVE_H+'px;padding:0 2px;gap:1px;position:relative;">';
      gens.forEach(function(g, i) {
        var pop = genPop[g]||0;
        var names = genNames[g]||[];
        var keyName = findKeyName(g, names);
        var dc = getDynColor(g);
        var barH = pop > 0 ? Math.max(2, (pop / maxPop) * WAVE_H * 0.85) : 0;
        html += '<div class="tl-g" data-g="'+g+'" style="display:flex;flex-direction:column;align-items:center;cursor:pointer;position:relative;" title="第'+g+'世 '+pop+'人">';
        // 柱条 + 朝代色
        html += '<div style="width:'+COL_W+'px;height:'+barH+'px;border-radius:1px 1px 0 0;background:'+(dc||'#3fb950')+';opacity:'+(pop>0?'0.9':'0.15')+';transition:opacity 0.15s;min-height:'+(pop>0?'2px':'0')+';transform-origin:bottom;animation:tlBarIn .45s cubic-bezier(.22,.9,.3,1) '+(i*0.008).toFixed(3)+'s both;"></div>';
        // 世代号（颜色随主题：浅色主题深字、深色主题浅字，避免白字白底看不清）
        html += '<div style="font-size:7px;color:'+(pop>0?'var(--text-secondary)':'var(--text-tertiary)')+';line-height:1;margin-top:1px;white-space:nowrap;">'+g+'</div>';
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

    // 手机端全屏自动横屏 → 淡黄底浅色主题（用户：世代时间轴最大化横屏底色改淡黄，与世系图谱全屏一致；
    // 桌面端非紧凑保持原深底，红线不动桌面端）
    var LIGHT = isCompact();
    var ov = document.createElement('div');
    ov.id = 'tl-fs';
    if (LIGHT) ov.classList.add('tl-fs-landscape');
    ov.style.cssText = 'position:fixed;inset:0;z-index:200000;background:' + (LIGHT ? '#f8ecd1' : 'rgba(6,8,14,0.97)') + ';display:flex;flex-direction:column;color:' + (LIGHT ? '#5b3a10' : '#fff') + ';font-family:inherit;';

    var C_TXT = LIGHT ? '#5b3a10' : '#fff';
    var C_SEC = LIGHT ? '#8a6d3b' : 'rgba(255,255,255,0.45)';
    var C_BORDER = LIGHT ? 'rgba(139,106,59,0.25)' : 'rgba(255,255,255,0.08)';
    var head = '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid ' + C_BORDER + ';flex-shrink:0;">';
    head += '<div style="font-size:14px;font-weight:600;color:' + C_TXT + ';">📅 世代时间轴 <span style="font-size:11px;color:' + C_SEC + ';font-weight:400;margin-left:8px;">捏合/滚轮缩放 · 拖动平移 · 点击柱子查看该世族人</span></div>';
    head += '<button type="button" style="width:32px;height:32px;border-radius:50%;background:' + (LIGHT ? 'rgba(139,106,59,0.12)' : 'rgba(255,255,255,0.08)') + ';border:1px solid ' + (LIGHT ? 'rgba(139,106,59,0.3)' : 'rgba(255,255,255,0.2)') + ';color:' + C_TXT + ';font-size:18px;cursor:pointer;line-height:1;flex-shrink:0;">✕</button>';
    head += '</div>';

    // 时代标注条：无底色，数学标注两点间距离样式（浅色主题用深棕文字/线，深底主题用浅色）
    var legend = buildLegend(gens, FS_COL + FS_GAP, 22, 11, FS_GAP, 0, 10, LIGHT ? '#7a5a1e' : 'rgba(255,255,255,0.72)', LIGHT ? '#c8a24a' : 'rgba(255,255,255,0.32)');

    var wave = '<div style="display:flex;align-items:flex-end;gap:'+FS_GAP+'px;position:relative;">';
    gens.forEach(function(g, i) {
      var pop = genPop[g]||0;
      var dc = getDynColor(g);
      var barH = pop > 0 ? Math.max(3, (pop / maxPop) * FS_WAVE * 0.85) : 0;
      wave += '<div class="tl-fs-g" data-g="'+g+'" style="display:flex;flex-direction:column;justify-content:flex-end;align-items:center;cursor:pointer;" title="第'+g+'世 '+pop+'人">';
      wave += '<div style="width:'+FS_COL+'px;height:'+barH+'px;border-radius:3px 3px 0 0;background:'+(dc||'#3fb950')+';opacity:'+(pop>0?'0.95':'0.15')+';min-height:'+(pop>0?'3px':'0')+';transform-origin:bottom;animation:tlBarIn .45s cubic-bezier(.22,.9,.3,1) '+(i*0.008).toFixed(3)+'s both;"></div>';
      wave += '<div style="font-size:10px;color:' + (LIGHT ? '#8a6d3b' : 'rgba(255,255,255,0.55)') + ';margin-top:3px;line-height:1;white-space:nowrap;">'+g+'/'+(pop||0)+'</div>';
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
    var isRotated = false;   // CSS 假横屏旋转态（iOS/微信无锁 API 时 view rotate90）
    var MIN_S = 0.2, MAX_S = 6; // 下限低于初始适配比例，放大后可缩回整图
    function clampV(x,a,b){ return Math.max(a, Math.min(b, x)); }
    function apply(){ content.style.transform = 'translate('+TX.toFixed(1)+'px,'+TY.toFixed(1)+'px) scale('+S.toFixed(3)+')'; }
    // 旋转态视觉↔布局轴映射（实测对齐世系图谱已验证公式，视口 375×667 下实测：
    //   view rotate90 后视觉 bbox=375×614 恰落在 head(53px) 之下；布局轴 clientWidth/Height 保持旋转前=614×375）
    //   绝对：布局x = 视觉y(相对 view 视觉 rect 顶)、布局y = 视觉宽 − 视觉x
    //   增量：Δ布局x = +Δ视觉y、Δ布局y = −Δ视觉x（内容跟随手指，tl-test 实测：手指下移 60 → 柱体视觉下移 60）
    function toLayoutPoint(vx, vy) {
      if (!isRotated) return { x: vx, y: vy };
      var r = view.getBoundingClientRect();
      return { x: vy, y: r.width - vx };
    }
    function fit() {
      var vw, vh;
      if (isRotated) {
        var rr = view.getBoundingClientRect();
        vw = rr.width; vh = rr.height;   // 视觉 bbox（宽=竖屏视口宽、高=竖屏视口高−head）
      } else {
        vw = view.clientWidth; vh = view.clientHeight;
      }
      if (isRotated) {
        // 旋转态：view rotate90 后内容布局宽 naturalW→视觉高、布局高 naturalH→视觉宽。
        // ★TX/TY 必须换轴居中：TX 用视觉高、TY 用视觉宽。旧代码照搬非旋转态公式
        // (TY=(vh-naturalH*S)/2) → 布局 Y（映射到视觉 X）被推到视口左缘，108 根柱全挤在
        // 左侧 ~45px 竖带、绝大多数柱体在视口外 → 真机「全屏点某一代没反应」（点不到柱体）。
        // 换轴后柱列横屏居中、世代沿视觉纵向分布，柱体可点。
        S = clampV((vh - 12) / naturalW, 0.25, 1);
        TX = (vh - naturalW * S) / 2;
        TY = (vw - naturalH * S) / 2;
      } else {
        S = clampV((vw - 12) / naturalW, 0.25, 1);
        TX = (vw - naturalW*S) / 2;
        TY = Math.max(8, (vh - naturalH*S) / 2);
      }
      apply();
    }
    fit();

    // ===== 手机端：全屏自动横屏（真横屏成功→锁屏失败/无锁 API→CSS 假横屏） =====
    function tlTryLandscape() {
      if (!isCompact()) return;
      // 真横屏：Android Chrome requestFullscreen + orientation.lock('landscape') 成功则浏览器真实旋转视口，
      // 布局自然重排（无元素旋转，isRotated 保持 false）；旋转完成后触发 resize → onResize 重新 fit。
      function useFake() {
        if (isRotated) return;
        isRotated = true;
        _tlFakeRotated = true;   // 标记假横屏态：点代详情弹层同步旋转横屏
        var headEl = ov.firstElementChild;
        var headH = headEl ? headEl.offsetHeight : 53;
        var vw = window.innerWidth, vh = window.innerHeight;
        // view 旋转后视觉 bbox 恰好填满 head 之下（实测 viewVisual={x:0,y:headH,w:vw,h:vh-headH}）
        var cx = vw / 2, cy = headH + (vh - headH) / 2;
        view.style.position = 'absolute';
        view.style.top = cy + 'px';
        view.style.left = cx + 'px';
        view.style.width = (vh - headH) + 'px';
        view.style.height = vw + 'px';
        view.style.transform = 'translate(-50%,-50%) rotate(90deg)';
        view.style.transformOrigin = '50% 50%';
        view.classList.add('tl-fs-rotated');   // 仅状态标记，几何全走行内样式
        fit();
      }
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(function() {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').then(function() {}).catch(useFake);
          } else useFake();
        }).catch(useFake);
      } else useFake();
    }
    if (isCompact()) tlTryLandscape();

    // 真横屏/锁屏成功后 viewport 尺寸变化触发 resize → 重新适配（lock 异步，旋转完成时机不可靠，靠 resize 兜底）
    var onResize = function() { fit(); };
    window.addEventListener('resize', onResize);
    ov._onResize = onResize;
    // 浏览器原生手势退出全屏（Esc）→ 同步关闭弹层，避免残留旋转态
    var onFsChange = function() {
      if (!document.fullscreenElement && document.getElementById('tl-fs')) closeFullscreen();
    };
    document.addEventListener('fullscreenchange', onFsChange);
    ov._onFsChange = onFsChange;

    var pts = {}, lastPt = null, pinch = null, moved = 0, downX = 0, downY = 0;
    function dist(a,b){ return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)); }
    function mid(a,b){ return {x:(a.x+b.x)/2, y:(a.y+b.y)/2}; }
    view.addEventListener('pointerdown', function(e){
      try { view.setPointerCapture(e.pointerId); } catch(err){}
      pts[e.pointerId] = {x:e.clientX, y:e.clientY};
      moved = 0; downX = e.clientX; downY = e.clientY;
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
        if (isRotated) {
          // 旋转态：两端点中点（客户端坐标）→ view 视觉 rect 相对坐标 → 布局轴坐标，再按非旋转态同式锚定
          var pr = view.getBoundingClientRect();
          var l0 = toLayoutPoint(pinch.m0.x - pr.left, pinch.m0.y - pr.top);
          var lm = toLayoutPoint(m.x - pr.left, m.y - pr.top);
          TX = l0.x*pinch.s0 + pinch.t0x - lm.x*ns;
          TY = l0.y*pinch.s0 + pinch.t0y - lm.y*ns;
        } else {
          TX = pinch.m0.x*pinch.s0 + pinch.t0x - m.x*ns;
          TY = pinch.m0.y*pinch.s0 + pinch.t0y - m.y*ns;
        }
        S = ns; apply();
      } else if (ids.length === 1 && !pinch && lastPt) {
        // 平移始终可用（去掉 S>1.01 限制，解决“最大化后不能平移”），并夹紧在视图内防止拖丢。
        // 旋转态增量：Δ布局x=+Δ视觉y、Δ布局y=−Δ视觉x（内容跟随手指，tl-test 实测验证）
        var sw = naturalW * S, sh = naturalH * S;
        var dx = e.clientX - lastPt.x, dy = e.clientY - lastPt.y;
        var incX = isRotated ? dy : dx, incY = isRotated ? -dx : dy;
        TX = clampV(TX + incX, Math.min(0, view.clientWidth - sw), Math.max(0, view.clientWidth - sw));
        TY = clampV(TY + incY, Math.min(0, view.clientHeight - sh), Math.max(0, view.clientHeight - sh));
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
      // 旋转态：光标视觉点 → 布局轴坐标，保持光标下的内容点不动
      var lp = toLayoutPoint(vx, vy);
      TX = lp.x - (lp.x - TX)*(ns/S);
      TY = lp.y - (lp.y - TY)*(ns/S);
      S = ns; apply();
    }, {passive:false});
    view.addEventListener('dblclick', function(e){
      var ns = S > 1.5 ? 1 : 2.5;
      var r = view.getBoundingClientRect();
      var vx = e.clientX - r.left, vy = e.clientY - r.top;
      var lp = toLayoutPoint(vx, vy);
      TX = lp.x - (lp.x - TX)*(ns/S);
      TY = lp.y - (lp.y - TY)*(ns/S);
      S = ns; apply();
    });
    view.addEventListener('click', function(e){
      // ★触屏点柱失效根因修复：旧 `moved > 6` 是「pointermove 累计位移」——真机手指轻点微抖
      //   轻松累计 >6px，点击被当成拖拽吞掉（Playwright 合成 7px 微抖 tap 实测点不开详情）。
      //   改为「按下点→抬起点净位移 >12px 才算拖拽」：轻点微抖回到起点附近净位移小 → 正常点开；
      //   拖拽/平移净位移大 → 忽略该 click。downX/downY 在 pointerdown 记录。
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 12) return;
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
        // 最近柱容差（手机端柱宽仅 ~4px，手指微偏即点空）：距点击最近且 ≤14px 的柱也命中。
        // 柱纵向间距 ~8px，最近柱无歧义（≤4px 垂直半距），横偏也能容。
        if (!gEl) {
          var bd = 1e9, bg = null;
          for (var bj = 0; bj < bars.length; bj++) {
            var br2 = bars[bj].getBoundingClientRect();
            var dc = Math.hypot(e.clientX - (br2.left + br2.width / 2), e.clientY - (br2.top + br2.height / 2));
            if (dc < bd) { bd = dc; bg = bars[bj]; }
          }
          if (bg && bd <= 14) gEl = bg;
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
    _tlFakeRotated = false;   // 复位假横屏标志，后续详情弹层不再旋转
    if (ov._onKey) document.removeEventListener('keydown', ov._onKey);
    if (ov._onResize) window.removeEventListener('resize', ov._onResize);
    if (ov._onFsChange) document.removeEventListener('fullscreenchange', ov._onFsChange);
    ov.remove();
    // 恢复竖屏：退出真全屏 + 解锁横屏锁（CSS 假横屏的旋转样式随 view 一起移除）
    if (document.fullscreenElement) { try { document.exitFullscreen(); } catch(e){} }
    if (screen.orientation && screen.orientation.unlock) { try { screen.orientation.unlock(); } catch(e){} }
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
    var english = window.getLang && window.getLang() === 'en';
    var title = english ? 'Generation ' + gen + ' · ' + people.length + ' people' : gl+'第'+gen+'\u4e16 \u5171'+people.length+'\u4eba';
    var overlay=document.createElement('div'); overlay.className='person-detail-modal' + (_tlFakeRotated ? ' tl-fs-rotated-detail' : ''); overlay.onclick=function(ev){if(ev.target===overlay)overlay.remove();};
    var box=document.createElement('div'); box.className='person-detail-box'; box.style.maxWidth='550px';
    var inner='<div style="padding:20px;max-height:70vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h3 style="margin:0;font-family:var(--font-title);color:var(--accent-orange);font-size:18px;font-weight:600;">'+title+'</h3></div><div style="display:grid;gap:8px;" id="tl-people-list">';
    people.sort(function(a,b){return(a.name||'').localeCompare(b.name||'');});
    people.forEach(function(p){
      var pBg = p.is_alive==='是'?'rgba(220,38,38,0.06)':'rgba(0,0,0,0.1)';
      var displayName = english && window.englishPersonName ? window.englishPersonName(p) : p.name;
      inner += '<div onclick="showPersonDetail('+p.id+',getGenealogyData())" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:'+pBg+';border:1px solid '+(p.is_alive==='是'?'rgba(220,38,38,0.15)':'rgba(255,255,255,0.05)')+';border-radius:8px;cursor:pointer;"><div><span style="font-weight:600;color:var(--text-primary);">'+escapeHtml(displayName)+'</span><span style="font-size:12px;color:var(--text-tertiary);margin-left:8px;">'+(p.gender||'')+'</span></div><div style="font-size:12px;">'+(p.is_alive==='是'?'<span style="color:#ef4444;font-weight:600;">在世</span>':'<span style="color:var(--text-secondary);">已故</span>')+'<span style="margin-left:12px;color:var(--accent-orange);">→ 详情</span></div></div>';
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
