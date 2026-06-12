/* ============================================
   Icicle 世系矩形图 — 每代一行，按人丁分块
   块宽度=后代人数 · 分支颜色 · 可点击缩放
   ============================================ */
(function () {
  'use strict';

  var container, data = [], allPeople = {};
  var focusId = null; // 当前聚焦的人物ID

  function init() {
    container = document.getElementById('genealogy-icicle-container');
    if (!container) return;
    container.style.cssText = 'position:relative;width:100%;overflow:auto;';
    loadData();
  }

  function loadData() {
    data = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    if (!data || !data.length) {
      container.innerHTML = '<div style="padding:60px;text-align:center;color:var(--text-muted);">暂无数据</div>';
      return;
    }
    // Build lookup
    allPeople = {};
    data.forEach(function (p) { allPeople[p.id] = p; });
    buildTree();
  }

  function getChildren(pid) {
    return data.filter(function (p) { return p.father_id === pid; });
  }

  function countDescendants(pid) {
    var count = 1;
    getChildren(pid).forEach(function (c) { count += countDescendants(c.id); });
    return count;
  }

  function buildTree() {
    // Find roots: people with no father_id in data
    var existingIds = {};
    data.forEach(function (p) { existingIds[p.id] = true; });
    var roots = data.filter(function (p) { return p.father_id == null || !existingIds[parseInt(p.father_id)]; });
    if (roots.length === 0 && data.length > 0) roots = [data[0]];

    // Prefer the root with Xie-family branches (枫槎/石马), fallback to the one with most descendants
    roots.sort(function (a, b) {
      var aIsXie = (a.branch && a.branch.indexOf('枫槎') >= 0) || (a.branch && a.branch.indexOf('石马') >= 0) || (a.name && a.name.indexOf('杲') >= 0) || (a.name && a.name.indexOf('彬') >= 0) || (a.name && a.name.indexOf('乾') >= 0) ? 1 : 0;
      var bIsXie = (b.branch && b.branch.indexOf('枫槎') >= 0) || (b.branch && b.branch.indexOf('石马') >= 0) || (b.name && b.name.indexOf('杲') >= 0) || (b.name && b.name.indexOf('彬') >= 0) || (b.name && b.name.indexOf('乾') >= 0) ? 1 : 0;
      if (aIsXie !== bIsXie) return bIsXie - aIsXie;
      return (b._descCount || 0) - (a._descCount || 0);
    });
    // Keep only top roots (max 2)
    if (roots.length > 2) roots = roots.slice(0, 2);

    // Sort roots by descendant count
    roots.forEach(function (r) { r._descCount = countDescendants(r.id); });
    roots.sort(function (a, b) { return b._descCount - a._descCount; });

    // Build the displayed tree data
    var maxDepth = 0;
    function calcDepth(pid, d) { if (d > maxDepth) maxDepth = d; getChildren(pid).forEach(function (c) { calcDepth(c.id, d + 1); }); }
    roots.forEach(function (r) { calcDepth(r.id, 0); });

    render(roots, maxDepth + 1);
  }

  function render(roots, totalDepth) {
    var ROW_H = 52;
    var W = container.clientWidth || 800;
    var totalH = (totalDepth + 1) * ROW_H + 80;

    var html = '<div style="position:relative;width:100%;min-height:' + totalH + 'px;">';

    // Back button when focused
    if (focusId) {
      html += '<div style="padding:8px 0;"><button onclick="window._icicleZoomOut()" style="padding:6px 16px;border-radius:6px;border:1px solid var(--accent-orange);background:transparent;color:var(--accent-orange);cursor:pointer;font-size:13px;">⟵ 返回总图</button> <span style="font-size:12px;color:var(--text-tertiary);margin-left:8px;">当前聚焦: ' + esc((allPeople[focusId] || {}).name || '') + '</span></div>';
    }

    // Collect all nodes per generation
    var genNodes = {};
    function collect(nodePid, gen) {
      if (!genNodes[gen]) genNodes[gen] = [];
      var person = allPeople[nodePid];
      if (!person) return;
      var desc = countDescendants(nodePid);
      genNodes[gen].push({ id: nodePid, name: person.name, branch: person.branch || '', desc: desc, hl: !!(person.highlight || /^(申伯|小四公|文杲公|攒公|撰公|彬公|乾公|谢安|谢玄|谢灵运|谢尚公|谢枋得|谢深甫)$/.test(person.name)) });
      getChildren(nodePid).forEach(function (c) { collect(c.id, gen + 1); });
    }
    roots.forEach(function (r) { collect(r.id, 0); });

    // Total descendants in first generation for proportional sizing
    var firstGenTotal = 1;
    if (genNodes[0]) genNodes[0].forEach(function (n) { firstGenTotal += n.desc - 1; });
    var baseW = Math.max(W, firstGenTotal * 3);

    // Draw each generation row
    for (var g = 0; g <= totalDepth; g++) {
      var nodes = genNodes[g] || [];
      if (nodes.length === 0) continue;

      var genTotal = 0;
      nodes.forEach(function (n) { genTotal += n.desc; });
      if (genTotal === 0) genTotal = 1;

      var y = 50 + g * ROW_H;

      // Generation label
      html += '<div style="position:absolute;left:0;top:' + (y + ROW_H / 2 - 7) + 'px;width:50px;font-size:11px;color:var(--text-tertiary);text-align:right;padding-right:8px;box-sizing:border-box;">' + (g + 1) + '世</div>';

      var x = 55;
      nodes.forEach(function (n) {
        var w = Math.max(4, (n.desc / genTotal) * baseW);

        var col = '#555';
        if (n.branch.indexOf('后枫槎') >= 0) col = '#22c55e';
        else if (n.branch.indexOf('前枫槎') >= 0) col = '#6366f1';
        else if (n.branch.indexOf('石马') >= 0) col = '#f59e0b';

        var bg = n.hl ? col : 'rgba(255,255,255,0.06)';
        var border = n.hl ? '2px solid ' + col : '1px solid ' + col + '30';

        html += '<div onclick="window._icicleClick(' + n.id + ')" title="' + esc(n.name) + ' · 后代' + (n.desc - 1) + '人" style="position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + (ROW_H - 4) + 'px;border-radius:4px;border:' + border + ';background:' + bg + ';cursor:pointer;overflow:hidden;display:flex;align-items:center;justify-content:center;transition:all 0.15s;" onmouseenter="this.style.boxShadow=\'0 0 12px ' + col + '40\'" onmouseleave="this.style.boxShadow=\'none\'">';

        if (w > 30) {
          var fs = w < 60 ? '10px' : w < 100 ? '11px' : w < 150 ? '12px' : '13px';
          var displayName = n.name;
          if (w < 80 && n.name.length > 4) displayName = n.name.substring(0, 3) + '..';
          else if (w < 50 && n.name.length > 2) displayName = n.name.substring(0, 2);
          html += '<span style="color:#fff;font-size:' + fs + ';font-weight:' + (n.hl ? '700' : '400') + ';text-align:center;line-height:1.2;padding:0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(displayName) + '</span>';
        }
        if (n.desc > 1 && w > 60) {
          html += '<span style="position:absolute;right:4px;bottom:2px;font-size:9px;color:rgba(255,255,255,0.5);">' + (n.desc - 1) + '</span>';
        }
        html += '</div>';
        x += w + 2;
      });
    }

    // Legend
    html += '<div style="position:absolute;bottom:0;left:55px;font-size:11px;color:var(--text-tertiary);display:flex;gap:16px;">';
    html += '<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#22c55e;vertical-align:middle;margin-right:4px;"></span>后枫槎</span>';
    html += '<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#6366f1;vertical-align:middle;margin-right:4px;"></span>前枫槎</span>';
    html += '<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#f59e0b;vertical-align:middle;margin-right:4px;"></span>石马</span>';
    html += '<span style="color:var(--text-muted);">块宽度=后代人数</span>';
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
  }

  // Click handler - zoom into a person
  window._icicleClick = function (id) {
    if (!allPeople[id]) return;
    focusId = id;
    // Rebuild tree from this person as root
    var fakeRoots = [allPeople[id]];
    var maxDepth = 0;
    function calcDepth(pid, d) { if (d > maxDepth) maxDepth = d; getChildren(pid).forEach(function (c) { calcDepth(c.id, d + 1); }); }
    calcDepth(id, 0);
    render(fakeRoots, maxDepth + 1);
  };

  window._icicleZoomOut = function () {
    try {
      focusId = null;
      buildTree();
    } catch(e) {
      // Reload from scratch on error
      if (document.getElementById('genealogy-icicle-container') && typeof getGenealogyData === 'function') {
        data = getGenealogyData();
        allPeople = {};
        data.forEach(function (p) { allPeople[p.id] = p; });
        buildTree();
      }
    }
  };

  function esc(t) { if (!t) return ''; var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  // Boot
  function boot() {
    try {
      if (document.getElementById('genealogy-icicle-container') && typeof getGenealogyData === 'function') init();
      else setTimeout(boot, 300);
    } catch (e) { setTimeout(boot, 500); }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(boot, 100);
  else document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });

})();
