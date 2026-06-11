/* ============================================
   人物卡片瀑布流 — 族谱人物卡片展示
   竖向卡片布局 · 搜索筛选 · 响应式
   ============================================ */
(function () {
  'use strict';

  var container = null;
  var allData = [];
  var filteredData = [];
  var currentPage = 1;
  var pageSize = 48; // 每页显示人数
  var currentSort = 'generation'; // generation | name | branch
  var searchKeyword = '';
  var filterBranch = '';
  var filterGender = '';
  var filterAlive = '';
  var genFrom = 0, genTo = 999;

  var branchColors = {
    '前枫槎': '#6366f1',
    '后枫槎': '#22c55e',
    '石马': '#f59e0b'
  };

  function init() {
    container = document.getElementById('genealogy-cards-container');
    if (!container) return;
    loadData();
    createUI();
  }

  function loadData() {
    allData = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    if (!allData || allData.length === 0) {
      container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);font-size:13px;">暂无数据</div>';
      return false;
    }
    return true;
  }

  function createUI() {
    container.innerHTML = '';
    // 工具栏
    var toolbar = document.createElement('div');
    toolbar.className = 'gc-toolbar';
    toolbar.innerHTML =
      '<div class="gc-search-wrap">' +
        '<input type="text" class="gc-search" placeholder="搜索姓名..." id="gc-search-input">' +
      '</div>' +
      '<div class="gc-filters">' +
        '<select class="gc-filter" id="gc-filter-branch"><option value="">全部支系</option><option value="前枫槎">前枫槎</option><option value="后枫槎">后枫槎</option><option value="石马">石马</option></select>' +
        '<select class="gc-filter" id="gc-filter-gender"><option value="">全部性别</option><option value="男">男</option><option value="女">女</option></select>' +
        '<select class="gc-filter" id="gc-filter-alive"><option value="">全部状态</option><option value="是">在世</option><option value="否">已故</option></select>' +
        '<select class="gc-filter" id="gc-filter-gen-from">' +
          '<option value="0">世代从</option>' +
          '<option value="1">1世</option><option value="5">5世</option><option value="10">10世</option><option value="15">15世</option><option value="20">20世</option><option value="25">25世</option><option value="30">30世</option><option value="35">35世</option>' +
        '</select>' +
        '<select class="gc-filter" id="gc-filter-gen-to">' +
          '<option value="999">到</option>' +
          '<option value="5">5世</option><option value="10">10世</option><option value="15">15世</option><option value="20">20世</option><option value="25">25世</option><option value="30">30世</option><option value="35">35世</option><option value="51">51世</option>' +
        '</select>' +
      '</div>' +
      '<div class="gc-stats" id="gc-stats"></div>' +
      '<div class="gc-grid" id="gc-grid"></div>' +
      '<div class="gc-pagination" id="gc-pagination"></div>';

    container.appendChild(toolbar);

    // 绑定事件
    document.getElementById('gc-search-input').oninput = function () {
      searchKeyword = this.value.trim().toLowerCase();
      currentPage = 1;
      filterAndRender();
    };
    document.getElementById('gc-filter-branch').onchange = function () {
      filterBranch = this.value;
      currentPage = 1;
      filterAndRender();
    };
    document.getElementById('gc-filter-gender').onchange = function () {
      filterGender = this.value;
      currentPage = 1;
      filterAndRender();
    };
    document.getElementById('gc-filter-alive').onchange = function () {
      filterAlive = this.value;
      currentPage = 1;
      filterAndRender();
    };
    document.getElementById('gc-filter-gen-from').onchange = function () {
      genFrom = parseInt(this.value) || 0;
      currentPage = 1;
      filterAndRender();
    };
    document.getElementById('gc-filter-gen-to').onchange = function () {
      genTo = parseInt(this.value) || 999;
      currentPage = 1;
      filterAndRender();
    };

    filterAndRender();
  }

  function filterAndRender() {
    // 筛选
    filteredData = allData.filter(function (p) {
      if (searchKeyword && !(p.name && p.name.toLowerCase().indexOf(searchKeyword) >= 0)) return false;
      if (filterBranch && p.branch !== filterBranch) return false;
      if (filterGender && p.gender !== filterGender) return false;
      if (filterAlive) {
        if (filterAlive === '是' && p.is_alive !== '是') return false;
        if (filterAlive === '否' && (p.is_alive === '是' || !p.is_alive)) return false;
      }
      var g = parseInt(p.generation_num) || 0;
      if (g < genFrom || g > genTo) return false;
      return true;
    });

    // 排序：按世代
    filteredData.sort(function (a, b) {
      var ga = parseInt(a.generation_num) || 0;
      var gb = parseInt(b.generation_num) || 0;
      if (ga !== gb) return ga - gb;
      return (a.name || '').localeCompare(b.name || '');
    });

    // 更新统计
    var stats = document.getElementById('gc-stats');
    if (stats) {
      stats.textContent = '共 ' + filteredData.length + ' 人' + (filteredData.length !== allData.length ? '（全部 ' + allData.length + ' 人）' : '');
    }

    // 分页
    var totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    var start = (currentPage - 1) * pageSize;
    var pageData = filteredData.slice(start, start + pageSize);

    renderCards(pageData);
    renderPagination(totalPages);
  }

  function renderCards(data) {
    var grid = document.getElementById('gc-grid');
    if (!grid) return;
    if (data.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;padding:60px 20px;text-align:center;color:var(--text-muted);font-size:14px;">😶 没有找到匹配的族人</div>';
      return;
    }
    var html = '';
    data.forEach(function (p) {
      var gen = p.generation_num ? '第' + p.generation_num + '世' : '—';
      var genderIcon = p.gender === '女' ? '👩' : '👤';
      var statusColor = p.is_alive === '是' ? '#22c55e' : '#888';
      var statusText = p.is_alive === '是' ? '在世' : '已故';
      var branchColor = branchColors[p.branch] || 'var(--accent-orange)';
      var birthText = p.birth || '';
      var deathText = p.death || '';

      // 计算年龄
      var ageText = '';
      if (p.is_alive !== '是' && birthText && deathText) {
        var by = parseInt(birthText);
        var dy = parseInt(deathText);
        if (isNaN(by)) { var m = birthText.match(/(\d{3,4})年/); if (m) by = parseInt(m[1]); }
        if (isNaN(dy)) { var m = deathText.match(/(\d{3,4})年/); if (m) dy = parseInt(m[1]); }
        if (!isNaN(by) && !isNaN(dy) && dy > by) ageText = '享年' + (dy - by) + '岁';
      }

      html += '<div class="gc-card" onclick="showPersonDetail(' + p.id + ', getGenealogyData())" title="点击查看详情">';
      html += '<div class="gc-card-header" style="border-left:3px solid ' + branchColor + ';">';
      html += '<span class="gc-card-gen">' + gen + '</span>';
      html += '<span class="gc-card-name">' + escapeHtml(p.name || '') + '</span>';
      html += '<span class="gc-card-gender">' + genderIcon + '</span>';
      html += '</div>';
      html += '<div class="gc-card-body">';
      if (p.branch && p.branch !== '—') {
        html += '<span class="gc-card-tag" style="background:' + branchColor + '20;color:' + branchColor + ';border:1px solid ' + branchColor + '40;">' + escapeHtml(p.branch) + '</span>';
      }
      html += '<span class="gc-card-tag" style="background:' + statusColor + '20;color:' + statusColor + ';border:1px solid ' + statusColor + '40;">' + statusText + '</span>';
      if (ageText) {
        html += '<span class="gc-card-tag" style="background:rgba(100,100,255,0.1);color:#888;border:1px solid rgba(100,100,255,0.2);">' + ageText + '</span>';
      }
      if (birthText || deathText) {
        html += '<div class="gc-card-life">📅 ' + (birthText || '?') + ' — ' + (deathText || '?') + '</div>';
      }
      // 配偶
      if (p.spouse_ids) {
        var spouseNames = [];
        if (Array.isArray(p.spouse_ids)) {
          spouseNames = p.spouse_ids.map(function (sid) { return getPersonNameById(sid, allData) || sid; });
        } else {
          spouseNames = [String(p.spouse_ids)];
        }
        html += '<div class="gc-card-spouse">💑 ' + spouseNames.join('、') + '</div>';
      }
      html += '</div>';
      html += '</div>';
    });
    grid.innerHTML = html;
  }

  function renderPagination(totalPages) {
    var pag = document.getElementById('gc-pagination');
    if (!pag) return;
    if (totalPages <= 1) { pag.innerHTML = ''; return; }
    var html = '<div class="gc-pag-inner">';
    html += '<button class="gc-pag-btn" onclick="window._gcJump(' + (currentPage - 1) + ')" ' + (currentPage <= 1 ? 'disabled' : '') + '>◀ 上一页</button>';
    html += '<span class="gc-pag-info">' + currentPage + ' / ' + totalPages + '</span>';
    html += '<button class="gc-pag-btn" onclick="window._gcJump(' + (currentPage + 1) + ')" ' + (currentPage >= totalPages ? 'disabled' : '') + '>下一页 ▶</button>';
    html += '</div>';
    pag.innerHTML = html;
  }

  // 翻页函数（暴露给全局供 onclick 调用）
  window._gcJump = function (page) {
    currentPage = Math.max(1, page);
    filterAndRender();
    // 滚动到卡片区顶部
    var grid = document.getElementById('gc-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 工具函数
  function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  function getPersonNameById(id, data) {
    if (!id && id !== 0) return null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) return data[i].name;
    }
    return null;
  }

  // 初始化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
