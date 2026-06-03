/* ============================================
   宁海三中98届 · 麻将传播路线图
   Leaflet + OSM 暗色调 + 动画路线
   ============================================ */
(function () {
  'use strict';

  if (typeof L === 'undefined') return;

  // ---- 麻将传播路线 ----
  var ROUTE = [
    { lng: 121.543, lat: 29.288, name: '宁海',    fullName: '浙江·宁海',             year: '本地·当代', desc: '宁海三中98届麻将发源地，同学牌局文化的摇篮' },
    { lng: 120.155, lat: 30.274, name: '杭州',    fullName: '浙江·杭州',             year: '南宋',      desc: '临安（杭州）纸牌文化兴盛，马吊牌在此流行' },
    { lng: 121.474, lat: 31.230, name: '上海',    fullName: '上海',                  year: '清末民初',   desc: '开埠通商，麻将在此定型并走向世界' },
    { lng: 116.397, lat: 39.908, name: '北京',    fullName: '北京',                  year: '民国',      desc: '传入北方，成为宫廷与民间共爱的牌戏' },
    { lng: 114.057, lat: 22.543, name: '香港',    fullName: '香港',                  year: '1950s',    desc: '经广东传入香港，形成粤式麻将文化' },
    { lng: 139.691, lat: 35.689, name: '东京',    fullName: '日本·东京',             year: '1920s',    desc: '传入日本，发展为竞技麻将（立直麻将）' },
    { lng: -73.985, lat: 40.748, name: '纽约',    fullName: '美国·纽约',             year: '1920s',    desc: '传入美国，成为西方最受欢迎的中国牌戏' },
    { lng: -0.127,  lat: 51.507, name: '伦敦',    fullName: '英国·伦敦',             year: '2000s',    desc: '传入欧洲，成为世界智力运动项目' },
    { lng: 103.819, lat: 1.352,  name: '新加坡',  fullName: '新加坡',                year: '当代',      desc: '东南亚华人社区广泛传播，成为文化纽带' },
  ];

  var SEGMENT_STYLES = ROUTE.slice(0, -1).map(function(_, i) {
    var colors = ['#ff6b00', '#ff8c42', '#ffa64d', '#22d3ee', '#4ade80', '#ffd700', '#ff6b00', '#d4793a'];
    return { color: colors[i % colors.length], weight: 3 };
  });

  var SEG_TRAVEL = [6000, 5000, 5000, 5000, 5000, 6000, 6000, 5000];
  var SEG_PAUSE  = [3000, 2500, 2500, 2500, 2500, 3000, 3000, 4000];
  var SEG_COUNT = SEG_TRAVEL.length;

  // ---- Haversine ----
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
  for (var i = 0; i < ROUTE.length - 1; i++) {
    SEG_DISTANCES.push(Math.round(haversine(ROUTE[i].lat, ROUTE[i].lng, ROUTE[i + 1].lat, ROUTE[i + 1].lng)));
  }

  // ---- Curved paths (quadratic bezier) ----
  var CURVED_SEGMENTS = (function () {
    var pts = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    var result = [];
    for (var s = 0; s < SEG_COUNT; s++) {
      var p1 = pts[s], p2 = pts[s + 1];
      var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      var len = Math.sqrt(dx * dx + dy * dy);
      var subSteps = len > 5 ? 40 : 20;
      // Control point for bezier curve
      var cx = (p1[0] + p2[0]) / 2 + (Math.random() - 0.5) * 1.5;
      var cy = (p1[1] + p2[1]) / 2 + (Math.random() - 0.5) * 1.5;
      var points = [];
      for (var k = 0; k <= subSteps; k++) {
        var t = k / subSteps;
        var u = 1 - t;
        var lat = u * u * p1[0] + 2 * u * t * cx + t * t * p2[0];
        var lng = u * u * p1[1] + 2 * u * t * cy + t * t * p2[1];
        points.push([lat, lng]);
      }
      result.push(points);
    }
    return result;
  })();

  // ---- Total points ----
  var TOTAL_POINTS = 0;
  CURVED_SEGMENTS.forEach(function (seg) { TOTAL_POINTS += seg.length; });

  // ---- Build map ----
  var container = document.getElementById('mahjong-map-container');
  if (!container) return;

  var map = L.map('mahjong-map-container', {
    center: [30, 100],
    zoom: 3,
    zoomControl: false,
    attributionControl: false,
    fadeAnimation: true,
    zoomAnimation: true,
  });

  // Dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
  }).addTo(map);

  // Fit bounds to route
  var allCoords = ROUTE.map(function (p) { return [p.lat, p.lng]; });
  map.fitBounds(allCoords, { padding: [60, 60], maxZoom: 5 });

  // ---- Draw route segments (static) ----
  var polylines = [];
  CURVED_SEGMENTS.forEach(function (segPoints, i) {
    var poly = L.polyline(segPoints, {
      color: SEGMENT_STYLES[i].color,
      weight: SEGMENT_STYLES[i].weight,
      opacity: 0.2,
      smoothFactor: 1.5,
    }).addTo(map);
    polylines.push(poly);
  });

  // ---- Markers ----
  var markers = [];
  var markerGroup = L.layerGroup().addTo(map);

  ROUTE.forEach(function (pt, idx) {
    var icon = L.divIcon({
      className: 'mj-map-marker',
      html: '<div class="mj-marker-inner"><span class="mj-marker-dot"></span></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    var marker = L.marker([pt.lat, pt.lng], { icon: icon }).addTo(markerGroup);
    marker.bindTooltip('<b>' + pt.name + '</b>', {
      direction: 'top', offset: [0, -10],
      className: 'mj-map-tooltip',
    });
    markers.push(marker);

    // Popup on click
    marker.bindPopup(
      '<div style="font-family:sans-serif;font-size:13px;line-height:1.6;min-width:160px;">' +
      '<div style="font-size:16px;font-weight:700;color:#ff6b00;margin-bottom:4px;">🀄 ' + pt.fullName + '</div>' +
      '<div style="color:#999;font-size:12px;">' + pt.year + '</div>' +
      '<div style="color:#ccc;margin-top:4px;font-size:12px;">' + pt.desc + '</div>' +
      '</div>',
      { className: 'mj-map-popup', closeButton: true }
    );
  });

  // ---- Animation state ----
  var animating = false;
  var animDot = null;
  var currentSegment = 0;
  var currentPoint = 0;
  var timer = null;

  function createAnimDot() {
    if (animDot) map.removeLayer(animDot);
    animDot = L.circleMarker([0, 0], {
      radius: 6, color: '#ff6b00', fillColor: '#ff6b00',
      fillOpacity: 1, weight: 2, opacity: 0.8,
    }).addTo(map);
  }

  function startAnimation() {
    if (animating) return;
    animating = true;
    currentSegment = 0;
    currentPoint = 0;
    createAnimDot();
    stepAnimation();
  }

  function stepAnimation() {
    if (!animating) return;

    var seg = CURVED_SEGMENTS[currentSegment];
    if (!seg || currentPoint >= seg.length || currentSegment >= SEG_COUNT) {
      // Pause at last point, then restart
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        stopAnimation();
        fadeInMarkers();
        timer = setTimeout(startAnimation, 6000);
      }, 4000);
      return;
    }

    var pt = seg[currentPoint];
    if (animDot) animDot.setLatLng(pt);

    // Highlight the active marker
    markers.forEach(function (m, i) {
      var el = m.getElement();
      if (el) {
        el.classList.toggle('mj-marker-active', i === currentSegment && currentPoint === seg.length - 1);
      }
    });

    currentPoint++;
    if (currentPoint >= seg.length) {
      // Highlight arrived marker
      if (markers[currentSegment + 1]) {
        var el = markers[currentSegment + 1].getElement();
        if (el) el.classList.add('mj-marker-active');
        markers[currentSegment + 1].openTooltip();
      }
      // Fade in the segment
      if (polylines[currentSegment]) {
        polylines[currentSegment].setStyle({ opacity: 0.7 });
      }
      currentSegment++;
      currentPoint = 0;

      var pause = currentSegment < SEG_COUNT ? SEG_PAUSE[currentSegment - 1] : 4000;
      if (timer) clearTimeout(timer);
      timer = setTimeout(stepAnimation, pause);
    } else {
      var speed = SEG_TRAVEL[currentSegment] / seg.length;
      if (timer) clearTimeout(timer);
      timer = setTimeout(stepAnimation, speed);
    }
  }

  function stopAnimation() {
    animating = false;
    if (timer) { clearTimeout(timer); timer = null; }
  }

  function fadeInMarkers() {
    // Open first marker tooltip
    if (markers[0]) markers[0].openTooltip();
  }

  // ---- Start animation after map loads ----
  map.whenReady(function () {
    setTimeout(function () {
      fadeInMarkers();
      setTimeout(startAnimation, 2000);
    }, 500);
  });

  // ---- Pause on hover ----
  container.addEventListener('mouseenter', function () {
    stopAnimation();
  });
  container.addEventListener('mouseleave', function () {
    if (!animating) startAnimation();
  });

  // ---- Expose ----
  window.mahjongMap = {
    start: startAnimation,
    stop: stopAnimation,
    map: map,
  };

})();
