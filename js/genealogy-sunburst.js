/* ============================================
   环形繁衍图（Sunburst）— Canvas 绘制
   展示谢氏36世的人口繁衍分布
   ============================================ */
(function () {
  'use strict';

  var canvas, ctx, container, infoEl;
  var allData = [];
  var isReady = false;

  // 配色方案（按分支）
  var BRANCH_COLORS = {
    '后枫槎': { fill: '#22c55e', stroke: '#166534', label: '#22c55e' },
    '前枫槎': { fill: '#6366f1', stroke: '#3730a3', label: '#818cf8' },
    '石马':   { fill: '#f59e0b', stroke: '#92400e', label: '#fbbf24' },
    'default':{ fill: '#ef4444', stroke: '#991b1b', label: '#f87171' }
  };

  // 按世代分配颜色明度
  var GEN_COLORS = [
    '#ef4444','#f97316','#f59e0b','#22c55e','#14b8a6',
    '#06b6d4','#3b82f6','#6366f1','#8b5cf6','#a855f7',
    '#d946ef','#ec4899','#f43f5e','#e11d48','#be123c'
  ];

  function init() {
    container = document.getElementById('genealogy-sunburst-container');
    if (!container) return;

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // 信息提示
    infoEl = document.createElement('div');
    infoEl.className = 'gs-info';
    infoEl.style.cssText = 'position:absolute;pointer-events:none;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;line-height:1.7;border:1px solid rgba(255,255,255,0.12);opacity:0;transition:opacity 0.2s;z-index:10;max-width:220px;';
    container.appendChild(infoEl);

    loadData();
    window.addEventListener('resize', debounce(function () { if (isReady) resize(); }, 300));
  }

  function loadData() {
    allData = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    if (!allData || allData.length === 0) {
      container.innerHTML = '<div style="padding:60px 20px;text-align:center;color:var(--text-muted);font-size:14px;">暂无族谱数据</div>';
      return;
    }
    isReady = true;
    resize();
  }

  function resize() {
    var rect = container.getBoundingClientRect();
    var size = Math.min(rect.width, 600);
    var dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);
    draw(size);
  }

  // ---- 构建树结构 ----
  function buildTree(data) {
    var root = { id: 'root', name: '谢氏始祖', children: [], generation: 0, count: 0 };
    var map = {};

    // 先建立 id 映射
    data.forEach(function (p) {
      map[p.id] = { id: p.id, name: p.name, gen: parseInt(p.generation_num) || 0, branch: p.branch || '', data: p, children: [], count: 0 };
    });

    // 建立父子关系
    data.forEach(function (p) {
      var node = map[p.id];
      if (!node) return;
      if (p.father_id && map[p.father_id]) {
        map[p.father_id].children.push(node);
      } else if (p.father_id === null || p.father_id === undefined) {
        // 没有父亲 = 始祖
        root.children.push(node);
      }
    });

    // 如果 root 没有子节点（数据没有 father_id 关系），按世代分组统计
    if (root.children.length === 0) {
      return buildByGeneration(data);
    }

    // 统计各节点后代数量
    function countDescendants(node) {
      var total = 1; // 自己
      node.children.forEach(function (c) {
        total += countDescendants(c);
      });
      node.count = total;
      return total;
    }
    root.children.forEach(function (c) { countDescendants(c); });
    root.count = data.length;

    return root;
  }

  // ---- 按世代分组（当没有父子关系数据时） ----
  function buildByGeneration(data) {
    var genMap = {};
    data.forEach(function (p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genMap[g]) genMap[g] = [];
      genMap[g].push(p);
    });

    var gens = Object.keys(genMap).map(Number).sort(function (a, b) { return a - b; });
    var root = { id: 'root', name: '谢氏', children: [], generation: 0, count: data.length };
    gens.forEach(function (g) {
      var genNode = {
        id: 'gen_' + g, name: '第' + g + '世',
        generation: g, count: genMap[g].length,
        children: genMap[g].map(function (p) {
          return { id: p.id, name: p.name, generation: g, branch: p.branch || '', count: 1, data: p, children: [] };
        })
      };
      root.children.push(genNode);
    });
    return root;
  }

  // ---- 绘制 ----
  function draw(size) {
    var cx = size / 2, cy = size / 2;
    var maxR = Math.min(cx, cy) - 30;
    ctx.clearRect(0, 0, size, size);

    var tree = buildTree(allData);
    if (!tree || tree.children.length === 0) {
      ctx.fillStyle = '#888';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('暂无数据', cx, cy);
      return;
    }

    // 计算最大世代数
    var maxGen = 0;
    allData.forEach(function (p) {
      var g = parseInt(p.generation_num) || 0;
      if (g > maxGen) maxGen = g;
    });

    var genCount = maxGen + 1;
    var ringHeight = Math.min(maxR / genCount, 18);

    // 按世代分组统计
    var genStats = {};
    allData.forEach(function (p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genStats[g]) genStats[g] = { total: 0, branchCount: {} };
      genStats[g].total++;
      var b = p.branch || '其他';
      if (!genStats[g].branchCount[b]) genStats[g].branchCount[b] = 0;
      genStats[g].branchCount[b]++;
    });

    // 找到人口最多的世代用于比例
    var maxPop = 1;
    Object.keys(genStats).forEach(function (g) {
      if (genStats[g].total > maxPop) maxPop = genStats[g].total;
    });

    var gens = Object.keys(genStats).map(Number).sort(function (a, b) { return a - b; });

    // 绘制同心环世代
    var totalAngle = 2 * Math.PI;
    var startAngle = -Math.PI / 2;
    var segments = [];

    gens.forEach(function (g) {
      var stats = genStats[g];
      var innerR = g * ringHeight;
      var outerR = (g + 1) * ringHeight;

      // 获取该世代的各分支人数
      var branches = Object.keys(stats.branchCount);
      var currentAngle = startAngle;

      branches.forEach(function (branch) {
        var count = stats.branchCount[branch];
        var angle = totalAngle * (count / stats.total);

        // 选择颜色
        var colorInfo = BRANCH_COLORS['default'];
        if (branch.indexOf('后枫槎') >= 0) colorInfo = BRANCH_COLORS['后枫槎'];
        else if (branch.indexOf('前枫槎') >= 0) colorInfo = BRANCH_COLORS['前枫槎'];
        else if (branch.indexOf('石马') >= 0) colorInfo = BRANCH_COLORS['石马'];

        // 世代明暗变化
        var brightness = 0.6 + (g / Math.max(maxGen, 1)) * 0.4;

        segments.push({
          g: g, branch: branch, count: count,
          innerR: innerR, outerR: outerR,
          startAngle: currentAngle, endAngle: currentAngle + angle,
          color: colorInfo.fill, brightness: brightness
        });

        currentAngle += angle;
      });
    });

    // 绘制所有扇形
    segments.forEach(function (seg) {
      var r1 = seg.innerR, r2 = seg.outerR;
      var a1 = seg.startAngle, a2 = seg.endAngle;

      ctx.beginPath();
      // 外弧
      ctx.arc(cx, cy, r2, a1, a2);
      // 内弧反向
      ctx.arc(cx, cy, r1, a2, a1, true);
      ctx.closePath();

      // 填充
      ctx.fillStyle = adjustBrightness(seg.color, seg.brightness);
      ctx.fill();

      // 描边
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // 绘制世代数字标签
    gens.forEach(function (g) {
      if (g % 5 !== 0 && g !== 1) return;
      var r = (g + 0.5) * ringHeight;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(g + '世', cx + r + 12, cy);
    });

    // 中心文字
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('谢氏', cx, cy - 6);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText(allData.length + '人', cx, cy + 14);

    // 图例
    drawLegend(size);

    // 鼠标交互
    canvas.onmousemove = function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      var dx = mx - cx, dy = my - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) angle += 2 * Math.PI;

      var hit = null;
      for (var i = 0; i < segments.length; i++) {
        var s = segments[i];
        if (dist >= s.innerR && dist < s.outerR && angle >= s.startAngle && angle < s.endAngle) {
          hit = s;
          break;
        }
      }

      if (hit) {
        var total = genStats[hit.g] ? genStats[hit.g].total : 0;
        infoEl.innerHTML = '<strong>第' + hit.g + '世</strong><br>' +
          '分支: ' + hit.branch + '<br>' +
          '人数: ' + hit.count + '人' + (total > 0 ? '（占本世 ' + Math.round(hit.count / total * 100) + '%）' : '');
        infoEl.style.opacity = '1';
        infoEl.style.left = (e.clientX - rect.left + 12) + 'px';
        infoEl.style.top = (e.clientY - rect.top - 10) + 'px';
        canvas.style.cursor = 'pointer';
      } else {
        infoEl.style.opacity = '0';
        canvas.style.cursor = 'default';
      }
    };

    canvas.onmouseleave = function () {
      infoEl.style.opacity = '0';
    };
  }

  function drawLegend(size) {
    var branches = [
      { label: '后枫槎', color: BRANCH_COLORS['后枫槎'].fill },
      { label: '前枫槎', color: BRANCH_COLORS['前枫槎'].fill },
      { label: '石马', color: BRANCH_COLORS['石马'].fill },
      { label: '其他', color: BRANCH_COLORS['default'].fill }
    ];
    var x = 16, y = size - 12 - branches.length * 22;
    ctx.textBaseline = 'middle';
    branches.forEach(function (b) {
      ctx.fillStyle = b.color;
      ctx.fillRect(x, y, 12, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(b.label, x + 18, y + 6);
      y += 22;
    });
  }

  function adjustBrightness(color, factor) {
    // Simple hex brightness adjustment
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);
    r = Math.min(255, Math.round(r * factor));
    g = Math.min(255, Math.round(g * factor));
    b = Math.min(255, Math.round(b * factor));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  // ---- 启动 ----
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 100);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 100); });
  }

})();
