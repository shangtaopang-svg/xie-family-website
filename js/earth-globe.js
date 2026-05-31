/* ============================================
   3D 地球 — Canvas 2D 模拟（无外部依赖）
   ============================================ */
(function () {
  'use strict';

  var container = null;
  var canvas, ctx;
  var isActive = false;
  var animId = null;
  var phase = 'idle';
  var earthRotation = 0;
  var cameraDist = 3.5;
  var cameraTargetX = 0, cameraTargetY = 0;
  var startTime = 0;
  var W, H;

  // 经纬度 → 三维坐标
  function latLonToXYZ(lat, lon, r) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = lon * Math.PI / 180;
    return { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.cos(phi), z: r * Math.sin(phi) * Math.sin(theta) };
  }

  // 三维旋转（绕Y轴）
  function rotateY(p, angle) {
    var c = Math.cos(angle), s = Math.sin(angle);
    return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
  }

  function init() {
    container = document.getElementById('globe-container');
    if (!container) return;

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

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
      }, 300);
    }
  }

  function activate() {
    if (isActive) return;
    isActive = true;
    startTime = Date.now();
    earthRotation = 0;
    cameraDist = 3.5;
    cameraTargetX = 0;
    cameraTargetY = 0;
    phase = 'orbiting';
    container.style.display = 'block';
    animate();
  }

  function deactivate() {
    isActive = false;
    phase = 'idle';
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (container) container.style.display = 'none';
    if (ctx) ctx.clearRect(0, 0, W, H);
  }

  // 绘制地球上的点（简化大陆）
  function drawEarth(cx, cy, radius, rotation) {
    // 地球轮廓
    var grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
    grad.addColorStop(0, '#3a7bd5');
    grad.addColorStop(0.7, '#1a3a6a');
    grad.addColorStop(1, '#0a1a3a');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // 经纬网格线
    ctx.strokeStyle = 'rgba(100,180,255,0.08)';
    ctx.lineWidth = 0.5;
    for (var lat = -80; lat <= 80; lat += 20) {
      var pts = [];
      for (var l = 0; l <= 36; l++) {
        var lon = l * 10;
        var p = latLonToXYZ(lat, lon, radius * 0.98);
        p = rotateY(p, rotation);
        if (p.z > 0 || true) {
          pts.push({ x: cx + p.x, y: cy - p.y, z: p.z });
        }
      }
      if (pts.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (var k = 1; k < pts.length; k++) {
          ctx.lineTo(pts[k].x, pts[k].y);
        }
        ctx.stroke();
      }
    }

    // 大陆形状（简化多边形，投影到球面）
    var continents = [
      // 亚欧大陆
      { color: '#2d6a2d', pts: [[52,38],[55,35],[60,30],[70,28],[80,30],[85,35],[88,42],[85,48],[80,52],[70,54],[60,52],[55,48],[52,42]] },
      // 中国区域（突出）
      { color: '#3a8a33', pts: [[70,30],[74,27],[80,28],[83,32],[85,38],[82,42],[78,44],[74,45],[70,42],[68,38]] },
      // 非洲
      { color: '#4a7a2d', pts: [[55,52],[56,48],[58,44],[62,42],[64,46],[65,52],[64,60],[62,66],[58,66],[56,60]] },
      // 北美
      { color: '#3a7a2d', pts: [[18,28],[22,24],[30,22],[38,24],[42,28],[44,34],[42,40],[38,44],[32,46],[26,44],[20,38]] },
      // 南美
      { color: '#3a7a2d', pts: [[32,50],[34,46],[38,44],[42,46],[44,52],[43,60],[40,66],[36,70],[34,68],[32,60]] },
      // 澳大利亚
      { color: '#6a8a3d', pts: [[82,58],[85,56],[88,56],[90,58],[92,62],[90,66],[86,68],[83,66]] },
    ];

    continents.forEach(function(cont) {
      ctx.beginPath();
      var started = false;
      cont.pts.forEach(function(pt) {
        var lat = pt[1], lon = pt[0];
        var p = latLonToXYZ(lat, lon, radius * 0.97);
        p = rotateY(p, rotation);
        var sx = cx + p.x, sy = cy - p.y;
        if (p.z > -radius * 0.3) {
          if (!started) { ctx.moveTo(sx, sy); started = true; }
          else ctx.lineTo(sx, sy);
        }
      });
      ctx.closePath();
      ctx.fillStyle = cont.color;
      ctx.fill();
    });

    // 中国位置标记（红点）
    var china = latLonToXYZ(30, 115, radius * 0.97);
    china = rotateY(china, rotation);
    if (china.z > 0) {
      ctx.beginPath();
      ctx.arc(cx + china.x, cy - china.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ff4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 大气辉光
    var glow = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.15);
    glow.addColorStop(0, 'rgba(100,180,255,0)');
    glow.addColorStop(0.7, 'rgba(100,180,255,0.05)');
    glow.addColorStop(1, 'rgba(100,180,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  function animate() {
    if (!isActive) return;
    animId = requestAnimationFrame(animate);

    var elapsed = (Date.now() - startTime) / 1000;

    ctx.clearRect(0, 0, W, H);

    // 星空背景
    var starSeed = 12345;
    for (var si = 0; si < 150; si++) {
      starSeed = (starSeed * 9301 + 49297) % 233280;
      var sx = (starSeed / 233280) * W;
      starSeed = (starSeed * 9301 + 49297) % 233280;
      var sy = (starSeed / 233280) * H;
      starSeed = (starSeed * 9301 + 49297) % 233280;
      var sr = 0.5 + (starSeed / 233280) * 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.3 + Math.random() * 0.5) + ')';
      ctx.fill();
    }

    // 计算地球位置和大小
    var maxDist = 3.5;
    var minDist = 1.0;
    var earthRadius = Math.min(W, H) * 0.25;

    if (phase === 'orbiting') {
      earthRotation += 0.008;
      cameraDist = maxDist;
      if (elapsed > 4) {
        phase = 'zooming';
      }
    }

    if (phase === 'zooming') {
      var progress = Math.min(1, (elapsed - 4) / 3);
      earthRotation += 0.006 * (1 - progress * 0.5);
      cameraDist = maxDist - (maxDist - minDist) * progress;
      // 视野中心移向中国
      cameraTargetX = progress * 0.2 * W;
      cameraTargetY = -progress * 0.05 * H;
    }

    if (phase === 'transitioning') {
      earthRotation += 0.003;
    }

    var cx = W / 2 + cameraTargetX;
    var cy = H / 2 + cameraTargetY;
    var r = earthRadius / Math.max(1, cameraDist * 0.6);

    drawEarth(cx, cy, r, earthRotation);

    // 底部文字提示
    if (phase === 'orbiting') {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('正在进入中国区域...', W / 2, H - 30);
    }

    // 缩放完成后自动切换到地图
    if (phase === 'zooming' && elapsed - 4 >= 3) {
      phase = 'transitioning';
      setTimeout(function() {
        if (!isActive) return;
        var style = localStorage.getItem('xie_hero_style');
        if (style === 'globe') {
          localStorage.setItem('xie_hero_style', 'map');
          var mapBtn = document.querySelector('.hbg-btn[data-style="map"]');
          if (mapBtn) mapBtn.click();
        }
      }, 1500);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
