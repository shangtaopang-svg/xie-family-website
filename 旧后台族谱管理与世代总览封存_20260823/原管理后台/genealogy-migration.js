/* ============================================
   族谱查询 · 谢氏迁徙互动地图
   Leaflet + 高德瓦片 + 动画路径 + 节点详情
   独立版，用于 genealogy.html
   ============================================ */
(function () {
  'use strict';

  var ROUTE = [
    {
      lng: 112.454, lat: 34.620,
      name: '谢邑', fullName: '河南洛阳',
      year: '前806年', era: '周代',
      icon: '🏮',
      desc: '周宣王封元舅申伯于谢邑，子孙以国为氏，谢氏自此得姓，至今两千八百余年。'
    },
    {
      lng: 120.883, lat: 29.775,
      name: '东山会稽', fullName: '浙江绍兴·上虞区上浦镇东山村',
      year: '东汉-东晋', era: '六朝',
      icon: '🏛️',
      desc: '谢氏传三十六世至会稽。东晋谢安、谢玄叔侄淝水之战以八万破百万，与王氏并称"王谢"，为天下望族之冠。'
    },
    {
      lng: 121.219, lat: 28.865,
      name: '临海下渡', fullName: '浙江台州·临海市邵家渡街道下渡村',
      year: '唐末', era: '唐末',
      icon: '⛵',
      desc: '东山会稽谢氏一支南下，经临海古渡口进入台州腹地。临海为浙东南迁重要节点，由此再分迁石马、天台等地。'
    },
    {
      lng: 121.290, lat: 29.065,
      name: '石马（下谢）', fullName: '浙江台州·三门县珠岙镇石马村',
      year: '北宋初', era: '北宋',
      icon: '🏘️',
      desc: '小四公（谢聪孙）自临海迁居石马，为下枫槎谢氏之直系近祖。此后传十二世，枝繁叶茂。'
    },
    {
      lng: 121.445, lat: 29.253,
      name: '岩下（岩头下）', fullName: '浙江宁波·宁海县跃龙街道岩头下村',
      year: '约1125年', era: '北宋',
      icon: '🌄',
      desc: '文杲公任越溪司巡检，从石马迁居岩下，为枫槎谢氏始迁祖。至今近九百年，传三十六世。'
    },
    {
      lng: 121.452, lat: 29.248,
      name: '下枫槎村', fullName: '浙江宁波·宁海县跃龙街道望府村',
      year: '1572年', era: '明代',
      icon: '🍃',
      desc: '明隆庆六年山洪暴发，乾公、彬公兄弟率族人迁至双枫古槎之下，斩荆棘、辟草莱，开基立业，定名下枫槎。'
    }
  ];

  var SEG_COUNT = ROUTE.length - 1;

  // ---- Distance calculation ----
  function haversine(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dlat = (lat2 - lat1) * Math.PI / 180;
    var dlng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dlng / 2) * Math.sin(dlng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  var SEG_DISTANCES = [];
  for (var i = 0; i < SEG_COUNT; i++) {
    SEG_DISTANCES.push(Math.round(haversine(ROUTE[i].lat, ROUTE[i].lng, ROUTE[i+1].lat, ROUTE[i+1].lng)));
  }

  // ---- Curved paths ----
  var CURVED_SEGMENTS = (function () {
    var pts = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    var result = [];
    for (var s = 0; s < SEG_COUNT; s++) {
      var p1 = pts[s], p2 = pts[s + 1];
      var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      var len = Math.sqrt(dx * dx + dy * dy);
      var subSteps = len > 5 ? 50 : len > 1 ? 35 : len > 0.1 ? 22 : 10;
      var sign = (s % 2 === 0) ? 1 : -1;
      var nx = -dy / len * sign;
      var ny = dx / len * sign;
      var offset = Math.min(len * 0.12, 1.0);
      var cp = [(p1[0] + p2[0]) / 2 + nx * offset, (p1[1] + p2[1]) / 2 + ny * offset];
      var segPts = [];
      for (var i = 0; i <= subSteps; i++) {
        var t = i / subSteps, u = 1 - t;
        segPts.push([u * u * p1[0] + 2 * u * t * cp[0] + t * t * p2[0], u * u * p1[1] + 2 * u * t * cp[1] + t * t * p2[1]]);
      }
      result.push(segPts);
    }
    return result;
  })();

  // ---- State ----
  var container, map, controls, infoPanel;
  var progressLine, movingDot, dotGlow, markers = [];
  var animId = null, startTime = 0, isPlaying = false, currentSeg = 0;
  var currentHighlightIdx = -1;

  // ---- Init ----
  function init() {
    container = document.getElementById('genealogy-migration-map');
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = '1';

    ensureLeaflet(function () {
      createMap();
      createControls();
      createInfoPanel();
    });
  }

  function ensureLeaflet(callback) {
    if (typeof L !== 'undefined') { callback(); return; }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = function () { setTimeout(callback, 200); };
    script.onerror = function () { container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);">地图加载失败，请检查网络后刷新页面</div>'; };
    document.body.appendChild(script);
  }

  function createMap() {
    map = L.map(container, {
      zoomControl: false, attributionControl: false,
      dragging: true, scrollWheelZoom: true, touchZoom: true,
      zoomSnap: 0.5
    });

    // 高德地图瓦片
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      maxZoom: 18, subdomains: ['1', '2', '3', '4']
    }).addTo(map);

    // 适应范围
    var allPts = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    map.fitBounds(allPts, { padding: [60, 60], maxZoom: 7 });

    // 完整路线
    var MAIN_COLOR = '#ef4444';
    for (var i = 0; i < CURVED_SEGMENTS.length; i++) {
      L.polyline(CURVED_SEGMENTS[i], { color: '#ffffff', weight: 6, opacity: 0.15, interactive: false }).addTo(map);
      L.polyline(CURVED_SEGMENTS[i], { color: '#ffffff', weight: 3, opacity: 0.3, interactive: false }).addTo(map);
      L.polyline(CURVED_SEGMENTS[i], { color: MAIN_COLOR, weight: 3, opacity: 0.7 }).addTo(map);
    }

    // 高亮进度线
    progressLine = L.polyline([], { color: '#fbbf24', weight: 4, opacity: 0.9 }).addTo(map);

    // 移动的人形图标
    var personIcon = L.divIcon({
      className: 'gm-person-icon',
      html: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="4" r="2.5" fill="#fbbf24"/><path d="M12 6.5 L12 13" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/><path d="M7.5 9.5 L16.5 9.5" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round"/><path d="M12 13 L7 19" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/><path d="M12 13 L16 18" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/></svg>',
      iconSize: [28, 28], iconAnchor: [14, 22]
    });
    movingDot = L.marker(allPts[0], { icon: personIcon, interactive: false, zIndexOffset: 1000 }).addTo(map);
    dotGlow = L.circleMarker(allPts[0], { radius: 16, color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 0.12, weight: 0 }).addTo(map);

    // 节点标记（可点击）
    var colors = ['#d4a037','#22d3ee','#a78bfa','#fb923c','#fb923c','#ef4444'];
    ROUTE.forEach(function (wp, i) {
      var icon = L.divIcon({
        className: 'gm-node-marker',
        html: '<div style="background:' + colors[i] + ';color:#fff;font-size:16px;font-weight:800;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 3px 15px rgba(0,0,0,0.4);cursor:pointer;transition:transform 0.2s;">' + (i + 1) + '</div>',
        iconSize: [38, 38], iconAnchor: [19, 19]
      });
      var marker = L.marker([wp.lat, wp.lng], { icon: icon, zIndexOffset: 500 }).addTo(map);
      marker.on('click', function (idx) { return function () { onNodeClick(idx); }; }(i));
      markers.push(marker);

      // 地名标注
      var labelIcon = L.divIcon({
        className: 'gm-label',
        html: '<div style="color:#fff;font-size:13px;font-weight:600;text-shadow:0 1px 6px rgba(0,0,0,0.9),0 0 12px rgba(0,0,0,0.6);white-space:nowrap;pointer-events:none;text-align:center;">' + wp.name + '</div>',
        iconSize: [80, 18], iconAnchor: [40, -8]
      });
      L.marker([wp.lat, wp.lng], { icon: labelIcon, interactive: false }).addTo(map);
    });

    // 缩放到最大节点
    map.fitBounds(allPts, { padding: [60, 60], maxZoom: 7 });
  }

  // ---- 控制按钮 ----
  function createControls() {
    controls = document.createElement('div');
    controls.className = 'gm-controls';
    controls.innerHTML =
      '<button class="gm-btn gm-play" title="播放迁徙动画">▶</button>' +
      '<button class="gm-btn gm-prev" title="上一个节点">◀</button>' +
      '<button class="gm-btn gm-next" title="下一个节点">▶</button>' +
      '<button class="gm-btn gm-reset" title="重置">⟳</button>';
    container.appendChild(controls);

    controls.querySelector('.gm-play').onclick = togglePlay;
    controls.querySelector('.gm-prev').onclick = prevNode;
    controls.querySelector('.gm-next').onclick = nextNode;
    controls.querySelector('.gm-reset').onclick = resetMap;
  }

  // ---- 信息面板 ----
  function createInfoPanel() {
    infoPanel = document.createElement('div');
    infoPanel.className = 'gm-info-panel';
    infoPanel.innerHTML =
      '<div class="gm-info-header"><span class="gm-info-era"></span><span class="gm-info-year"></span><button class="gm-info-close">✕</button></div>' +
      '<div class="gm-info-body">' +
      '<div class="gm-info-name"></div>' +
      '<div class="gm-info-addr"></div>' +
      '<div class="gm-info-line"></div>' +
      '<div class="gm-info-desc"></div>' +
      '<div class="gm-info-stat"><span class="gm-info-dist"></span></div>' +
      '</div>';
    container.appendChild(infoPanel);
    infoPanel.querySelector('.gm-info-close').onclick = hideInfo;
  }

  // ---- 节点点击 ----
  function onNodeClick(idx) {
    if (idx < 0 || idx >= ROUTE.length) return;
    var wp = ROUTE[idx];
    isPlaying = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    controls.querySelector('.gm-play').textContent = '▶';

    // 动画到节点位置
    var zoom = map.getZoom();
    if (zoom < 10) zoom = 10;
    map.setView([wp.lat, wp.lng], zoom, { animate: true });

    // 直接跳转到该节点位置
    var allPts = [];
    for (var s = 0; s <= idx; s++) {
      if (s < CURVED_SEGMENTS.length) allPts = allPts.concat(CURVED_SEGMENTS[idx === 0 ? 0 : s]);
    }
    if (allPts.length) {
      var last = allPts[allPts.length - 1] || [wp.lat, wp.lng];
      movingDot.setLatLng(last);
      dotGlow.setLatLng(last);
    }
    progressLine.setLatLngs(allPts.length ? allPts : [[wp.lat, wp.lng], [wp.lat, wp.lng]]);

    showInfo(idx);
  }

  // ---- 显示信息 ----
  function showInfo(idx) {
    currentHighlightIdx = idx;
    var wp = ROUTE[idx];
    var colors = ['#d4a037','#22d3ee','#a78bfa','#fb923c','#fb923c','#ef4444'];
    infoPanel.querySelector('.gm-info-era').textContent = wp.era;
    infoPanel.querySelector('.gm-info-era').style.background = colors[idx];
    infoPanel.querySelector('.gm-info-year').textContent = wp.year;
    infoPanel.querySelector('.gm-info-name').textContent = wp.icon + ' ' + wp.name;
    infoPanel.querySelector('.gm-info-addr').textContent = '📍 ' + wp.fullName;
    infoPanel.querySelector('.gm-info-desc').textContent = wp.desc;

    // 距离信息
    var distText = '';
    if (idx > 0) {
      var prevDist = SEG_DISTANCES[idx - 1];
      distText = '上一段行程：约 ' + prevDist + ' 公里';
    }
    if (idx < SEG_DISTANCES.length) {
      var nextDist = SEG_DISTANCES[idx];
      distText += (distText ? ' ｜ ' : '') + '下一段行程：约 ' + nextDist + ' 公里';
    }
    infoPanel.querySelector('.gm-info-dist').textContent = distText;
    infoPanel.classList.add('show');
  }

  function hideInfo() {
    infoPanel.classList.remove('show');
    currentHighlightIdx = -1;
  }

  // ---- 播放控制 ----
  function togglePlay() {
    if (isPlaying) {
      isPlaying = false;
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      controls.querySelector('.gm-play').textContent = '▶';
      return;
    }
    isPlaying = true;
    controls.querySelector('.gm-play').textContent = '⏸';
    hideInfo();
    startTime = performance.now();
    currentSeg = 0;
    animate();
  }

  // ---- 逐段行走 ----
  var SEG_TRAVEL = [8000, 3500, 3000, 3000, 2500];
  var SEG_PAUSE = [3000, 3000, 3000, 3000, 4000];

  function animate() {
    if (!isPlaying) return;

    var totalCycle = 0;
    for (var i = 0; i < SEG_COUNT; i++) totalCycle += SEG_TRAVEL[i] + SEG_PAUSE[i];

    function frame(now) {
      if (!isPlaying) { animId = null; return; }
      var elapsed = now - startTime;
      var t = elapsed % totalCycle;
      var cum = 0;

      for (var segIdx = 0; segIdx < SEG_COUNT; segIdx++) {
        if (t < cum + SEG_TRAVEL[segIdx]) {
          updateAnim(segIdx, (t - cum) / SEG_TRAVEL[segIdx]);
          break;
        }
        cum += SEG_TRAVEL[segIdx];
        if (t < cum + SEG_PAUSE[segIdx]) {
          updateAnim(segIdx, 1.0);
          break;
        }
        cum += SEG_PAUSE[segIdx];
      }
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
  }

  function updateAnim(segIdx, segP) {
    var allPts = [];
    for (var i = 0; i < segIdx; i++) allPts = allPts.concat(CURVED_SEGMENTS[i]);
    var curSeg = CURVED_SEGMENTS[segIdx];
    var steps = curSeg.length - 1;
    var idx = Math.min(Math.floor(segP * steps), steps - 1);
    var t = segP * steps - idx;
    allPts = allPts.concat(curSeg.slice(0, idx + 1));
    if (idx < steps) {
      var a = curSeg[idx], b = curSeg[idx + 1];
      allPts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    progressLine.setLatLngs(allPts);
    if (allPts.length) {
      var pos = allPts[allPts.length - 1];
      movingDot.setLatLng(pos);
      dotGlow.setLatLng(pos);
    }
  }

  function prevNode() {
    if (currentHighlightIdx < 0) { onNodeClick(ROUTE.length - 2); return; }
    onNodeClick(Math.max(0, currentHighlightIdx - 1));
  }

  function nextNode() {
    if (currentHighlightIdx < 0) { onNodeClick(1); return; }
    onNodeClick(Math.min(ROUTE.length - 1, currentHighlightIdx + 1));
  }

  function resetMap() {
    isPlaying = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    controls.querySelector('.gm-play').textContent = '▶';
    hideInfo();
    var allPts = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    map.fitBounds(allPts, { padding: [60, 60], maxZoom: 7 });
    movingDot.setLatLng(allPts[0]);
    dotGlow.setLatLng(allPts[0]);
    progressLine.setLatLngs([allPts[0], allPts[0]]);
    currentHighlightIdx = -1;
  }

  // ---- 启动 ----
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
