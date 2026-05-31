/* ============================================
   3D 地球 — Canvas 2D 模拟（无外部依赖）
   改进版：更流畅动画 + 更好视觉效果
   ============================================ */
(function () {
  'use strict';

  var container = null;
  var canvas, ctx;
  var isActive = false;
  var animId = null;
  var phase = 'idle'; // idle | orbiting | zooming | transitioning | done
  var earthRotation = 0;
  var startTime = 0;
  var W, H;
  var starPositions = [];
  var fadeAlpha = 1;

  // 预生成星空
  function generateStars(count) {
    var stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.3 + Math.random() * 1.2,
        b: 0.3 + Math.random() * 0.7,
        s: Math.random() * 0.02
      });
    }
    return stars;
  }

  // 经纬度 → 屏幕坐标投影（简单球面投影）
  function project(lat, lon, rotation, radius, cx, cy) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon + rotation * 180 / Math.PI) * Math.PI / 180;
    var x = radius * Math.sin(phi) * Math.cos(theta);
    var y = radius * Math.cos(phi);
    var z = radius * Math.sin(phi) * Math.sin(theta);
    return { x: cx + x, y: cy - y, z: z };
  }

  function init() {
    container = document.getElementById('globe-container');
    if (!container) return;

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');
    starPositions = generateStars(200);

    function resize() {
      if (!container) return;
      W = canvas.width = container.clientWidth || window.innerWidth;
      H = canvas.height = container.clientHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('xie-bg-mode', function(e) {
      if (e.detail === 'globe') {
        if (!isActive) activate();
      } else {
        deactivate();
      }
    });

    var style = localStorage.getItem('xie_hero_style') || 'clean';
    if (style === 'globe') {
      setTimeout(function() {
        document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'globe' }));
      }, 200);
    }
  }

  function activate() {
    if (isActive) return;
    isActive = true;
    startTime = Date.now();
    earthRotation = Math.random() * Math.PI * 2;
    phase = 'orbiting';
    fadeAlpha = 1;
    container.style.display = 'block';
    if (canvas) {
      W = canvas.width = container.clientWidth || window.innerWidth;
      H = canvas.height = container.clientHeight || window.innerHeight;
    }
    animate();
  }

  function deactivate() {
    isActive = false;
    phase = 'idle';
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (container) container.style.display = 'none';
    if (ctx) ctx.clearRect(0, 0, W || 1, H || 1);
  }

  // 绘制地球
  function drawEarth(cx, cy, radius, rotation, zoomProgress) {
    if (radius < 1) return;

    // --- 地球底色（海洋渐变） ---
    var grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.05, cx, cy, radius);
    grad.addColorStop(0, '#4a8fd4');
    grad.addColorStop(0.4, '#2a6db0');
    grad.addColorStop(0.7, '#1a4a7a');
    grad.addColorStop(1, '#0a1a3a');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // --- 大陆（多边形） ---
    var continentColor = '#3a7a30';
    var continentHighlight = '#4a9a3a';

    // 大陆数据：每个大陆是一组 [lat, lon] 坐标
    var landmasses = [
      { name: 'europe', color: continentColor, pts: [
        [55,-5],[58,5],[60,10],[62,20],[65,30],[62,40],[58,45],
        [52,42],[48,40],[45,38],[42,30],[40,25],[42,20],[45,15],
        [48,10],[50,5],[52,0],[55,-5]
      ]},
      { name: 'china', color: continentHighlight, pts: [
        [20,100],[22,105],[20,110],[22,115],[25,120],[30,122],
        [35,120],[40,118],[42,115],[45,110],[47,100],[45,95],
        [42,90],[40,85],[38,80],[35,78],[32,78],[30,80],
        [28,85],[25,90],[22,95],[20,100]
      ]},
      { name: 'africa', color: continentColor, pts: [
        [35,-5],[37,-5],[37,10],[35,20],[32,30],[30,35],
        [25,38],[20,38],[15,35],[10,32],[5,30],[0,28],
        [-5,25],[-10,20],[-15,15],[-20,10],[-25,5],
        [-28,0],[-28,-5],[-25,-10],[-20,-15],[-15,-20],
        [-10,-15],[-5,-10],[0,-5],[5,0],[10,5],[15,5],
        [20,5],[25,0],[30,-5],[35,-5]
      ]},
      { name: 'north_america', color: continentColor, pts: [
        [50,-125],[55,-120],[60,-125],[65,-120],[68,-110],[70,-100],
        [68,-90],[65,-80],[60,-75],[55,-70],[50,-65],[45,-70],
        [40,-75],[35,-80],[32,-85],[30,-90],[28,-95],[28,-100],
        [30,-105],[32,-110],[35,-115],[40,-120],[45,-122],[50,-125]
      ]},
      { name: 'south_america', color: continentColor, pts: [
        [10,-60],[12,-65],[10,-70],[8,-75],[5,-78],[0,-80],
        [-5,-78],[-10,-75],[-15,-72],[-20,-70],[-25,-68],
        [-30,-66],[-35,-65],[-40,-68],[-42,-70],[-45,-72],
        [-48,-70],[-50,-68],[-52,-65],[-55,-60],[-50,-55],
        [-45,-50],[-40,-48],[-35,-48],[-30,-45],[-25,-42],
        [-20,-40],[-15,-42],[-10,-45],[-5,-48],[0,-50],
        [5,-55],[10,-60]
      ]},
      { name: 'australia', color: continentHighlight, pts: [
        [-15,115],[-18,120],[-20,125],[-22,130],[-24,135],
        [-26,140],[-28,145],[-30,150],[-32,152],[-34,150],
        [-35,148],[-35,145],[-34,140],[-32,135],[-30,130],
        [-28,125],[-25,120],[-22,116],[-18,114],[-15,115]
      ]},
      { name: 'india', color: continentColor, pts: [
        [8,78],[10,75],[12,78],[15,80],[18,82],[20,85],
        [22,88],[20,90],[18,92],[15,90],[12,88],[10,85],[8,82],[8,78]
      ]},
      { name: 'middle_east', color: continentColor, pts: [
        [30,35],[32,38],[35,40],[38,42],[40,45],[42,50],
        [40,55],[38,58],[35,55],[32,52],[30,48],[28,45],
        [28,40],[30,35]
      ]},
    ];

    landmasses.forEach(function(land) {
      ctx.beginPath();
      var started = false;
      land.pts.forEach(function(pt) {
        var p = project(pt[0], pt[1], rotation, radius * 0.97, cx, cy);
        if (p.z > -radius * 0.2) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        }
      });
      ctx.closePath();
      ctx.fillStyle = land.color;
      ctx.fill();
    });

    // --- 经纬网格线 ---
    ctx.strokeStyle = 'rgba(150,200,255,0.08)';
    ctx.lineWidth = 0.3;
    for (var lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath();
      var first = true;
      for (var lon = -180; lon <= 180; lon += 5) {
        var p = project(lat, lon, rotation, radius * 0.98, cx, cy);
        if (p.z > -radius * 0.3) {
          if (first) { ctx.moveTo(p.x, p.y); first = false; }
          else ctx.lineTo(p.x, p.y);
        } else { first = true; }
      }
      ctx.stroke();
    }
    for (var lon2 = -180; lon2 <= 180; lon2 += 20) {
      ctx.beginPath();
      var first2 = true;
      for (var lat2 = -80; lat2 <= 80; lat2 += 5) {
        var p2 = project(lat2, lon2, rotation, radius * 0.98, cx, cy);
        if (p2.z > -radius * 0.3) {
          if (first2) { ctx.moveTo(p2.x, p2.y); first2 = false; }
          else ctx.lineTo(p2.x, p2.y);
        } else { first2 = true; }
      }
      ctx.stroke();
    }

    // --- 中国位置标记 ---
    var chinaCenter = project(30, 115, rotation, radius * 0.97, cx, cy);
    if (chinaCenter.z > 0) {
      var markerR = Math.max(3, 4 + zoomProgress * 6);
      ctx.beginPath();
      ctx.arc(chinaCenter.x, chinaCenter.y, markerR, 0, Math.PI * 2);
      ctx.fillStyle = '#ff3333';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 标记脉冲动画
      var pulse = 0.5 + Math.sin(Date.now() / 300) * 0.5;
      ctx.beginPath();
      ctx.arc(chinaCenter.x, chinaCenter.y, markerR * (1.5 + pulse), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,50,50,' + (0.3 * (1 - pulse * 0.5)) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // --- 大气辉光 ---
    var glowR = radius * 1.08;
    var glow = ctx.createRadialGradient(cx, cy - radius * 0.05, radius * 0.85, cx, cy, glowR);
    glow.addColorStop(0, 'rgba(80,160,255,0)');
    glow.addColorStop(0.6, 'rgba(80,160,255,0.04)');
    glow.addColorStop(0.85, 'rgba(80,160,255,0.08)');
    glow.addColorStop(1, 'rgba(80,160,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // 外发光
    var outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.4);
    outerGlow.addColorStop(0, 'rgba(100,180,255,0)');
    outerGlow.addColorStop(0.7, 'rgba(100,180,255,0.02)');
    outerGlow.addColorStop(1, 'rgba(100,180,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow;
    ctx.fill();
  }

  // 缓动函数
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function animate() {
    if (!isActive) return;
    animId = requestAnimationFrame(animate);

    var elapsed = (Date.now() - startTime) / 1000;
    ctx.clearRect(0, 0, W, H);

    // ===== 绘制星空 =====
    starPositions.forEach(function(s) {
      s.b = 0.3 + Math.sin(Date.now() * s.s + s.x * 100) * 0.3 + 0.4;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + s.b + ')';
      ctx.fill();
    });

    // ===== 计算地球参数 =====
    var centerX = W / 2;
    var centerY = H / 2;
    var baseRadius = Math.min(W, H) * 0.22;

    if (phase === 'orbiting') {
      // 太空旋转阶段
      earthRotation += 0.006;
      var orbRadius = baseRadius;
      drawEarth(centerX, centerY, orbRadius, earthRotation, 0);

      // 提示文字
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ 正在进入中国区域...', centerX, H - 40);

      if (elapsed > 4) {
        phase = 'zooming';
        startTime = Date.now() - 4000;
        // Record the rotation at zoom start
      }
    }

    if (phase === 'zooming') {
      var zoomElapsed = elapsed - 4;
      var progress = Math.min(1, zoomElapsed / 3.5);
      var eased = easeInOut(progress);

      earthRotation += 0.005 * (1 - eased * 0.7);

      // 地球变大（模拟拉近）
      var zoomedRadius = baseRadius + (Math.min(W, H) * 0.45 - baseRadius) * eased;

      // 视角偏移（移向中国位置）
      var offsetX = eased * W * 0.15;
      var offsetY = -eased * H * 0.08;

      drawEarth(centerX + offsetX, centerY + offsetY, zoomedRadius, earthRotation, eased);

      // 进度条
      var barW = Math.min(200, W * 0.4);
      var barX = centerX - barW / 2;
      var barY = H - 30;
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      // fallback
      roundedRect(ctx, barX, barY, barW, 3, 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,150,50,0.6)';
      // fallback
      roundedRect(ctx, barX, barY, barW * eased, 3, 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(eased * 100) + '%', centerX, barY - 6);

      if (progress >= 1) {
        phase = 'transitioning';
        startTime = Date.now();
      }
    }

    if (phase === 'transitioning') {
      // 保持在放大的中国视野
      var zoomedRadius2 = baseRadius + (Math.min(W, H) * 0.45 - baseRadius);
      earthRotation += 0.003;
      drawEarth(centerX + W * 0.15, centerY - H * 0.08, zoomedRadius2, earthRotation, 1);

      // 渐出效果
      var fadeElapsed = (Date.now() - startTime) / 1000;
      fadeAlpha = Math.max(0, 1 - fadeElapsed / 1.2);

      // 应用渐变
      ctx.fillStyle = 'rgba(0,0,0,' + (1 - fadeAlpha) + ')';
      ctx.fillRect(0, 0, W, H);

      // 文字提示
      if (fadeAlpha > 0.3) {
        ctx.fillStyle = 'rgba(255,255,255,' + fadeAlpha * 0.5 + ')';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📍 中国 · 浙江 · 宁海', centerX, H - 40);
      }

      if (fadeElapsed >= 1.5) {
        // 切换到迁徙地图
        phase = 'done';
        setTimeout(function() {
          if (!isActive) return;
          var style = localStorage.getItem('xie_hero_style');
          if (style === 'globe') {
            localStorage.setItem('xie_hero_style', 'map');
            var mapBtn = document.querySelector('.hbg-btn[data-style="map"]');
            if (mapBtn) mapBtn.click();
          }
        }, 300);
      }
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
