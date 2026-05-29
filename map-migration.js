/* ============================================
   下枫槎村 · 谢氏家族迁徙地图
   Leaflet + OSM 暗色调 + 曲线路径
   版本: 14 — 全路线（含洛阳），循环播放
   ============================================ */
(function () {
  'use strict';

  var ROUTE = [
    { lng: 112.454, lat: 34.620, name: '谢邑',     fullName: '河南洛阳',                  year: '前806年', era: '周代', desc: '周宣王封申伯于谢邑，谢氏得姓' },
    { lng: 120.883, lat: 29.775, name: '东山会稽', fullName: '浙江绍兴·上虞区上浦镇东山村', year: '东汉-东晋', era: '六朝', desc: '传36世，乌衣巷王谢世家' },
    { lng: 121.140, lat: 28.850, name: '临海下渡', fullName: '浙江台州·临海市古渡口',       year: '唐末五代', era: '唐宋', desc: '传24世，迁居台州临海' },
    { lng: 121.380, lat: 29.120, name: '石马',     fullName: '浙江台州·三门县珠岙镇石马村',  year: '北宋初',  era: '北宋', desc: '小四公为入浙东近祖，传9世' },
    { lng: 121.430, lat: 29.280, name: '岩下',     fullName: '浙江宁波·宁海县跃龙街道岩头下村', year: '约1125年', era: '北宋', desc: '文杲公始迁岩下，枫槎谢氏始迁祖' },
    { lng: 121.445, lat: 29.278, name: '下枫槎村', fullName: '浙江宁波·宁海县跃龙街道望府村',  year: '1572年',  era: '明代', desc: '乾公彬公因水患迁居，开基立业' }
  ];

  var SEGMENT_STYLES = [
    { color: '#d4a037', weight: 2.5 },
    { color: '#22d3ee', weight: 2.5 },
    { color: '#4ade80', weight: 2.5 },
    { color: '#fb923c', weight: 3 },
    { color: '#ef4444', weight: 3.5 }
  ];

  var SEG_TRAVEL = [10000, 4000, 3500, 3500, 3000];
  var SEG_PAUSE  = [3500, 3500, 3500, 3500, 5000];
  var SEG_COUNT = SEG_TRAVEL.length;

  // ---- Segment distances (haversine) ----
  var SEG_DISTANCES = (function () {
    function haversine(lat1, lng1, lat2, lng2) {
      var R = 6371;
      var dlat = (lat2 - lat1) * Math.PI / 180;
      var dlng = (lng2 - lng1) * Math.PI / 180;
      var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dlng / 2) * Math.sin(dlng / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    var result = [];
    for (var i = 0; i < ROUTE.length - 1; i++) {
      result.push(Math.round(haversine(ROUTE[i].lat, ROUTE[i].lng, ROUTE[i + 1].lat, ROUTE[i + 1].lng)));
    }
    return result;
  })();

  // ---- Pre-compute curved paths for each segment (quadratic bezier) ----
  var CURVED_SEGMENTS = (function () {
    var pts = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    var result = [];

    for (var s = 0; s < SEG_COUNT; s++) {
      var p1 = pts[s], p2 = pts[s + 1];
      var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      var len = Math.sqrt(dx * dx + dy * dy);

      // Number of sub-points based on segment length
      var subSteps;
      if (len > 5) subSteps = 50;
      else if (len > 1) subSteps = 35;
      else if (len > 0.1) subSteps = 22;
      else subSteps = 10;

      // Control point — perpendicular offset, alternating sides for visual variety
      var sign = (s % 2 === 0) ? 1 : -1;
      var nx = -dy / len * sign;
      var ny =  dx / len * sign;
      var offset = Math.min(len * 0.12, 1.0);
      var cp = [
        (p1[0] + p2[0]) / 2 + nx * offset,
        (p1[1] + p2[1]) / 2 + ny * offset
      ];

      // Quadratic bezier interpolation
      var segPts = [];
      for (var i = 0; i <= subSteps; i++) {
        var t = i / subSteps;
        var u = 1 - t;
        segPts.push([
          u * u * p1[0] + 2 * u * t * cp[0] + t * t * p2[0],
          u * u * p1[1] + 2 * u * t * cp[1] + t * t * p2[1]
        ]);
      }
      result.push(segPts);
    }
    return result;
  })();

  var map = null;
  var container = null;
  var isActive = false;

  var allSegments = [];
  var progressLine = null;
  var movingDot = null;
  var dotGlow = null;
  var destMarkers = [];
  var labelMarkers = [];
  var nodeClickMarkers = [];

  var animId = null;
  var startTime = 0;
  var isPaused = false;
  var infoPanel = null;

  function init() {
    container = document.getElementById('map-bg');
    if (!container) return;

    document.addEventListener('xie-bg-mode', function (e) {
      if (e.detail === 'map') {
        ensureLeaflet(activate);
      } else {
        deactivate();
      }
    });

    var hs = localStorage.getItem('xie_hero_style') || 'clean';
    if (hs === 'map') {
      setTimeout(function() { ensureLeaflet(activate); }, 200);
    }
  }

  function ensureLeaflet(callback) {
    if (typeof L !== 'undefined') { callback(); return; }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = function () { setTimeout(callback, 150); };
    script.onerror = function () {
      console.warn('[MapMigration] Leaflet CDN 失败');
      isActive = false;
    };
    document.body.appendChild(script);
  }

  function activate() {
    if (isActive) return;
    isActive = true;
    if (!map) createMap();
    container.classList.add('active');
    if (map) setTimeout(function () { map.invalidateSize(); }, 50);
    setTimeout(startAnim, 600);
  }

  function deactivate() {
    if (!isActive) return;
    isActive = false;
    stopAnim();
    hideNodeInfo();
    container.classList.remove('active');
  }

  function createMap() {
    map = L.map('map-bg', {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: false,
      touchZoom: true,
      keyboard: false,
      zoomSnap: 0.5
    });

    // 缩放按钮（绑定侧边栏中已有的 + / − 按钮）
    var zi = document.querySelector('.map-z-in');
    var zo = document.querySelector('.map-z-out');
    if (!zi || !zo) {
      var zoomDiv = document.createElement('div');
      zoomDiv.className = 'map-zoom-btns';
      zoomDiv.innerHTML = '<button class="map-z-in" title="放大">+</button><button class="map-z-out" title="缩小">−</button>';
      document.body.appendChild(zoomDiv);
      zi = zoomDiv.querySelector('.map-z-in');
      zo = zoomDiv.querySelector('.map-z-out');
    }
    if (zi) zi.onclick = function () { if (map) map.zoomIn(); };
    if (zo) zo.onclick = function () { if (map) map.zoomOut(); };

    // 高德地图瓦片（国内可访问，通过 CSS 暗化处理达到暗色调效果）
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['1', '2', '3', '4']
    }).addTo(map);

    var latlngs = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    map.fitBounds(latlngs, { padding: [60, 60], maxZoom: 7.5 });

    // 1) 完整路线（弯曲路径）
    for (var i = 0; i < CURVED_SEGMENTS.length; i++) {
      var style = SEGMENT_STYLES[i] || { color: '#888', weight: 2 };
      allSegments.push(L.polyline(CURVED_SEGMENTS[i], {
        color: style.color,
        weight: style.weight,
        opacity: 0.6
      }).addTo(map));
    }

    // 2) 高亮进度线
    progressLine = L.polyline([], {
      color: '#fbbf24',
      weight: 4,
      opacity: 0.9
    }).addTo(map);

    // 3) 行进人形
    var personIcon = L.divIcon({
      className: 'map-person-icon',
      html: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none">' +
        '<circle cx="12" cy="4" r="2.5" fill="#fbbf24"/>' +
        '<path d="M12 6.5 L12 13" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M7.5 9.5 L16.5 9.5" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M12 13 L7 19" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M12 13 L16 18" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>',
      iconSize: [26, 26],
      iconAnchor: [13, 20]
    });
    movingDot = L.marker(latlngs[0], { icon: personIcon, interactive: false, zIndexOffset: 1000 }).addTo(map);
    dotGlow = L.circleMarker(latlngs[0], {
      radius: 14,
      color: '#fbbf24',
      fillColor: '#fbbf24',
      fillOpacity: 0.15,
      weight: 0,
      className: 'map-dot-glow'
    }).addTo(map);

    // 4) 终点脉冲
    var dest = latlngs[latlngs.length - 1];
    destMarkers.push(L.circleMarker(dest, {
      radius: 14, color: '#ef4444', fillColor: '#ef4444',
      fillOpacity: 0.2, weight: 2, opacity: 0, className: 'map-dest-pulse'
    }).addTo(map));
    destMarkers.push(L.circleMarker(dest, {
      radius: 22, color: '#ef4444', fillColor: '#ef4444',
      fillOpacity: 0.08, weight: 0, opacity: 0
    }).addTo(map));

    // 5) 途经点标签
    ROUTE.forEach(function (wp, i) {
      var segStyle = SEGMENT_STYLES[Math.min(i, SEGMENT_STYLES.length - 1)] || { color: '#888' };
      var extraClass = '';
      var anchorY = 0;
      if (i === 4) {        // 岩下：标签向上，距离收近
        extraClass = ' map-wp-inner-up';
        anchorY = 55;
      } else if (i === 5) { // 下枫槎：标签向下
        extraClass = ' map-wp-inner-down';
        anchorY = 0;
      }

      var coordText = wp.lat.toFixed(3) + ', ' + wp.lng.toFixed(3);
      var icon = L.divIcon({
        className: 'map-wp-label',
        html: '<div class="map-wp-inner' + extraClass + '">' +
          '<span class="map-wp-era" style="background:' + segStyle.color + '">' + wp.era + '</span>' +
          '<span class="map-wp-year">' + wp.year + '</span>' +
          '<span class="map-wp-name">' + wp.name + '</span>' +
          '<span class="map-wp-addr">' + wp.fullName + '</span>' +
          '<span class="map-wp-coord">' + coordText + '</span>' +
          '<span class="map-wp-desc">' + wp.desc + '</span></div>',
        iconSize: [180, 100],
        iconAnchor: [90, anchorY]
      });
      labelMarkers.push(L.marker([wp.lat, wp.lng], {
        icon: icon, opacity: 0, interactive: false
      }).addTo(map));
    });

    // 6) 分段距离标注（在路线中间）
    CURVED_SEGMENTS.forEach(function (seg, i) {
      var mid = seg[Math.floor(seg.length / 2)];
      var distKm = SEG_DISTANCES[i];
      var icon = L.divIcon({
        className: 'map-dist-label',
        html: '<span>' + distKm + ' km</span>',
        iconSize: [56, 18],
        iconAnchor: [28, 9]
      });
      L.marker(mid, { icon: icon, interactive: false, opacity: 0.8 }).addTo(map);
    });

    // 7) 可点击节点
    ROUTE.forEach(function (wp, i) {
      var cm = L.circleMarker([wp.lat, wp.lng], {
        radius: 16,
        color: 'transparent',
        fillColor: 'transparent',
        fillOpacity: 0,
        weight: 0,
        className: 'map-node-clickable',
        interactive: true
      }).addTo(map);
      (function(idx) {
        cm.on('click', function () { onNodeClick(idx); });
      })(i);
      nodeClickMarkers.push(cm);
    });

    // 8) 节点信息面板
    infoPanel = document.createElement('div');
    infoPanel.className = 'map-node-info';
    infoPanel.innerHTML = '<div class="n-era"></div>' +
      '<div class="n-year"></div>' +
      '<div class="n-name"></div>' +
      '<div class="n-addr"></div>' +
      '<div class="n-coord"></div>' +
      '<div class="n-desc"></div>' +
      '<div class="n-close" onclick="MapMigration.resume()">— 继续 —</div>';
    container.appendChild(infoPanel);

    movingDot.setLatLng(CURVED_SEGMENTS[0][0]);
    dotGlow.setLatLng(CURVED_SEGMENTS[0][0]);
  }

  function startAnim() {
    if (isPaused) { isPaused = false; }
    startTime = performance.now();

    var totalCycle = 0;
    for (var i = 0; i < SEG_COUNT; i++) totalCycle += SEG_TRAVEL[i] + SEG_PAUSE[i];

    function frame(now) {
      if (!isActive || isPaused) { animId = requestAnimationFrame(frame); return; }
      var elapsed = now - startTime;
      var t = elapsed % totalCycle;
      var cum = 0;

      for (var segIdx = 0; segIdx < SEG_COUNT; segIdx++) {
        if (t < cum + SEG_TRAVEL[segIdx]) {
          var segP = (t - cum) / SEG_TRAVEL[segIdx];
          updateAnimation(segIdx, segP, now);
          break;
        }
        cum += SEG_TRAVEL[segIdx];
        if (t < cum + SEG_PAUSE[segIdx]) {
          updateAnimation(segIdx, 1.0, now);
          break;
        }
        cum += SEG_PAUSE[segIdx];
      }
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
  }

  function stopAnim() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }

  function onNodeClick(idx) {
    if (idx < 0 || idx >= ROUTE.length) return;
    isPaused = true;
    var wp = ROUTE[idx];
    var segStyle = SEGMENT_STYLES[Math.min(idx, SEGMENT_STYLES.length - 1)] || { color: '#888' };

    var zoom = map.getZoom();
    if (idx >= 4 && zoom < 13) zoom = 13;
    map.setView([wp.lat, wp.lng], zoom, { animate: true });

    labelMarkers.forEach(function (m, i) {
      m.setOpacity(i === idx ? 1 : 0.15);
    });

    if (infoPanel) {
      infoPanel.querySelector('.n-era').textContent = wp.era;
      infoPanel.querySelector('.n-era').style.background = segStyle.color;
      infoPanel.querySelector('.n-year').textContent = wp.year;
      infoPanel.querySelector('.n-name').textContent = wp.name;
      infoPanel.querySelector('.n-addr').textContent = wp.fullName;
      infoPanel.querySelector('.n-coord').textContent = wp.lat.toFixed(3) + ', ' + wp.lng.toFixed(3);
      infoPanel.querySelector('.n-desc').textContent = wp.desc;
      infoPanel.classList.add('show');
    }
  }

  function hideNodeInfo() {
    if (infoPanel) infoPanel.classList.remove('show');
  }

  function resumeAnim() {
    hideNodeInfo();
    labelMarkers.forEach(function (m) { m.setOpacity(0); });
    if (isPaused) {
      isPaused = false;
      startTime = performance.now();
    }
  }

  // ---- Animation update with curved path support ----
  function updateAnimation(segIdx, segP, now) {
    // Build cumulative trail from all completed segments + partial current segment
    var allPts = [];
    for (var i = 0; i < segIdx; i++) {
      allPts = allPts.concat(CURVED_SEGMENTS[i]);
    }
    var curSeg = CURVED_SEGMENTS[segIdx];
    var steps = curSeg.length - 1;
    var ptF = segP * steps;
    var ptIdx = Math.min(Math.floor(ptF), steps - 1);
    var ptT = ptF - ptIdx;

    allPts = allPts.concat(curSeg.slice(0, ptIdx + 1));
    if (ptIdx < steps) {
      var a = curSeg[ptIdx], b = curSeg[ptIdx + 1];
      allPts.push([a[0] + (b[0] - a[0]) * ptT, a[1] + (b[1] - a[1]) * ptT]);
    }

    progressLine.setLatLngs(allPts);

    var curStyle = SEGMENT_STYLES[Math.min(segIdx, SEG_COUNT - 1)] || { color: '#fbbf24' };
    progressLine.setStyle({ color: curStyle.color });

    var overallP = (segIdx + segP) / SEG_COUNT;

    if (allPts.length > 0) {
      var pos = allPts[allPts.length - 1];
      movingDot.setLatLng(pos);
      dotGlow.setLatLng(pos);
      dotGlow.setRadius(12 + overallP * 8);
    }

    // Label opacity
    var totalLen = ROUTE.length - 1;
    labelMarkers.forEach(function (m, i) {
      var wpP = i / totalLen;
      var dist = Math.abs(overallP - wpP);
      var opacity = 0;
      if (overallP >= wpP && dist < 0.20) {
        opacity = Math.min(1, (1 - dist / 0.20) * 1.3);
      }
      m.setOpacity(opacity);
    });

    // Destination pulse
    destMarkers.forEach(function (dm, i) {
      var dO = overallP >= 0.98 ? Math.min(1, (overallP - 0.98) * 50) : 0;
      dm.setStyle({ opacity: dO, fillOpacity: dO * (i === 0 ? 0.2 : 0.08) });
      if (i === 0) dm.setRadius(14 + Math.sin(now / 300) * 3);
      else dm.setRadius(22 + Math.sin(now / 400 + 1) * 4);
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  window.MapMigration = {
    isActive: function () { return isActive; },
    resume: resumeAnim,
    toggle: function () {
      if (isActive) {
        document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'particle' }));
      } else {
        document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'map' }));
      }
    }
  };

})();
