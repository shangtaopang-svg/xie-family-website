/* ============================================
   家族世代全景图 — Canvas 绘制
   纵向展示谢氏36世全貌 · 拖拽缩放 · 连线父子
   ============================================ */
(function () {
  'use strict';

  var canvas, ctx, container, infoEl;
  var allData = [];
  var isReady = false;

  // 画布状态
  var offsetX = 0, offsetY = 0;
  var scale = 1;
  var MIN_SCALE = 0.3, MAX_SCALE = 3;
  var isDragging = false, dragStartX, dragStartY, dragOX, dragOY;

  // 布局数据
  var genData = {};      // generation -> {people:[], count:N}
  var genKeys = [];      // sorted generation numbers
  var personPos = {};    // person id -> {x, y, gen}

  var ROW_H = 70;        // 每行高度
  var COL_W = 36;        // 每个人占宽
  var PAD_LEFT = 80;     // 左侧世代标号宽度
  var HIGHLIGHT_NAMES = ['申伯','小四公','文杲公','攒公','撰公','彬公','乾公','谢安','谢玄','谢灵运','谢尚公','谢枋得','谢深甫'];

  var BRANCH_COLORS = {
    '后枫槎': '#22c55e',
    '前枫槎': '#6366f1',
    '石马':   '#f59e0b'
  };

  function init() {
    container = document.getElementById('genealogy-overview-container');
    if (!container) return;

    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.cursor = 'grab';

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // 信息浮层
    infoEl = document.createElement('div');
    infoEl.style.cssText = 'position:absolute;pointer-events:none;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;line-height:1.7;border:1px solid rgba(255,255,255,0.12);opacity:0;transition:opacity 0.15s;z-index:10;max-width:220px;';
    container.appendChild(infoEl);

    // 控制按钮
    var ctrl = document.createElement('div');
    ctrl.style.cssText = 'position:absolute;bottom:12px;right:12px;display:flex;gap:4px;z-index:5;';
    ctrl.innerHTML =
      '<button class="ov-btn" title="放大">+</button>' +
      '<button class="ov-btn" title="缩小">−</button>' +
      '<button class="ov-btn" title="重置">⟳</button>';
    container.appendChild(ctrl);
    ctrl.querySelectorAll('.ov-btn').forEach(function (b) { b.style.cssText = 'width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.6);color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);'; });
    ctrl.children[0].onclick = function () { zoomAt(scale * 1.4, container.clientWidth / 2, container.clientHeight / 2); };
    ctrl.children[1].onclick = function () { zoomAt(scale / 1.4, container.clientWidth / 2, container.clientHeight / 2); };
    ctrl.children[2].onclick = function () { scale = 1; offsetX = 0; offsetY = 0; draw(); };

    // 鼠标/触控事件
    canvas.onmousedown = onDragStart;
    canvas.onmousemove = onDragMove;
    canvas.onmouseup = onDragEnd;
    canvas.onmouseleave = onDragEnd;
    canvas.onwheel = onWheel;
    canvas.onclick = onCanvasClick;

    loadData();
    window.addEventListener('resize', debounce(function () { if (isReady) resize(); }, 300));
  }

  function loadData() {
    allData = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    if (!allData || allData.length === 0) {
      container.innerHTML = '<div style="padding:60px;text-align:center;color:var(--text-muted);font-size:14px;">暂无数据</div>';
      return;
    }

    // 按世代分组
    genData = {};
    allData.forEach(function (p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genData[g]) genData[g] = { people: [], count: 0 };
      genData[g].people.push(p);
      genData[g].count++;
    });
    genKeys = Object.keys(genData).map(Number).sort(function (a, b) { return a - b; });

    // 计算每个人位置
    personPos = {};
    genKeys.forEach(function (g) {
      var list = genData[g].people;
      // 按分支排序后再按名字
      list.sort(function (a, b) {
        var ba = (a.branch || '').indexOf('后枫槎') >= 0 ? 0 : (a.branch || '').indexOf('前枫槎') >= 0 ? 1 : 2;
        var bb = (b.branch || '').indexOf('后枫槎') >= 0 ? 0 : (b.branch || '').indexOf('前枫槎') >= 0 ? 1 : 2;
        if (ba !== bb) return ba - bb;
        return (a.name || '').localeCompare(b.name || '');
      });
      list.forEach(function (p, idx) {
        var total = list.length;
        var centerX = PAD_LEFT + (total > 1 ? (idx / (total - 1)) : 0.5) * 600;
        personPos[p.id] = { x: centerX, y: genKeys.indexOf(g) * ROW_H + ROW_H / 2, gen: g, idx: idx, total: total };
      });
    });

    isReady = true;
    resize();
  }

  function resize() {
    var rect = container.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var totalH = genKeys.length * ROW_H + 40;
    var totalW = 800;
    canvas.width = Math.max(totalW, rect.width) * dpr;
    canvas.height = Math.max(totalH, rect.height) * dpr;
    canvas.style.width = (canvas.width / dpr) + 'px';
    canvas.style.height = (canvas.height / dpr) + 'px';
    ctx.scale(dpr, dpr);
    draw();
  }

  // ---- 绘制 ----
  function draw() {
    var W = canvas.width / (window.devicePixelRatio || 1);
    var H = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    var totalH = genKeys.length * ROW_H;
    var totalW = W / scale;

    // 背景
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(-PAD_LEFT - 20, -40, totalW + 200, totalH + 80);

    // 绘制连线（先画线再画人，线在人后）
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.8;
    allData.forEach(function (p) {
      if (p.father_id == null) return;
      var childPos = personPos[p.id];
      var parentPos = personPos[p.father_id];
      if (!childPos || !parentPos) return;
      var genIdx = genKeys.indexOf(parentPos.gen);
      var genIdx2 = genKeys.indexOf(childPos.gen);
      if (genIdx < 0 || genIdx2 < 0) return;

      var y1 = parentPos.y + ROW_H * 0.4;
      var y2 = childPos.y - ROW_H * 0.4;
      var x1 = parentPos.x;
      var x2 = childPos.x;

      // 曲线连线
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      var cpx = (x1 + x2) / 2;
      ctx.bezierCurveTo(cpx, y1, cpx, y2, x2, y2);
      ctx.stroke();
    });

    // 绘制世代行背景
    genKeys.forEach(function (g, idx) {
      var y = idx * ROW_H;
      if (idx % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(-PAD_LEFT - 20, y, totalW + 200, ROW_H);
      }
      // 世代标号
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(g + '世', -10, y + ROW_H / 2);

      // 人数小字
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '10px sans-serif';
      ctx.fillText(genData[g].count + '人', -10, y + ROW_H / 2 + 14);
    });

    // 绘制每个人
    genKeys.forEach(function (g) {
      genData[g].people.forEach(function (p) {
        var pos = personPos[p.id];
        if (!pos) return;
        var x = pos.x, y = pos.y;
        var radius = 14;
        var isHighlight = HIGHLIGHT_NAMES.indexOf(p.name) >= 0 || (p.highlight === true);

        // 分支颜色
        var color = '#555';
        if (p.branch) {
          if (p.branch.indexOf('后枫槎') >= 0) color = BRANCH_COLORS['后枫槎'];
          else if (p.branch.indexOf('前枫槎') >= 0) color = BRANCH_COLORS['前枫槎'];
          else if (p.branch.indexOf('石马') >= 0) color = BRANCH_COLORS['石马'];
        }

        if (isHighlight) {
          // 高亮人物 — 大圆 + 外发光
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(x, y, radius + 2, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = '#fff';
          ctx.fill();

          ctx.fillStyle = color;
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.name.charAt(0), x, y);

          // 名字标注
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(p.name, x, y + radius + 4);
        } else {
          // 普通人物 — 小圆点
          var dotR = Math.max(4, Math.min(8, 30 / Math.max(genData[g].count, 1)));
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.6;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
    });

    ctx.restore();
  }

  // ---- 拖拽 ----
  function onDragStart(e) {
    isDragging = true;
    container.style.cursor = 'grabbing';
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOX = offsetX;
    dragOY = offsetY;
  }
  function onDragMove(e) {
    if (!isDragging) return;
    offsetX = dragOX + (e.clientX - dragStartX);
    offsetY = dragOY + (e.clientY - dragStartY);
    draw();
  }
  function onDragEnd() {
    isDragging = false;
    container.style.cursor = 'grab';
  }

  // ---- 滚轮缩放 ----
  function onWheel(e) {
    e.preventDefault();
    var delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoomAt(scale * delta, e.clientX - container.getBoundingClientRect().left, e.clientY - container.getBoundingClientRect().top);
  }

  function zoomAt(newScale, cx, cy) {
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    if (newScale === scale) return;
    offsetX = cx - (cx - offsetX) * newScale / scale;
    offsetY = cy - (cy - offsetY) * newScale / scale;
    scale = newScale;
    draw();
  }

  // ---- 点击人物 ----
  function onCanvasClick(e) {
    // 如果刚拖拽过，不触发点击
    if (isDragging) return;
    var rect = container.getBoundingClientRect();
    var mx = (e.clientX - rect.left - offsetX) / scale;
    var my = (e.clientY - rect.top - offsetY) / scale;

    // 找最近的人
    var closest = null, minDist = 30;
    allData.forEach(function (p) {
      var pos = personPos[p.id];
      if (!pos) return;
      var dx = mx - pos.x, dy = my - pos.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    });

    if (closest && typeof showPersonDetail === 'function') {
      showPersonDetail(closest.id, allData);
    }
  }

  function debounce(fn, delay) {
    var timer;
    return function () { clearTimeout(timer); timer = setTimeout(fn, delay); };
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 200);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 200); });
  }

})();
