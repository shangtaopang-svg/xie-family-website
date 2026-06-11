/* ============================================
   折叠世系 — 点击世代展开/收起
   竖向排列 · 手机友好 · 显示名字和关系
   ============================================ */
(function () {
  'use strict';

  var container, allData = [];
  var EXPANDED = {}; // generation -> true/false

  function init() {
    container = document.getElementById('genealogy-accordion-container');
    if (!container) return;
    loadData();
  }

  function loadData() {
    allData = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    if (!allData || allData.length === 0) {
      container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);font-size:14px;">暂无数据</div>';
      return;
    }
    render();
  }

  function getPersonName(id) {
    for (var i = 0; i < allData.length; i++) {
      if (allData[i].id === id) return allData[i].name;
    }
    return null;
  }

  function getChildren(fatherId) {
    return allData.filter(function (p) { return p.father_id === fatherId; });
  }

  function render() {
    // Group by generation
    var genMap = {};
    allData.forEach(function (p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genMap[g]) genMap[g] = [];
      genMap[g].push(p);
    });
    var gens = Object.keys(genMap).map(Number).sort(function (a, b) { return a - b; });

    var html = '<div class="ac-search">' +
      '<input type="text" id="ac-search-input" placeholder="搜索姓名..." style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--glass-border);background:var(--bg-card);color:var(--text-primary);font-size:14px;box-sizing:border-box;">' +
      '</div>' +
      '<div class="ac-stats" style="padding:8px 0;font-size:12px;color:var(--text-tertiary);">共 ' + allData.length + ' 人 · ' + gens.length + ' 世</div>' +
      '<div class="ac-list">';

    gens.forEach(function (g) {
      var list = genMap[g];
      var isOpen = EXPANDED[g] === true;

      html += '<div class="ac-gen" data-gen="' + g + '">';
      // Header row
      html += '<div class="ac-gen-header" onclick="window._acToggle(' + g + ')" style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-radius:6px;transition:background 0.15s;background:var(--glass-bg);border:1px solid var(--glass-border);margin-bottom:4px;">';
      html += '<span class="ac-arrow" style="transition:transform 0.2s;display:inline-block;' + (isOpen ? 'transform:rotate(90deg);' : '') + '">▶</span>';
      html += '<span style="font-weight:600;font-size:15px;color:var(--text-primary);">第 ' + g + ' 世</span>';
      html += '<span style="font-size:12px;color:var(--text-tertiary);">' + list.length + ' 人</span>';
      html += '<span style="margin-left:auto;font-size:11px;color:var(--text-muted);">' + (isOpen ? '收起' : '展开') + '</span>';
      html += '</div>';

      // Body (collapsible)
      html += '<div class="ac-gen-body" style="overflow:hidden;transition:max-height 0.3s ease;' + (isOpen ? 'max-height:20000px;' : 'max-height:0;') + '">';
      html += '<div style="padding:4px 12px 12px 32px;display:flex;flex-wrap:wrap;gap:4px;">';

      list.forEach(function (p) {
        var col = '#666';
        if (p.branch && p.branch.indexOf('后枫槎') >= 0) col = '#22c55e';
        else if (p.branch && p.branch.indexOf('前枫槎') >= 0) col = '#6366f1';
        else if (p.branch && p.branch.indexOf('石马') >= 0) col = '#f59e0b';

        var isHL = !!(p.highlight || /^(申伯|小四公|文杲公|攒公|撰公|彬公|乾公|谢安|谢玄|谢灵运|谢尚公|谢枋得|谢深甫)$/.test(p.name));
        var genderIcon = p.gender === '女' ? '👩' : '👤';
        var statusBadge = p.is_alive === '是' ? '<span style="font-size:10px;color:#22c55e;">🟢在世</span>' : '';

        // Children count
        var kids = getChildren(p.id);
        var kidsHtml = '';
        if (kids.length > 0) {
          var kidsNames = kids.map(function (k) { return '<span style="color:#999;font-size:11px;">' + k.name + '</span>'; }).join(', ');
          kidsHtml = '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;padding-left:4px;border-left:2px solid ' + col + ';">⬇ ' + kidsNames + '</div>';
        }

        // Spouse
        var spouseHtml = '';
        if (p.spouse_ids) {
          var spouses = [];
          if (Array.isArray(p.spouse_ids)) {
            spouses = p.spouse_ids.map(function (sid) { return getPersonName(sid) || sid; });
          } else {
            spouses = [String(p.spouse_ids)];
          }
          spouseHtml = '<span style="font-size:11px;color:var(--text-muted);">💑 ' + spouses.join(', ') + '</span>';
        }

        html += '<div onclick="showPersonDetail(' + p.id + ', getGenealogyData())" style="cursor:pointer;padding:6px 10px;border-radius:6px;border:1px solid ' + col + '40;background:' + (isHL ? col + '15' : 'transparent') + ';min-width:100px;transition:background 0.15s;" onmouseover="this.style.background=\'' + col + '25\'" onmouseout="this.style.background=\'' + (isHL ? col + '15' : 'transparent') + '\'">';
        html += '<div style="display:flex;align-items:center;gap:4px;">';
        html += '<span>' + genderIcon + '</span>';
        html += '<span style="font-weight:' + (isHL ? '700' : '400') + ';font-size:13px;color:var(--text-primary);">' + esc(p.name) + '</span>';
        html += ' ' + statusBadge;
        html += '</div>';
        if (spouseHtml) html += spouseHtml;
        if (kidsHtml) html += kidsHtml;
        html += '</div>';
      });

      html += '</div></div></div>';
    });

    html += '</div>';
    container.innerHTML = html;

    // Search handler
    var searchInput = document.getElementById('ac-search-input');
    if (searchInput) {
      searchInput.oninput = function () {
        var q = this.value.trim().toLowerCase();
        document.querySelectorAll('.ac-gen').forEach(function (gen) {
          if (!q) {
            gen.style.display = '';
            return;
          }
          var match = false;
          gen.querySelectorAll('.ac-gen-body > div > div').forEach(function (card) {
            var name = card.textContent.toLowerCase();
            if (name.indexOf(q) >= 0) {
              match = true;
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
          gen.style.display = match ? '' : 'none';
        });
      };
    }
  }

  function toggleGen(g) {
    EXPANDED[g] = !EXPANDED[g];
    // Re-render just this generation
    var genEl = document.querySelector('.ac-gen[data-gen="' + g + '"]');
    if (genEl) {
      var body = genEl.querySelector('.ac-gen-body');
      var arrow = genEl.querySelector('.ac-arrow');
      var label = genEl.querySelector('.ac-gen-header > span:last-child');
      if (EXPANDED[g]) {
        body.style.maxHeight = '20000px';
        arrow.style.transform = 'rotate(90deg)';
        if (label) label.textContent = '收起';
      } else {
        body.style.maxHeight = '0';
        arrow.style.transform = '';
        if (label) label.textContent = '展开';
      }
    }
  }

  window._acToggle = toggleGen;

  function esc(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  // Boot
  function boot() {
    try {
      if (document.getElementById('genealogy-accordion-container') && typeof getGenealogyData === 'function') init();
      else setTimeout(boot, 300);
    } catch (e) { setTimeout(boot, 500); }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(boot, 100);
  else document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });

})();
