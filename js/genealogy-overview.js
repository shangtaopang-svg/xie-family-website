/* ============================================
   家族世代全景图 v7 — 精简DOM方案
   ============================================ */
(function () {
  'use strict';

  var CONTAINER_ID = 'genealogy-overview-container';

  function boot() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) { setTimeout(boot, 300); return; }
    if (typeof getGenealogyData !== 'function') { setTimeout(boot, 300); return; }

    try {
      var data = getGenealogyData();
      if (!data || !data.length) {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);">暂无数据</div>';
        return;
      }

      container.innerHTML = '';
      container.style.cssText = 'position:relative;overflow:hidden;cursor:grab;background:var(--bg-primary);border-radius:8px;min-height:400px;';

      var total = data.length;
      var info = document.createElement('div');
      info.style.cssText = 'padding:20px;text-align:center;color:var(--text-tertiary);';
      info.textContent = '共 ' + total + ' 人，正在生成全景图…';
      container.appendChild(info);

      // Process data
      var genMap = {};
      data.forEach(function (p) {
        var g = parseInt(p.generation_num) || 0;
        if (!genMap[g]) genMap[g] = [];
        genMap[g].push(p);
      });
      var gens = Object.keys(genMap).map(Number).sort(function (a, b) { return a - b; });
      var min = Math.min.apply(null, gens), max = Math.max.apply(null, gens);
      var allGens = [];
      for (var g = min; g <= max; g++) allGens.push(g);
      gens = allGens;

      info.textContent = '共 ' + total + ' 人 · ' + gens.length + ' 世，生成中…';

      // Calculate positions
      var maxN = 1;
      gens.forEach(function (g) { var l = genMap[g] || []; if (l.length > maxN) maxN = l.length; });
      var CARD_W = Math.min(120, Math.max(50, 800 / maxN));
      if (maxN < 20) CARD_W = Math.min(150, Math.max(70, 500 / maxN));
      var ROW = 68, LEFT = 70;

      var posMap = {};
      var maxWidth = LEFT + 50;
      gens.forEach(function (g) {
        var list = genMap[g] || [];
        var y = gens.indexOf(g) * ROW + ROW / 2 + 10;
        list.forEach(function (p, i) {
          var n = list.length || 1;
          var x = LEFT + (n > 1 ? i / (n - 1) : 0.5) * Math.max(n * CARD_W, 400);
          if (x > maxWidth) maxWidth = x;
          if (!p) return;
          posMap[p.id] = {
            x: x, y: y, gen: g,
            name: p.name, branch: p.branch || '',
            hl: !!(p.highlight || /^(申伯|小四公|文杲公|攒公|撰公|彬公|乾公|谢安|谢玄|谢灵运|谢尚公|谢枋得|谢深甫)$/.test(p.name)),
            father: p.father_id, id: p.id
          };
        });
      });

      info.style.display = 'none';

      // Build HTML
      var viewW = Math.max(container.clientWidth || 1000, maxWidth + 200);
      var viewH = gens.length * ROW + 100;

      // SVG overlay for lines
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', viewW);
      svg.setAttribute('height', viewH);
      svg.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:1;display:block;';

      var pathHtml = '';
      data.forEach(function (p) {
        if (p.father_id == null) return;
        var c = posMap[p.id], f = posMap[p.father_id];
        if (!c || !f) return;
        var y1 = f.y + ROW * 0.3;
        var y2 = c.y - ROW * 0.3;
        var mx = (f.x + c.x) / 2;
        pathHtml += '<path d="M' + f.x + ',' + y1 + ' Q' + mx + ',' + y1 + ' ' + mx + ',' + ((y1 + y2) / 2) + ' Q' + mx + ',' + y2 + ' ' + c.x + ',' + y2 + '" stroke="rgba(255,255,255,0.08)" stroke-width="1" fill="none"/>';
      });
      svg.innerHTML = pathHtml;

      // Wrapper for people
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:absolute;top:0;left:0;z-index:2;';
      wrap.style.width = viewW + 'px';
      wrap.style.height = viewH + 'px';

      var nodesHtml = '';
      var ids = Object.keys(posMap);
      ids.sort(function (a, b) { return (posMap[a].gen - posMap[b].gen) || (posMap[a].x - posMap[b].x); });

      ids.forEach(function (id) {
        var pos = posMap[id];
        var col = '#666';
        if (pos.branch.indexOf('后枫槎') >= 0) col = '#22c55e';
        else if (pos.branch.indexOf('前枫槎') >= 0) col = '#6366f1';
        else if (pos.branch.indexOf('石马') >= 0) col = '#f59e0b';

        var style = 'position:absolute;left:' + pos.x + 'px;top:' + pos.y + 'px;transform:translate(-50%,-50%);';
        style += 'padding:' + (pos.hl ? '4px 10px' : '2px 6px') + ';border-radius:4px;';
        style += 'border:1px solid ' + col + '40;background:' + (pos.hl ? col : 'rgba(255,255,255,0.06)') + ';';
        style += 'color:#fff;font-size:' + (pos.hl ? '13px' : '11px') + ';font-weight:' + (pos.hl ? '700' : '400') + ';';
        style += 'cursor:pointer;white-space:nowrap;z-index:' + (pos.hl ? 10 : 5) + ';';
        nodesHtml += '<div class="gp-node" data-id="' + pos.id + '" style="' + style + '">' + esc(pos.name) + '</div>';
      });
      wrap.innerHTML = nodesHtml;

      container.appendChild(svg);
      container.appendChild(wrap);

      // Event handlers
      var ox = 0, oy = 0, sc = 1;
      var dragging = false, dsx, dsy, dox, doy;

      function transform() {
        wrap.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + sc + ')';
        svg.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + sc + ')';
      }

      container.onmousedown = function (e) {
        dragging = true; dsx = e.clientX; dsy = e.clientY; dox = ox; doy = oy;
        container.style.cursor = 'grabbing';
      };
      container.onmousemove = function (e) {
        if (!dragging) return;
        ox = dox + (e.clientX - dsx); oy = doy + (e.clientY - dsy); transform();
      };
      container.onmouseup = container.onmouseleave = function () {
        dragging = false; container.style.cursor = 'grab';
      };
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
        transform();
      };

      // Click person
      wrap.querySelectorAll('.gp-node').forEach(function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          var id = parseInt(this.getAttribute('data-id'));
          if (typeof showPersonDetail === 'function') showPersonDetail(id, data);
        };
        el.onmouseenter = function () { this.style.borderColor = '#fbbf24'; this.style.zIndex = '20'; };
        el.onmouseleave = function () {
          var bid = parseInt(this.getAttribute('data-id'));
          var pp = posMap[bid];
          var col = '#666';
          if (pp && pp.branch.indexOf('后枫槎') >= 0) col = '#22c55e';
          else if (pp && pp.branch.indexOf('前枫槎') >= 0) col = '#6366f1';
          else if (pp && pp.branch.indexOf('石马') >= 0) col = '#f59e0b';
          this.style.borderColor = col + '40';
          this.style.zIndex = (pp && pp.hl) ? '10' : '5';
        };
      });

      // Zoom buttons
      var z = document.createElement('div');
      z.style.cssText = 'position:absolute;bottom:12px;right:12px;display:flex;gap:3px;z-index:20;';
      z.innerHTML = '<button>+</button><button>−</button><button>⟳</button>';
      container.appendChild(z);
      z.querySelectorAll('button').forEach(function (b) { b.style.cssText = 'width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.55);color:#fff;font-size:16px;cursor:pointer;'; });
      z.children[0].onclick = function () {
        sc = Math.min(5, sc * 1.5);
        var r = container.getBoundingClientRect();
        ox = r.width / 2 - (r.width / 2 - ox) * (sc / (sc / 1.5));
        transform();
      };
      z.children[1].onclick = function () {
        sc = Math.max(0.1, sc / 1.5);
        transform();
      };
      z.children[2].onclick = function () { sc = 1; ox = 0; oy = 0; transform(); };

      container.style.width = viewW + 'px';
      container.style.height = viewH + 'px';

    } catch (e) {
      container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);font-size:13px;">加载出错: ' + e.message + '</div>';
    }
  }

  function esc(t) { if (!t) return ''; var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

 if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(boot, 200);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 200); });
  }

})();
