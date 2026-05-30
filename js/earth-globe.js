/* ============================================
   3D 地球 — Three.js 太空俯瞰
   ============================================ */
(function () {
  'use strict';

  var container = null;
  var scene, camera, renderer, earth, atmosphere;
  var isActive = false;
  var animId = null;
  var phase = 'idle'; // idle | orbiting | zooming | transitioning
  var clock = null;
  var startTime = 0;

  // 经纬度转三维坐标
  function latLonToVec3(lat, lon, radius) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = lon * Math.PI / 180;
    return {
      x: -radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }

  // 生成程序化地球纹理（Canvas绘制）
  function generateEarthTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    var ctx = canvas.getContext('2d');

    // 海洋渐变
    var grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#1a2a6c');
    grad.addColorStop(0.3, '#1e3a6e');
    grad.addColorStop(0.5, '#1e5799');
    grad.addColorStop(0.7, '#1e3a6e');
    grad.addColorStop(1, '#1a2a6c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 绘制简化的大陆形状
    function drawContinent(points, color) {
      ctx.beginPath();
      ctx.moveTo(points[0][0] * 1024, points[0][1] * 512);
      for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0] * 1024, points[i][1] * 512);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    var landColor = '#2d5a27';
    var sandColor = '#5a7a3a';
    var iceColor = '#8ab8a0';

    // 亚欧大陆（简化）
    drawContinent([
      [0.52,0.48],[0.55,0.38],[0.58,0.30],[0.62,0.28],[0.68,0.30],
      [0.72,0.28],[0.78,0.30],[0.82,0.35],[0.85,0.40],[0.88,0.45],
      [0.86,0.50],[0.82,0.52],[0.78,0.54],[0.72,0.55],[0.68,0.52],
      [0.62,0.53],[0.58,0.55],[0.55,0.52],[0.52,0.48]
    ], landColor);

    // 中国区域（突出显示）
    drawContinent([
      [0.68,0.32],[0.70,0.28],[0.74,0.27],[0.78,0.29],[0.80,0.32],
      [0.82,0.36],[0.81,0.40],[0.79,0.42],[0.76,0.44],[0.72,0.45],
      [0.69,0.42],[0.67,0.38],[0.68,0.34],[0.68,0.32]
    ], '#3a7a33');

    // 非洲
    drawContinent([
      [0.55,0.52],[0.56,0.48],[0.58,0.44],[0.60,0.42],[0.62,0.44],
      [0.64,0.48],[0.65,0.54],[0.64,0.60],[0.62,0.66],[0.60,0.68],
      [0.58,0.66],[0.56,0.60],[0.55,0.55],[0.55,0.52]
    ], landColor);

    // 北美
    drawContinent([
      [0.18,0.30],[0.22,0.26],[0.28,0.24],[0.34,0.25],[0.38,0.28],
      [0.40,0.32],[0.39,0.38],[0.36,0.42],[0.32,0.44],[0.28,0.43],
      [0.24,0.40],[0.20,0.36],[0.18,0.32],[0.18,0.30]
    ], landColor);

    // 南美
    drawContinent([
      [0.30,0.50],[0.32,0.46],[0.35,0.44],[0.38,0.46],[0.40,0.50],
      [0.41,0.56],[0.40,0.62],[0.38,0.68],[0.36,0.72],[0.34,0.70],
      [0.32,0.64],[0.30,0.58],[0.30,0.52],[0.30,0.50]
    ], landColor);

    // 澳大利亚
    drawContinent([
      [0.82,0.58],[0.84,0.56],[0.88,0.56],[0.90,0.58],[0.91,0.62],
      [0.89,0.65],[0.86,0.66],[0.83,0.64],[0.82,0.60],[0.82,0.58]
    ], sandColor);

    // 标注中国位置（小标记）
    ctx.beginPath();
    ctx.arc(0.75, 0.37, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 经纬网格线
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    for (var lat = 0; lat < 360; lat += 30) {
      ctx.beginPath();
      ctx.moveTo(lat * 1024 / 360, 0);
      ctx.lineTo(lat * 1024 / 360, 512);
      ctx.stroke();
    }
    for (var lon = 0; lon < 180; lon += 30) {
      ctx.beginPath();
      ctx.moveTo(0, lon * 512 / 180);
      ctx.lineTo(1024, lon * 512 / 180);
      ctx.stroke();
    }

    return canvas;
  }

  function init() {
    container = document.getElementById('globe-container');
    if (!container) return;

    // 监听背景模式切换
    document.addEventListener('xie-bg-mode', function(e) {
      if (e.detail === 'globe') {
        if (!isActive) activate();
      } else {
        deactivate();
      }
    });

    // 自动检测默认模式
    var style = localStorage.getItem('xie_hero_style') || 'clean';
    if (style === 'globe') {
      // 初始化后再激活
      setTimeout(function() {
        document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'globe' }));
      }, 500);
    }
  }

  function loadThreeJs(callback) {
    if (typeof THREE !== 'undefined') { callback(); return; }
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = callback;
    script.onerror = function() {
      console.warn('[EarthGlobe] Three.js CDN 失败');
      isActive = false;
    };
    document.body.appendChild(script);
  }

  function activate() {
    if (isActive) return;
    isActive = true;
    clock = new THREE.Clock();
    startTime = Date.now();
    loadThreeJs(function() {
      createScene();
      container.style.display = 'block';
      phase = 'orbiting';
      animate();
    });
  }

  function deactivate() {
    if (!isActive) return;
    isActive = false;
    phase = 'idle';
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
    if (scene) {
      while (scene.children.length > 0) {
        var child = scene.children[0];
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
        scene.remove(child);
      }
      scene = null;
    }
    camera = null;
    earth = null;
    atmosphere = null;
    if (container) container.style.display = 'none';
  }

  function createScene() {
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3.5);

    // Earth sphere
    var geometry = new THREE.SphereGeometry(1, 64, 64);
    var textureCanvas = generateEarthTexture();
    var texture = new THREE.CanvasTexture(textureCanvas);
    var material = new THREE.MeshPhongMaterial({
      map: texture,
      specular: new THREE.Color(0x333333),
      shininess: 10,
    });
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Atmosphere glow
    var atmoGeom = new THREE.SphereGeometry(1.02, 64, 64);
    var atmoMat = new THREE.ShaderMaterial({
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec3 vPosition;',
        'void main() {',
        '  vNormal = normalize(normalMatrix * normal);',
        '  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'varying vec3 vPosition;',
        'void main() {',
        '  vec3 viewDir = normalize(-vPosition);',
        '  float intensity = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);',
        '  gl_FragColor = vec4(0.3, 0.6, 1.0, intensity * 0.6);',
        '}'
      ].join('\n'),
      transparent: true,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    atmosphere = new THREE.Mesh(atmoGeom, atmoMat);
    scene.add(atmosphere);

    // Stars background
    var starsGeom = new THREE.BufferGeometry();
    var starCount = 2000;
    var positions = new Float32Array(starCount * 3);
    var sizes = new Float32Array(starCount);
    for (var i = 0; i < starCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var r = 80 + Math.random() * 20;
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.cos(phi);
      positions[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 0.5 + Math.random() * 1.5;
    }
    starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    var starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.8
    });
    var stars = new THREE.Points(starsGeom, starsMat);
    scene.add(stars);

    // Lights
    var ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    var backLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    backLight.position.set(-3, -1, -5);
    scene.add(backLight);

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Handle resize
    window.addEventListener('resize', function() {
      if (!camera || !renderer || !container) return;
      var w = container.clientWidth;
      var h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  function animate() {
    if (!isActive) return;
    animId = requestAnimationFrame(animate);

    var delta = clock.getDelta();
    var elapsed = (Date.now() - startTime) / 1000;

    if (!earth) return;

    // Phase 1: 轨道旋转（太空俯瞰地球）
    if (phase === 'orbiting') {
      earth.rotation.y += delta * 0.15;
      if (atmosphere) atmosphere.rotation.y = earth.rotation.y;

      // 5秒后开始拉近
      if (elapsed > 5) {
        phase = 'zooming';
      }
    }

    // Phase 2: 镜头拉近中国
    if (phase === 'zooming') {
      var zoomProgress = Math.min(1, (elapsed - 5) / 4);
      earth.rotation.y += delta * 0.1;

      // 镜头位置：从 (0,0,3.5) 移到中国附近
      var chinaPos = latLonToVec3(29.3, 121.4, 1.5);
      var startPos = { x: 0, y: 0, z: 3.5 };
      var cx = startPos.x + (chinaPos.x - startPos.x) * zoomProgress;
      var cy = startPos.y + (chinaPos.y - startPos.y) * zoomProgress;
      var cz = startPos.z + (chinaPos.z - startPos.z) * zoomProgress;

      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0, 0);

      // 相机视野缩小（变焦）
      camera.fov = 35 - zoomProgress * 15;
      camera.updateProjectionMatrix();

      if (zoomProgress >= 1) {
        phase = 'transitioning';
        // 延迟后切换到迁徙地图
        setTimeout(function() {
          if (!isActive) return;
          // 切换背景到地图模式
          var heroStyle = localStorage.getItem('xie_hero_style');
          if (heroStyle === 'globe') {
            localStorage.setItem('xie_hero_style', 'map');
            document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'map' }));
            // 同步UI按钮
            var mapBtn = document.querySelector('.hbg-btn[data-style="map"]');
            if (mapBtn) mapBtn.click();
          }
        }, 2000);
      }
    }

    // Phase 3: 过渡中 — 继续缓慢旋转
    if (phase === 'transitioning') {
      earth.rotation.y += delta * 0.05;
      if (atmosphere) atmosphere.rotation.y = earth.rotation.y;
    }

    renderer.render(scene, camera);
  }

  // 启动
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
