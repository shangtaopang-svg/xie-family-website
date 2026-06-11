/* ============================================
   家族全景图 v6 — DOM方案
   每个人是一个div，关系连线SVG
   原生文字渲染永远清晰，拖拽缩放
   ============================================ */
(function () {
  'use strict';

  var container, wrap, svgLines, data = [];
  var gens = [], posMap = {};
  var sc = 1, ox = 0, oy = 0;
  var drag = false, dsx, dsy, dox, doy;

  var ROW = 76, LEFT = 80;

  function init() {
    container = document.getElementById('genealogy-overview-container');
    if (!container) return;
    container.style.cssText = 'position:relative;overflow:hidden;cursor:grab;background:var(--bg-primary);border-radius:8px;';

    // Create SVG for lines
    svgLines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgLines.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    container.appendChild(svgLines);

    // Create wrap for person nodes
    wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;top:0;left:0;transform-origin:0 0;z-index:2;';
    container.appendChild(wrap);

    load();
    setupEvents();

    window.addEventListener('resize', function () { if (data.length) render(); });
  }

  function load() {
    data = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    if (!data || !data.length) { container.innerHTML = '<div style="padding:60px;text-align:center;color:var(--text-muted);">暂无数据</div>'; return; }
    buildPositions();
    render();
  }

  function buildPositions() {
    var genMap = {};
    data.forEach(function (p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genMap[g]) genMap[g] = [];
      genMap[g].push(p);
    });
    gens = Object.keys(genMap).map(Number).sort(function (a, b) { return a - b; });

    var min = Math.min.apply(null, gens), max = Math.max.apply(null, gens);
    var all = [];
    for (var g = min; g <= max; g++) all.push(g);
    gens = all;

    var maxN = 1;
    gens.forEach(function (g) { var list = genMap[g] || []; if (list.length > maxN) maxN = list.length; });

    var CARD_W = Math.min(130, Math.max(60, 1000 / maxN));
    if (maxN < 20) CARD_W = Math.min(160, Math.max(80, 600 / maxN));

    posMap = {};
    gens.forEach(function (g) {
      var list = genMap[g] || [];
      var y = gens.indexOf(g) * ROW + ROW / 2;
      list.forEach(function (p, i) {
        var n = list.length || 1;
        var x = LEFT + (n > 1 ? i / (n - 1) : 0.5) * Math.max(n * CARD_W, 600);
        if (!p) return;
        posMap[p.id] = {
          x: x, y: y, gen: g,
          name: p.name, branch: p.branch || '',
          hl: !!(p.highlight || /^((申伯|小四公|文杲公|攒公|撰公|彬公|乾公|谢安|谢玄|谢灵运|谢尚公|谢枋得|谢深甫))$/.test(p.name)),
          father: p.father_id,
          gender: p.gender,
          alive: p.is_alive,
          id: p.id
        };
      });
    });

    var maxW = LEFT + 200;
    gens.forEach(function (g) {
      var list = genMap[g] || [];
      list.forEach(function (p) {
        var pos = posMap[p.id];
        if (pos && pos.x > maxW) maxW = pos.x;
      });
    });

    container._totalW = maxW + 200;
    container._totalH = gens.length * ROW + 80;
  }

  function render() {
    var W = container._totalW || 2000;
    var H = container._totalH || 2000;
    var cw = container.clientWidth || 1000;
    var ch = container.clientHeight || 500;

    var viewW = Math.max(cw, W);
    var viewH = Math.max(ch, H);

    container.style.width = viewW + 'px';
    container.style.height = viewH + 'px';

    // Render people
    var html = '';
    var gensDone = {};

    // Sort by generation
    var keys = Object.keys(posMap);
    keys.sort(function (a, b) { return (posMap[a].gen - posMap[b].gen) || (posMap[a].x - posMap[b].x); });

    keys.forEach(function (id) {
      var pos = posMap[id];
      if (!pos) return;
      var col = '#666';
      if (pos.branch.indexOf('后枫槎') >= 0) col = '#22c55e';
      else if (pos.branch.indexOf('前枫槎') >= 0) col = '#6366f1';
      else if (pos.branch.indexOf('石马') >= 0) col = '#f59e0b';

      var fontSize = pos.hl ? '13px' : '11px';
      var fontWeight = pos.hl ? '700' : '400';
      var bg = pos.hl ? col : 'rgba(255,255,255,0.06)';
      var w = pos.hl ? 'auto' : 'auto';
      var pad = pos.hl ? '4px 10px' : '2px 6px';
      var border = pos.hl ? '2px solid ' + col : '1px solid ' + col + '40';

      html += '<div class="gp-node" data-id="' + pos.id + '" style="position:absolute;left:' + pos.x + 'px;top:' + pos.y + 'px;transform:translate(-50%,-50%);padding:' + pad + ';border-radius:4px;border:' + border + ';background:' + bg + ';color:#fff;font-size:' + fontSize + ';font-weight:' + fontWeight + ';cursor:pointer;white-space:nowrap;z-index:' + (pos.hl ? 10 : 5) + ';">' + esc(pos.name) + '</div>';
    });

    wrap.innerHTML = html;

    // Render SVG lines
    var linesHtml = '';
    data.forEach(function (p) {
      if (p.father_id == null) return;
      var c = posMap[p.id], f = posMap[p.father_id];
      if (!c || !f) return;
      var y1 = f.y + ROW * 0.3;
      var y2 = c.y - ROW * 0.3;
      var x1 = f.x, x2 = c.x;
      var mx = (x1 + x2) / 2;
      linesHtml += '<path d="M' + x1 + ',' + y1 + ' Q' + mx + ',' + y1 + ' ' + mx + ',' + ((y1 + y2) / 2) + ' Q' + mx + ',' + y2 + ' ' + x2 + ',' + y2 + '" stroke="rgba(255,255,255,0.08)" stroke-width="1" fill="none"/>';
    });

    svgLines.innerHTML = linesHtml;
    svgLines.setAttribute('viewBox', '0 0 ' + viewW + ' ' + viewH);
    svgLines.style.width = viewW + 'px';
    svgLines.style.height = viewH + 'px';

    // Click handlers
    wrap.querySelectorAll('.gp-node').forEach(function (el) {
      el.onclick = function (e) {
        e.stopPropagation();
        var id = parseInt(this.getAttribute('data-id'));
        if (typeof showPersonDetail === 'function') showPersonDetail(id, data);
      };
      el.onmouseenter = function () { this.style.borderColor = '#fbbf24'; this.style.zIndex = '20'; };
      el.onmouseleave = function () {
        var col = '#666';
        var bid = parseInt(this.getAttribute('data-id'));
        var pos = posMap[bid];
        if (pos) {
          if (pos.branch.indexOf('后枫槎') >= 0) col = '#22c55e';
          else if (pos.branch.indexOf('前枫槎') >= 0) col = '#6366f1';
          else if (pos.branch.indexOf('石马') >= 0) col = '#f59e0b';
        }
        this.style.borderColor = col + '40';
        this.style.zIndex = pos && pos.hl ? '10' : '5';
      };
    });

    // Set wrap size
    wrap.style.width = viewW + 'px';
    wrap.style.height = viewH + 'px';

    applyTransform();
  }

  function applyTransform() {
    wrap.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + sc + ')';
    svgLines.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + sc + ')';
    svgLines.style.transformOrigin = '0 0';
    wrap.style.transformOrigin = '0 0';
  }

  function setupEvents() {
    var ctrl = document.createElement('div');
    ctrl.style.cssText = 'position:absolute;bottom:12px;right:12px;display:flex;gap:3px;z-index:20;';
    ctrl.innerHTML = '<button>+</button><button>−</button><button>⟳</button>';
    container.appendChild(ctrl);
    ctrl.querySelectorAll('button').forEach(function (b) { b.style.cssText = 'width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.55);color:#fff;font-size:16px;cursor:pointer;'; });
    ctrl.children[0].onclick = function () { zoom(sc * 1.5); };
    ctrl.children[1].onclick = function () { zoom(sc / 1.5); };
    ctrl.children[2].onclick = function () { sc = 1; ox = 0; oy = 0; applyTransform(); };

    container.onmousedown = function (e) { drag = true; dsx = e.clientX; dsy = e.clientY; dox = ox; doy = oy; container.style.cursor = 'grabbing'; };
    container.onmousemove = function (e) {
      if (drag) { ox = dox + (e.clientX - dsx); oy = doy + (e.clientY - dsy); applyTransform(); return; }
    };
    container.onmouseup = container.onmouseleave = function () { drag = false; container.style.cursor = 'grab'; };
    container.onwheel = function (e) {
      e.preventDefault();
      var r = container.getBoundingClientRect();
      var cx = e.clientX - r.left, cy = e.clientY - r.top;
      var ns = sc * (e.deltaY > 0 ? 0.88 : 1.12);
      ns = Math.max(0.1, Math.min(5, ns));
      if (ns === sc) return;
      ox = cx - (cx - ox) * ns / sc;
      oy = cy - (cy - oy) * ns / sc;
      sc = ns;
      applyTransform();
    };
  }

  function zoom(ns) {
    ns = Math.max(0.1, Math.min(5, ns));
    if (ns === sc) return;
    var r = container.getBoundingClientRect();
    ox = r.width / 2 - (r.width / 2 - ox) * ns / sc;
    oy = r.height / 2 - (r.height / 2 - oy) * ns / sc;
    sc = ns;
    applyTransform();
  }

  function esc(t) { if (!t) return ''; var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  function boot() {
    try {
      if (document.getElementById('genealogy-overview-container') && typeof getGenealogyData === 'function') init();
      else setTimeout(boot, 200);
    } catch (e) { setTimeout(boot, 500); }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(boot, 100);
  else document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });

})();
