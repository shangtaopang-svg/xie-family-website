/* ============================================
   下枫槎村 · 谢氏家族迁徙地图
   Leaflet + OpenStreetMap 背景模式
   ============================================ */
(function () {
  'use strict';

  // ============================================================
  //  一、迁徙路线数据（坐标顺序：经度, 纬度）
  // ============================================================
  var ROUTE = [
    { lng: 112.528, lat: 32.990, name: '谢邑',    fullName: '河南南阳 · 谢邑',        year: '前806年', desc: '周宣王封申伯于谢邑，谢氏得姓' },
    { lng: 120.580, lat: 30.000, name: '会稽',    fullName: '浙江绍兴 · 会稽',        year: '东晋',     desc: '随晋室南渡，乌衣巷王谢世家' },
    { lng: 121.140, lat: 28.850, name: '临海',    fullName: '浙江临海 · 台州',        year: '唐-宋',   desc: '谢安后裔分支迁居台州' },
    { lng: 121.430, lat: 29.280, name: '宁海岩下', fullName: '宁海 · 岩头下',          year: '明初',     desc: '从临海迁入宁海岩下居住' },
    { lng: 121.445, lat: 29.278, name: '下枫槎村', fullName: '宁海 · 下枫槎村',       year: '1572年',  desc: '明隆庆六年因水患举族迁居' }
  ];

  // ============================================================
  //  二、状态变量
  // ============================================================
  var map = null;
  var container = null;
  var isActive = false;

  // Leaflet 图层
  var fullLine = null;       // 完整路线（暗色底）
  var progressLine = null;   // 高亮行进段
  var movingDot = null;      // 移动圆点
  var destMarker = null;     // 终点脉冲标记
  var labelMarkers = [];     // 途经点标签

  // 动画
  var animId = null;
  var startTime = 0;

  // DOM 缓存
  var bgCanvas = null;

  // ============================================================
  //  三、核心函数
  // ============================================================

  /** 初始化（页面加载时调用一次） */
  function init() {
    container = document.getElementById('map-bg');
    if (!container) return;

    bgCanvas = document.getElementById('bg-canvas');

    // 监听全局背景模式切换
    document.addEventListener('xie-bg-mode', function (e) {
      if (e.detail === 'map') {
        ensureLeaflet(activate);
      } else {
        deactivate();
      }
    });

    // 初始化时检查 hero_style，如果是地图模式则激活
    var hs = localStorage.getItem('xie_hero_style') || 'clean';
    if (hs === 'map') {
      setTimeout(function() { ensureLeaflet(activate); }, 200);
    }
  }

  /** 确保 Leaflet 已加载，未加载则动态拉取 */
  function ensureLeaflet(callback) {
    if (typeof L !== 'undefined') { callback(); return; }
    // 动态加载 Leaflet CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    // 动态加载 Leaflet JS
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = function () { setTimeout(callback, 150); };
    script.onerror = function () {
      console.warn('[MapMigration] Leaflet CDN 加载失败');
      isActive = false;
    };
    document.body.appendChild(script);
  }

  /** 激活地图背景 */
  function activate() {
    if (isActive) return;
    isActive = true;

    // 首次创建地图
    if (!map) createMap();

    container.classList.add('active');

    // 确保地图正确渲染（容器从隐藏变为可见时）
    if (map) setTimeout(function () { map.invalidateSize(); }, 50);

    // 隐藏 Canvas 粒子背景
    if (bgCanvas) bgCanvas.style.display = 'none';

    // 延迟启动动画（等地图渲染完成）
    setTimeout(startAnim, 600);
  }

  /** 停用地地图背景 */
  function deactivate() {
    if (!isActive) return;
    isActive = false;

    stopAnim();
    container.classList.remove('active');

    // 恢复 Canvas 粒子背景
    if (bgCanvas) bgCanvas.style.display = '';
  }

  // ============================================================
  //  四、创建地图
  // ============================================================
  function createMap() {
    map = L.map('map-bg', {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
      zoomSnap: 0.5
    });

    // OSM 底图
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // 计算视口自适应所有途经点
    var pts = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    map.fitBounds(pts, { padding: [60, 60], maxZoom: 8 });

    // 创建路线图层
    var latlngs = ROUTE.map(function (p) { return [p.lat, p.lng]; });

    // 1) 完整路线（暗淡底色）
    fullLine = L.polyline(latlngs, {
      color: '#d4773a',
      weight: 2,
      opacity: 0.25,
      dashArray: '6,8'
    }).addTo(map);

    // 2) 高亮进度线（开始时隐藏）
    progressLine = L.polyline([], {
      color: '#fb923c',
      weight: 3.5,
      opacity: 0.9
    }).addTo(map);

    // 3) 移动圆点（开始时隐藏）
    movingDot = L.circleMarker(latlngs[0], {
      radius: 6,
      color: '#fb923c',
      fillColor: '#fff',
      fillOpacity: 0.9,
      weight: 2.5,
      opacity: 1
    }).addTo(map);

    // 4) 终点大标记（开始时隐藏）
    var dest = latlngs[latlngs.length - 1];
    destMarker = L.circleMarker(dest, {
      radius: 12,
      color: '#d4773a',
      fillColor: '#d4773a',
      fillOpacity: 0.3,
      weight: 2,
      opacity: 0,
      className: 'map-dest-pulse'
    }).addTo(map);

    // 5) 途经点标签
    ROUTE.forEach(function (wp, i) {
      var icon = L.divIcon({
        className: 'map-wp-label',
        html: '<div class="map-wp-inner">' +
          '<span class="map-wp-year">' + wp.year + '</span>' +
          '<span class="map-wp-name">' + wp.name + '</span>' +
          '<span class="map-wp-desc">' + wp.desc + '</span>' +
          '</div>',
        iconSize: [120, 60],
        iconAnchor: [60, 0]
      });
      var m = L.marker([wp.lat, wp.lng], {
        icon: icon,
        opacity: 0,
        interactive: false
      }).addTo(map);
      labelMarkers.push(m);
    });

    // 行进圆点归位到起点
    movingDot.setLatLng(latlngs[0]);
  }

  // ============================================================
  //  五、动画系统
  // ============================================================
  function startAnim() {
    startTime = performance.now();
    function frame(now) {
      if (!isActive) return;
      var elapsed = now - startTime;

      // 动画周期：8s 行进 + 4s 停顿 = 12s 总周期
      var cycle = 12000;
      var t = (elapsed % cycle) / cycle; // 0 → 1 → 0（取模）
      var progress = Math.min(t * (cycle / (cycle - 4000)), 1); // 前 8s 行进

      updateAnimation(progress);
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
  }

  function stopAnim() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // ============================================================
  //  六、根据进度更新动画
  // ============================================================
  function updateAnimation(progress) {
    var pts = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    var totalLen = pts.length - 1; // 4 段

    // --- 高亮线 ---
    var segF = progress * totalLen;
    var segIdx = Math.min(Math.floor(segF), totalLen - 1);
    var segT = segF - segIdx;

    var shown = pts.slice(0, segIdx + 1);
    if (segIdx < totalLen) {
      var a = pts[segIdx];
      var b = pts[segIdx + 1];
      shown.push([
        a[0] + (b[0] - a[0]) * segT,
        a[1] + (b[1] - a[1]) * segT
      ]);
    }
    progressLine.setLatLngs(shown);

    // --- 行进圆点 ---
    if (shown.length > 0) {
      var pos = shown[shown.length - 1];
      movingDot.setLatLng(pos);
    }

    // --- 途经点标签淡入 ---
    labelMarkers.forEach(function (m, i) {
      var wpProgress = i / totalLen;
      var dist = Math.abs(progress - wpProgress);
      var opacity = 0;
      if (progress >= wpProgress && dist < 0.35) {
        opacity = Math.min(1, (1 - dist / 0.35) * 1.2);
      }
      m.setOpacity(opacity);
    });

    // --- 终点脉冲 ---
    var destOpacity = progress >= 0.98 ? Math.min(1, (progress - 0.98) * 50) : 0;
    destMarker.setStyle({ opacity: destOpacity, fillOpacity: destOpacity * 0.3 });
    destMarker.setRadius(12 + Math.sin(performance.now() / 300) * 3);

    // --- 终点发光标记 ---
    if (progress >= 1) {
      movingDot.setRadius(7 + Math.sin(performance.now() / 200) * 2);
    } else {
      movingDot.setRadius(6);
    }
  }

  // ============================================================
  //  七、页面加载后启动
  // ============================================================
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  // 暴露给全局，供 HTML 按钮调用
  window.MapMigration = {
    isActive: function () { return isActive; },
    toggle: function () {
      if (isActive) {
        document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'particle' }));
      } else {
        document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'map' }));
      }
    }
  };

})();
