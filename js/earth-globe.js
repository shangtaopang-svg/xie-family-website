/* ============================================
   3D 地球 — 真实纹理 + Canvas 2D 模拟
   ============================================ */
(function () {
  'use strict';

  var container, canvas, ctx, texCanvas, texCtx;
  var isActive = false, animId = null;
  var phase = 'idle', earthRotation = 0, startTime = 0, fadeAlpha = 1;
  var W, H, stars = [];
  var textureReady = false;
  var texWidth = 1024, texHeight = 512;
  var imageLoadAttempted = false;

  // 生成星空
  for (var si = 0; si < 200; si++) {
    stars.push({ x: Math.random(), y: Math.random(), r: 0.3 + Math.random() * 1.2, b: 0.3 + Math.random() * 0.7, s: Math.random() * 0.02 });
  }

  // 经纬度→屏幕
  function project(lat, lon, rot, r, cx, cy) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon + rot * 180 / Math.PI) * Math.PI / 180;
    var x = r * Math.sin(phi) * Math.cos(theta);
    var y = r * Math.cos(phi);
    var z = r * Math.sin(phi) * Math.sin(theta);
    return { x: cx + x, y: cy - y, z: z };
  }

  // 生成高精度地球纹理（Canvas绘制，更详细的大陆）
  function generateTexture() {
    var c = document.createElement('canvas');
    c.width = texWidth; c.height = texHeight;
    var cx = c.getContext('2d');

    // 海洋渐变
    var g = cx.createLinearGradient(0, 0, 0, texHeight);
    g.addColorStop(0, '#1a3366');
    g.addColorStop(0.15, '#1a4a8a');
    g.addColorStop(0.35, '#2a6db0');
    g.addColorStop(0.5, '#3a7dd0');
    g.addColorStop(0.65, '#2a6db0');
    g.addColorStop(0.85, '#1a4a8a');
    g.addColorStop(1, '#1a3366');
    cx.fillStyle = g;
    cx.fillRect(0, 0, texWidth, texHeight);

    // 大陆绘制工具
    function drawLand(points, color) {
      cx.beginPath();
      var s = false;
      points.forEach(function(p) {
        var x = (p[1] + 180) / 360 * texWidth;
        var y = (90 - p[0]) / 180 * texHeight;
        if (!s) { cx.moveTo(x, y); s = true; }
        else cx.lineTo(x, y);
      });
      cx.closePath();
      cx.fillStyle = color;
      cx.fill();
      // 描边使大陆边界更清晰
      cx.strokeStyle = 'rgba(0,0,0,0.15)';
      cx.lineWidth = 0.5;
      cx.stroke();
    }

    // 详细大陆坐标（经纬度点集）
    var lands = [
      // 亚洲（含中国周边）
      { color: '#3a7a30', pts: [
        [70,-10],[72,-5],[70,5],[72,15],[75,20],[80,25],[85,30],[90,32],[95,35],
        [100,38],[105,40],[110,42],[115,45],[120,48],[125,50],[130,52],[135,55],
        [140,58],[145,60],[150,62],[155,60],[160,58],[165,55],[170,52],[175,50],
        [180,48],[175,45],[170,42],[165,40],[160,38],[155,35],[150,32],
        [145,30],[140,28],[135,25],[130,22],[125,20],[120,18],[115,15],
        [110,12],[105,10],[100,8],[95,5],[90,3],[85,0],[80,-2],[75,-5],[70,-10]
      ]},
      // 中国（更精确轮廓）
      { color: '#4a9a3a', pts: [
        [18,107],[20,110],[22,115],[25,120],[28,122],[30,124],[32,122],[35,120],
        [38,118],[40,115],[42,112],[45,110],[47,108],[48,105],[47,100],[45,96],
        [44,92],[42,88],[40,84],[38,80],[36,78],[34,76],[32,76],[30,78],
        [28,80],[26,84],[24,88],[22,92],[20,96],[18,100],[17,104],[18,107]
      ]},
      // 欧洲
      { color: '#3a7a30', pts: [
        [55,-10],[58,-5],[60,0],[62,5],[65,10],[68,15],[70,20],[72,25],[70,30],
        [68,35],[65,40],[62,42],[58,40],[55,38],[52,36],[50,32],[48,28],[46,24],
        [45,20],[44,16],[42,12],[40,8],[42,4],[44,0],[46,-4],[48,-8],[50,-10],[55,-10]
      ]},
      // 非洲（更详细）
      { color: '#4a7a2d', pts: [
        [37,-5],[37,0],[37,5],[36,10],[35,15],[34,20],[32,25],[30,30],[28,35],
        [25,38],[22,40],[18,42],[15,40],[12,38],[10,35],[8,32],[5,30],[2,28],
        [0,26],[-3,24],[-6,22],[-10,20],[-14,18],[-18,16],[-22,14],[-26,12],
        [-30,14],[-34,16],[-36,18],[-38,20],[-40,22],[-42,24],[-44,26],
        [-46,28],[-48,30],[-50,28],[-48,24],[-46,20],[-44,16],[-42,12],
        [-40,8],[-38,4],[-36,0],[-34,-5],[-32,-10],[-30,-15],[-28,-18],
        [-26,-16],[-24,-12],[-22,-8],[-20,-4],[-18,0],[-16,5],[-14,10],
        [-12,15],[-10,18],[-8,20],[-6,18],[-4,15],[-2,12],[0,10],[2,8],
        [5,6],[8,5],[10,4],[12,3],[15,2],[18,0],[20,-2],[22,-4],[25,-5],
        [28,-5],[30,-5],[33,-5],[35,-5],[37,-5]
      ]},
      // 北美
      { color: '#3a7a30', pts: [
        [50,-130],[55,-125],[60,-130],[65,-125],[68,-120],[70,-115],[72,-110],
        [70,-105],[68,-100],[65,-95],[62,-90],[60,-85],[58,-80],[55,-75],
        [52,-70],[50,-65],[48,-62],[45,-65],[42,-68],[40,-72],[38,-76],
        [35,-80],[33,-84],[30,-88],[28,-92],[28,-96],[30,-100],[32,-104],
        [35,-108],[38,-112],[42,-116],[45,-120],[48,-125],[50,-130]
      ]},
      // 中美/加勒比
      { color: '#3a7a30', pts: [
        [25,-100],[26,-98],[25,-95],[24,-92],[22,-90],[20,-88],[18,-86],
        [16,-84],[14,-82],[12,-80],[10,-78],[8,-76],[10,-74],[12,-72],
        [14,-70],[16,-68],[18,-66],[20,-68],[22,-70],[24,-72],[26,-75],
        [28,-78],[28,-82],[27,-86],[26,-90],[25,-95],[25,-100]
      ]},
      // 南美
      { color: '#3a7a30', pts: [
        [10,-60],[12,-64],[10,-68],[8,-72],[6,-76],[4,-78],[2,-80],[0,-82],
        [-2,-80],[-4,-78],[-6,-76],[-8,-74],[-10,-72],[-12,-70],[-14,-68],
        [-16,-66],[-18,-64],[-20,-62],[-22,-60],[-24,-58],[-26,-56],
        [-28,-54],[-30,-52],[-32,-50],[-34,-48],[-36,-50],[-38,-52],
        [-40,-54],[-42,-56],[-44,-58],[-46,-60],[-48,-62],[-50,-64],
        [-52,-66],[-54,-68],[-56,-70],[-55,-65],[-52,-60],[-50,-55],
        [-48,-50],[-46,-45],[-44,-40],[-42,-38],[-40,-36],[-38,-34],
        [-36,-32],[-34,-30],[-32,-28],[-30,-26],[-28,-24],[-26,-22],
        [-24,-20],[-22,-18],[-20,-16],[-18,-14],[-16,-12],[-14,-10],
        [-12,-8],[-10,-6],[-8,-4],[-6,-2],[-4,0],[-2,-2],[0,-4],[2,-6],
        [4,-8],[6,-10],[8,-12],[10,-14],[12,-16],[14,-18],[16,-20],
        [18,-22],[20,-24],[22,-26],[24,-28],[22,-30],[20,-32],[18,-34],
        [16,-36],[14,-38],[12,-40],[10,-42],[8,-44],[6,-46],[4,-48],
        [2,-50],[0,-52],[-2,-54],[-4,-56],[-6,-58],[-8,-60],
        [-6,-58],[-4,-56],[-2,-54],[0,-52],[2,-50],[4,-48],[6,-46],
        [8,-44],[10,-42],[10,-60]
      ]},
      // 澳大利亚
      { color: '#6a8a3d', pts: [
        [-12,115],[-14,118],[-16,122],[-18,126],[-20,130],[-22,134],[-24,138],
        [-26,142],[-28,146],[-30,150],[-32,152],[-34,150],[-35,148],
        [-36,145],[-36,142],[-35,138],[-34,134],[-32,130],[-30,126],
        [-28,122],[-26,118],[-24,115],[-22,114],[-20,114],[-18,115],[-16,116],[-14,115],[-12,115]
      ]},
      // 格陵兰
      { color: '#6a8a6a', pts: [
        [78,-20],[80,-25],[82,-30],[80,-35],[78,-40],[76,-42],[74,-40],
        [72,-38],[70,-35],[68,-30],[70,-25],[72,-20],[75,-18],[78,-20]
      ]},
      // 中东/阿拉伯半岛
      { color: '#5a7a2d', pts: [
        [28,34],[30,36],[32,38],[34,40],[36,42],[38,44],[40,46],[42,48],
        [40,50],[38,52],[36,54],[34,56],[32,58],[30,56],[28,54],[26,52],
        [24,50],[22,48],[20,46],[22,44],[24,42],[26,40],[28,38],[28,36],[28,34]
      ]},
      // 印度
      { color: '#3a7a30', pts: [
        [8,76],[10,74],[12,76],[14,78],[16,80],[18,82],[20,84],[22,86],
        [24,88],[22,90],[20,92],[18,90],[16,88],[14,86],[12,84],[10,82],
        [8,80],[8,78],[8,76]
      ]},
      // 东南亚岛屿
      { color: '#4a8a35', pts: [
        [-5,105],[-3,108],[0,110],[2,112],[5,114],[3,116],[0,118],[-2,116],
        [-5,114],[-7,112],[-8,110],[-7,108],[-5,105]
      ]},
      { color: '#4a8a35', pts: [
        [-8,115],[-6,118],[-4,120],[-6,122],[-8,120],[-10,118],[-8,115]
      ]},
      // 新西兰
      { color: '#4a7a30', pts: [
        [-42,168],[-44,170],[-46,172],[-47,170],[-46,168],[-44,166],[-42,168]
      ]},
    ];

    lands.forEach(function(l) { drawLand(l.pts, l.color); });

    // 海洋浅滩效果
    cx.fillStyle = 'rgba(100,180,255,0.04)';
    for (var i = 0; i < 100; i++) {
      var rx = Math.random() * texWidth;
      var ry = Math.random() * texHeight;
      var rr = 10 + Math.random() * 40;
      cx.beginPath();
      cx.arc(rx, ry, rr, 0, Math.PI * 2);
      cx.fill();
    }

    texCanvas = c;
    texCtx = cx;
    textureReady = true;
  }

  function init() {
    container = document.getElementById('globe-container');
    if (!container) return;

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    generateTexture();

    function resize() {
      if (!container) return;
      W = canvas.width = container.clientWidth || window.innerWidth;
      H = canvas.height = container.clientHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('xie-bg-mode', function(e) {
      if (e.detail === 'globe') { if (!isActive) activate(); }
      else deactivate();
    });
    var s = localStorage.getItem('xie_hero_style') || 'clean';
    if (s === 'globe') setTimeout(function() { document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'globe' })); }, 200);
  }

  function activate() {
    if (isActive) return;
    isActive = true;
    startTime = Date.now();
    earthRotation = Math.random() * Math.PI * 2;
    phase = 'orbiting'; fadeAlpha = 1;
    container.style.display = 'block';
    if (canvas) { W = canvas.width = container.clientWidth || window.innerWidth; H = canvas.height = container.clientHeight || window.innerHeight; }
    animate();
  }

  function deactivate() {
    isActive = false; phase = 'idle';
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (container) container.style.display = 'none';
    if (ctx) ctx.clearRect(0, 0, W || 1, H || 1);
  }

  function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  function drawEarth3d(cx, cy, radius, rotation, zoomP) {
    if (radius < 2 || !textureReady) return;

    var imgData = texCtx.getImageData(0, 0, texWidth, texHeight);
    var pixels = imgData.data;

    // 创建地球像素缓冲区
    var output = ctx.createImageData(radius * 2 + 4, radius * 2 + 4);
    var outW = output.width, outH = output.height;
    var outData = output.data;

    // 清为透明
    for (var i = 0; i < outData.length; i += 4) {
      outData[i + 3] = 0;
    }

    // 球面纹理映射
    for (var y = 0; y < outH; y++) {
      for (var x = 0; x < outW; x++) {
        var dx = x - radius - 2;
        var dy = y - radius - 2;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) continue;

        // 球面坐标
        var nx = dx / radius;
        var ny = dy / radius;
        var nz = Math.sqrt(1 - nx * nx - ny * ny);

        // 背面剔除
        if (nz < 0) continue;

        // 旋转
        var rot = rotation;
        var cosR = Math.cos(rot), sinR = Math.sin(rot);
        var tx = nx * cosR - nz * sinR;
        var tz = nx * sinR + nz * cosR;
        var ty = ny;

        // 纹理坐标
        var u = Math.atan2(tz, tx) / (2 * Math.PI) + 0.5;
        var v = Math.asin(Math.max(-1, Math.min(1, ty))) / Math.PI + 0.5;

        var texX = Math.floor(u * texWidth) % texWidth;
        var texY = Math.floor(v * texHeight) % texHeight;
        if (texX < 0) texX += texWidth;
        if (texY < 0) texY += texHeight;

        var pi = (texY * texWidth + texX) * 4;

        // 光照
        var lightDot = (tx * 0.5 + ty * 0.7 + tz * 0.5);
        if (lightDot < 0) lightDot = 0;
        var shade = 0.4 + lightDot * 0.6;

        var oi = (y * outW + x) * 4;
        outData[oi] = pixels[pi] * shade;
        outData[oi + 1] = pixels[pi + 1] * shade;
        outData[oi + 2] = pixels[pi + 2] * shade;
        outData[oi + 3] = 255;
      }
    }

    // 绘制地球
    ctx.putImageData(output, Math.round(cx - radius - 2), Math.round(cy - radius - 2));

    // 大气辉光
    var gr = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.25);
    gr.addColorStop(0, 'rgba(80,160,255,0)');
    gr.addColorStop(0.7, 'rgba(80,160,255,0.03)');
    gr.addColorStop(0.85, 'rgba(80,160,255,0.07)');
    gr.addColorStop(1, 'rgba(80,160,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
    ctx.fillStyle = gr;
    ctx.fill();

    // 高光
    var hl = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx - radius * 0.3, cy - radius * 0.3, radius * 0.6);
    hl.addColorStop(0, 'rgba(255,255,255,0.12)');
    hl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = hl;
    ctx.fill();
  }

  function animate() {
    if (!isActive) return;
    animId = requestAnimationFrame(animate);

    var elapsed = (Date.now() - startTime) / 1000;
    ctx.clearRect(0, 0, W, H);

    // 星空
    stars.forEach(function(s) {
      s.b = 0.3 + Math.sin(Date.now() * s.s + s.x * 100) * 0.3 + 0.4;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + s.b + ')';
      ctx.fill();
    });

    var cx = W / 2, cy = H / 2;
    var baseR = Math.min(W, H) * 0.22;

    if (phase === 'orbiting') {
      earthRotation += 0.005;
      drawEarth3d(cx, cy, baseR, earthRotation, 0);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ 正在进入中国区域...', cx, H - 40);
      if (elapsed > 4) { phase = 'zooming'; }
    }

    if (phase === 'zooming') {
      var p = Math.min(1, (elapsed - 4) / 4);
      var e = easeInOut(p);
      earthRotation += 0.004 * (1 - e * 0.6);
      var zoomR = baseR + (Math.min(W, H) * 0.42 - baseR) * e;
      drawEarth3d(cx + W * 0.12 * e, cy - H * 0.06 * e, zoomR, earthRotation, e);

      // 进度
      var bw = Math.min(200, W * 0.35), bx = cx - bw / 2, by = H - 28;
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(bx, by, bw, 3);
      ctx.fillStyle = 'rgba(255,150,50,0.5)';
      ctx.fillRect(bx, by, bw * e, 3);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(e * 100) + '%', cx, by - 5);

      if (p >= 1) { phase = 'transitioning'; startTime = Date.now(); }
    }

    if (phase === 'transitioning') {
      var zoomR2 = baseR + (Math.min(W, H) * 0.42 - baseR);
      earthRotation += 0.002;
      drawEarth3d(cx + W * 0.12, cy - H * 0.06, zoomR2, earthRotation, 1);
      var fe = (Date.now() - startTime) / 1000;
      fadeAlpha = Math.max(0, 1 - fe / 1.5);
      ctx.fillStyle = 'rgba(0,0,0,' + (1 - fadeAlpha) + ')';
      ctx.fillRect(0, 0, W, H);
      if (fadeAlpha > 0.3) {
        ctx.fillStyle = 'rgba(255,255,255,' + fadeAlpha * 0.5 + ')';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📍 中国 · 浙江 · 宁海', cx, H - 40);
      }
      if (fe >= 1.8) {
        phase = 'done';
        setTimeout(function() {
          if (!isActive) return;
          if (localStorage.getItem('xie_hero_style') === 'globe') {
            localStorage.setItem('xie_hero_style', 'map');
            var mb = document.querySelector('.hbg-btn[data-style="map"]');
            if (mb) mb.click();
          }
        }, 200);
      }
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
