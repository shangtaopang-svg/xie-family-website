/* ============================================
   环形繁衍图 v2 — Canvas 绘制
   展示谢氏家族世代繁衍与分支分布
   点击分支可缩放查看 · 悬停显示详情
   ============================================ */
(function () {
  'use strict';

  var canvas, ctx, container, infoEl, legendEl, statsEl;
  var allData = [];
  var isReady = false;

  var COLORS = [
    '#ef4444','#f97316','#f59e0b','#22c55e','#14b8a6',
    '#06b6d4','#3b82f6','#6366f1','#8b5cf6','#d946ef',
    '#ec4899','#e11d48','#fb7185','#34d399','#2dd4bf',
    '#60a5fa','#a78bfa','#c084fc','#f472b6','#fb923c'
  ];

  var viewStack = [];       // 缩放栈
  var currentRoot = null;   // 当前视图的根节点
  var hoveredSeg = null;

  // ---- 树节点结构 ----
  function TreeNode(id, name, gen, branch, data) {
    this.id = id;
    this.name = name || '?';
    this.gen = gen || 0;
    this.branch = branch || '';
    this.data = data || null;
    this.children = [];
    this.count = 1;      // 该节点下总人数（含自己）
    this.depth = 0;       // 从当前根算起的深度
  }

  function init() {
    container = document.getElementById('genealogy-sunburst-container');
    if (!container) return;

    container.style.position = 'relative';
    container.style.minHeight = '400px';

    // Canvas
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;cursor:pointer;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // 信息提示
    infoEl = document.createElement('div');
    infoEl.className = 'gs-tip';
    infoEl.style.cssText = 'position:absolute;pointer-events:none;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);color:#fff;padding:10px 14px;border-radius:8px;font-size:13px;line-height:1.8;border:1px solid rgba(255,255,255,0.12);opacity:0;transition:opacity 0.15s;z-index:10;max-width:240px;';
    container.appendChild(infoEl);

    // 图例
    legendEl = document.createElement('div');
    legendEl.style.cssText = 'position:absolute;bottom:10px;left:10px;font-size:11px;line-height:1.8;color:rgba(255,255,255,0.6);pointer-events:none;';
    container.appendChild(legendEl);

    // 统计
    statsEl = document.createElement('div');
    statsEl.style.cssText = 'position:absolute;top:10px;left:50%;transform:translateX(-50%);font-size:12px;color:rgba(255,255,255,0.5);text-align:center;pointer-events:none;background:rgba(0,0,0,0.4);padding:4px 14px;border-radius:20px;backdrop-filter:blur(4px);';
    container.appendChild(statsEl);

    // 返回按钮
    var backBtn = document.createElement('button');
    backBtn.textContent = '⟵ 返回总图';
    backBtn.style.cssText = 'position:absolute;top:10px;right:10px;display:none;background:rgba(0,0,0,0.6);color:#fff;border:1px solid rgba(255,255,255,0.15);padding:5px 14px;border-radius:6px;font-size:12px;cursor:pointer;backdrop-filter:blur(4px);z-index:11;';
    backBtn.onclick = function (e) { e.stopPropagation(); zoomOut(); };
    container.appendChild(backBtn);

    loadData();
    window.addEventListener('resize', debounce(function () { if (isReady) draw(); }, 300));

    // 点击 canvas 进行缩放
    canvas.onclick = function (e) { onCanvasClick(e); };
    canvas.onmousemove = function (e) { onCanvasMove(e); };
    canvas.onmouseleave = function () { infoEl.style.opacity = '0'; hoveredSeg = null; };
  }

  // ---- 加载数据 ----
  function loadData() {
    allData = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    if (!allData || allData.length === 0) {
      container.innerHTML = '<div style="padding:60px;text-align:center;color:var(--text-muted);font-size:14px;">暂无数据</div>';
      return;
    }
    isReady = true;
    currentRoot = buildTree();
    viewStack = [currentRoot];
    draw();
  }

  // ---- 建树 ----
  function buildTree() {
    var nodeMap = {};
    // 创建节点
    allData.forEach(function (p) {
      nodeMap[p.id] = new TreeNode(p.id, p.name, parseInt(p.generation_num) || 0, p.branch || '', p);
    });

    // 建立父子关系
    var roots = [];
    allData.forEach(function (p) {
      var node = nodeMap[p.id];
      if (!node) return;
      if (p.father_id != null && nodeMap[p.father_id]) {
        nodeMap[p.father_id].children.push(node);
      } else {
        roots.push(node);
      }
    });

    // 计算各节点后代数
    function countKids(node) {
      var c = 1;
      node.children.forEach(function (ch) { c += countKids(ch); });
      node.count = c;
      return c;
    }

    // 如果全是散节点（没有父子关系），按世代分组
    if (roots.length === allData.length || roots.length === 0) {
      return buildGenTree();
    }

    roots.forEach(function (r) { countKids(r); });

    // 用人数最多的根作为主根
    roots.sort(function (a, b) { return b.count - a.count; });
    var mainRoot = roots[0];
    // 其他根作为兄弟附加
    for (var i = 1; i < roots.length; i++) {
      mainRoot.count += roots[i].count;
      mainRoot.children.push(roots[i]);
    }

    setDepth(mainRoot, 0);
    return mainRoot;
  }

  function buildGenTree() {
    // 按世代分组构造虚拟树
    var genMap = {};
    allData.forEach(function (p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genMap[g]) genMap[g] = [];
      genMap[g].push(p);
    });

    var root = new TreeNode('root', '谢氏', 0, '', null);
    // 只显示近祖几代（去除太古老的）
    var gens = Object.keys(genMap).map(Number).sort(function (a, b) { return a - b; });
    var minGen = gens[0] || 0;
    gens.forEach(function (g) {
      var genNode = new TreeNode('gen_' + g, '第' + g + '世', g, '', null);
      genNode.count = genMap[g].length;
      genMap[g].forEach(function (p) {
        var leaf = new TreeNode(p.id, p.name, g, p.branch || '', p);
        leaf.count = 1;
        genNode.children.push(leaf);
      });
      root.children.push(genNode);
    });
    root.count = allData.length;
    setDepth(root, 0);
    return root;
  }

  function setDepth(node, d) {
    node.depth = d;
    node.children.forEach(function (c) { setDepth(c, d + 1); });
  }

  // ---- 绘制 ----
  function draw() {
    if (!currentRoot) return;
    var rect = container.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var size = Math.min(rect.width, 600);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    var cx = size / 2, cy = size / 2;
    var maxR = Math.min(cx, cy) - 20;

    ctx.clearRect(0, 0, size, size);

    // 绘制背景
    var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    grad.addColorStop(0, 'rgba(255,255,255,0.03)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, 2 * Math.PI);
    ctx.fill();

    // 计算当前视图的最大深度
    var maxDepth = 0;
    (function calcDepth(node, d) {
      if (d > maxDepth) maxDepth = d;
      node.children.forEach(function (c) { calcDepth(c, d + 1); });
    })(currentRoot, 0);

    var ringW = Math.min(maxR / (maxDepth + 1), 40);
    var totalR = ringW * (maxDepth + 1);

    // 如果环形太小，调整
    if (totalR > maxR) {
      ringW = maxR / (maxDepth + 1);
      totalR = maxR;
    }

    // 从根开始递归绘制扇形
    hoveredSeg = null;
    var segments = [];
    collectSegments(currentRoot, 0, 0, 2 * Math.PI, ringW, segments);

    // 绘制所有扇形
    segments.forEach(function (seg) {
      var r1 = seg.depth * ringW;
      var r2 = (seg.depth + 1) * ringW;
      if (r1 > maxR || r2 > maxR) return;

      ctx.beginPath();
      ctx.arc(cx, cy, r2, seg.startAngle, seg.endAngle);
      ctx.arc(cx, cy, r1, seg.endAngle, seg.startAngle, true);
      ctx.closePath();

      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // 绘制世代环标注
    for (var d = 1; d <= maxDepth; d++) {
      if (d % 2 === 0 || d === 1) {
        var r = (d + 0.3) * ringW;
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        var label = currentRoot.name === '谢氏' ? (d + 1) + '世' : '第' + d + '层';
        ctx.fillText(label, cx + r + 3, cy);
      }
    }

    // 中心文字
    var centerR = ringW * 0.4;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.arc(cx, cy, ringW * 0.6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentRoot.name || '谢氏', cx, cy - 8);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px sans-serif';
    ctx.fillText(currentRoot.count + '人', cx, cy + 12);

    // 图例
    updateLegend();

    // 统计
    var genCounts = {};
    allData.forEach(function (p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genCounts[g]) genCounts[g] = 0;
      genCounts[g]++;
    });
    var genKeys = Object.keys(genCounts).map(Number).sort(function (a, b) { return a - b; });
    var maxPop = 1;
    genKeys.forEach(function (g) { if (genCounts[g] > maxPop) maxPop = genCounts[g]; });
    var statsText = '共' + allData.length + '人 · ' + genKeys.length + '世 · 最旺第';
    var maxGen = genKeys.reduce(function (a, b) { return genCounts[a] > genCounts[b] ? a : b; });
    statsText += maxGen + '世（' + genCounts[maxGen] + '人）';
    statsEl.textContent = statsText;

    // 保存 segments 供点击/悬停使用
    canvas._segments = segments;
  }

  // ---- 递归收集扇形 ----
  function collectSegments(node, startAngle, totalAngle, parentEnd, ringW, result) {
    if (!node || node.count === 0) return;

    // 当前节点的角度范围
    var nodeAngle = totalAngle > 0 ? totalAngle : 2 * Math.PI;

    // 子节点总人数
    var totalKids = 0;
    node.children.forEach(function (c) { totalKids += Math.max(c.count, 1); });
    if (totalKids === 0) totalKids = 1;

    // 为节点本身添加一个扇形（除了根节点）
    if (node.id !== 'root' && node.id !== null) {
      var color = getNodeColor(node);
      result.push({
        node: node,
        depth: node.depth,
        startAngle: startAngle,
        endAngle: startAngle + nodeAngle,
        color: color
      });
    }

    // 绘制子节点
    var currentAngle = startAngle;
    node.children.forEach(function (child) {
      var childAngle = nodeAngle * (Math.max(child.count, 1) / totalKids);
      collectSegments(child, currentAngle, childAngle, currentAngle + childAngle, ringW, result);
      currentAngle += childAngle;
    });
  }

  function getNodeColor(node) {
    if (node.branch) {
      if (node.branch.indexOf('后枫槎') >= 0) return COLORS[3];
      if (node.branch.indexOf('前枫槎') >= 0) return COLORS[7];
      if (node.branch.indexOf('石马') >= 0) return COLORS[2];
    }
    // 按世代取色
    var idx = (node.gen || node.depth || 0) % COLORS.length;
    return COLORS[idx];
  }

  // ---- 鼠标悬停 ----
  function onCanvasMove(e) {
    if (!canvas._segments) return;
    var rect = canvas.getBoundingClientRect();
    var size = canvas.width / (window.devicePixelRatio || 1);
    var cx = size / 2, cy = size / 2;
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var dx = mx - cx, dy = my - cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;

    var hit = null;
    for (var i = 0; i < canvas._segments.length; i++) {
      var s = canvas._segments[i];
      var r1 = s.depth * 18;
      var r2 = (s.depth + 1) * 18;
      if (dist >= r1 && dist < r2 && angle >= s.startAngle && angle < s.endAngle) {
        hit = s;
        break;
      }
    }

    if (hit && hit.node && hit.node.name) {
      var node = hit.node;
      var info = '<strong>' + node.name + '</strong>';
      if (node.gen > 0) info += '<br>第' + node.gen + '世';
      if (node.branch) info += '<br>分支: ' + node.branch;
      info += '<br>人数: ' + node.count + '人';
      if (node.children.length > 0) info += '<br><span style="color:#fbbf24;font-size:11px;">点击可放大查看</span>';
      infoEl.innerHTML = info;
      infoEl.style.opacity = '1';
      infoEl.style.left = (e.clientX - rect.left + 12) + 'px';
      infoEl.style.top = (e.clientY - rect.top - 10) + 'px';
      canvas.style.cursor = node.children.length > 0 ? 'pointer' : 'default';
      hoveredSeg = hit;
    } else {
      infoEl.style.opacity = '0';
      canvas.style.cursor = 'default';
      hoveredSeg = null;
    }
  }

  // ---- 点击缩放 ----
  function onCanvasClick(e) {
    if (!canvas._segments) return;
    // 模拟 mousemove 找到点击的 segment
    var rect = canvas.getBoundingClientRect();
    var size = canvas.width / (window.devicePixelRatio || 1);
    var cx = size / 2, cy = size / 2;
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    var dx = mx - cx, dy = my - cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;

    for (var i = 0; i < canvas._segments.length; i++) {
      var s = canvas._segments[i];
      var r1 = s.depth * 18, r2 = (s.depth + 1) * 18;
      if (dist >= r1 && dist < r2 && angle >= s.startAngle && angle < s.endAngle) {
        if (s.node && s.node.children.length > 0 && s.node.id !== 'root') {
          zoomIn(s.node);
        }
        return;
      }
    }
  }

  function zoomIn(node) {
    viewStack.push(node);
    currentRoot = node;
    setDepth(node, 0);
    draw();
    var btn = container.querySelector('button');
    if (btn) btn.style.display = 'block';
  }

  function zoomOut() {
    if (viewStack.length <= 1) return;
    viewStack.pop();
    currentRoot = viewStack[viewStack.length - 1];
    draw();
    if (viewStack.length <= 1) {
      var btn = container.querySelector('button');
      if (btn) btn.style.display = 'none';
    }
  }

  function updateLegend() {
    var html = '';
    ['后枫槎', '前枫槎', '石马'].forEach(function (b) {
      var c = COLORS[b === '后枫槎' ? 3 : b === '前枫槎' ? 7 : 2];
      html += '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + c + ';margin-right:4px;vertical-align:middle;"></span>';
      html += '<span style="vertical-align:middle;margin-right:12px;">' + b + '</span>';
    });
    legendEl.innerHTML = html;
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
