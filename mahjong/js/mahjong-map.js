/* ============================================
   麻将传播路线图 — 历史准确版
   起源：宁波（1850s）→ 上海 → 全国 → 世界
   ============================================ */
(function () {
  'use strict';

  if (typeof L === 'undefined') return;

  // ---- 历史准确的麻将传播路线 ----
  // 依据：陈鱼门（1817-1878）在宁波创制现代麻将，
  // 经海上贸易路线传到上海，再传遍全国和世界
  var ROUTE = [
    { lng: 121.543, lat: 29.875, name: '宁波',    fullName: '浙江·宁波',       year: '1850s-1860s', desc: '麻将发源地。陈鱼门（1817-1878）在马吊牌基础上创制现代麻将，以骨竹代替纸牌，为现代麻将之祖' },
    { lng: 121.474, lat: 31.230, name: '上海',    fullName: '上海',            year: '1870s-1880s', desc: '经"海上麻将之路"从宁波传入上海，在茶馆和富户中流行。《海上花列传》(1892)等名著均有记载' },
    { lng: 116.397, lat: 39.908, name: '北京',    fullName: '北京',            year: '1890s',       desc: '传入北京，慈禧太后酷爱打麻将，宫中盛行。晚清官员徐珂《清稗类钞》详记麻将玩法' },
    { lng: 114.057, lat: 22.543, name: '香港',    fullName: '香港',            year: '1910s',       desc: '随广东商帮和移民传入香港，形成粤式麻将传统' },
    { lng: 139.691, lat: 35.689, name: '东京',    fullName: '日本·东京',       year: '1900s-1910s', desc: '经在华日人和留学生传入日本，后发展为竞技立直麻将（リーチ麻雀）' },
    { lng: -73.985, lat: 40.748, name: '纽约',    fullName: '美国·纽约',       year: '1920s',       desc: '美孚石油职员巴布考克（Joseph Babcock）将麻将带回美国，出版首部英文规则书。1923年全美售出150万副' },
    { lng: -0.127,  lat: 51.507, name: '伦敦',    fullName: '英国·伦敦',       year: '1920s',       desc: '经在华外交官和商人传入欧洲，在英法德等国流行' },
    { lng: 103.819, lat: 1.352,  name: '新加坡',  fullName: '新加坡',          year: '1930s',       desc: '随华人下南洋传遍东南亚，成为海外华人文化纽带' },
  ];

  var SEGMENT_STYLES = ROUTE.slice(0, -1).map(function(_, i) {
    var colors = ['#ff6b00', '#ff8c42', '#22d3ee', '#4ade80', '#ffd700', '#ff6b00', '#d4793a'];
    return { color: colors[i % colors.length], weight: 3 };
  });

  var SEG_TRAVEL = [6000, 5000, 4000, 5000, 6000, 6000, 5000];
  var SEG_PAUSE  = [3500, 3000, 2500, 2500, 3000, 3000, 4000];
  var SEG_COUNT = SEG_TRAVEL.length;

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

  // ---- Curved paths ----
  var CURVED_SEGMENTS = (function () {
    var pts = ROUTE.map(function (p) { return [p.lat, p.lng]; });
    var result = [];
    for (var s = 0; s < SEG_COUNT; s++) {
      var p1 = pts[s], p2 = pts[s + 1];
      var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      var len = Math.sqrt(dx * dx + dy * dy);
      var subSteps = len > 5 ? 40 : 20;
      var cx = (p1[0] + p2[0]) / 2 + (Math.random() - 0.5) * 1.2;
      var cy = (p1[1] + p2[1]) / 2 + (Math.random() - 0.5) * 1.2;
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

  // ---- Build map ----
  var container = document.getElementById('mahjong-map-container');
  if (!container) return;

  var map = L.map('mahjong-map-container', {
    center: [30, 110],
    zoom: 3,
    zoomControl: false,
    attributionControl: false,
    fadeAnimation: true,
    zoomAnimation: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
  }).addTo(map);

  var allCoords = ROUTE.map(function (p) { return [p.lat, p.lng]; });
  map.fitBounds(allCoords, { padding: [60, 60], maxZoom: 5 });

  // ---- Static segments ----
  var polylines = [];
  CURVED_SEGMENTS.forEach(function (segPoints, i) {
    var poly = L.polyline(segPoints, {
      color: SEGMENT_STYLES[i].color,
      weight: SEGMENT_STYLES[i].weight,
      opacity: 0.15,
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
      direction: 'top', offset: [0, -10], className: 'mj-map-tooltip',
    });
    markers.push(marker);

    marker.bindPopup(
      '<div style="font-family:sans-serif;font-size:13px;line-height:1.6;min-width:180px;">' +
      '<div style="font-size:16px;font-weight:700;color:#ff6b00;margin-bottom:4px;">🀄 ' + pt.fullName + '</div>' +
      '<div style="color:#999;font-size:12px;">' + pt.year + '</div>' +
      '<div style="color:#ccc;margin-top:4px;font-size:12px;line-height:1.5;">' + pt.desc + '</div>' +
      '</div>',
      { className: 'mj-map-popup', closeButton: true }
    );
  });

  // ---- Animation ----
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
    // Open first marker
    if (markers[0]) markers[0].openTooltip();
    stepAnimation();
  }

  function stepAnimation() {
    if (!animating) return;
    var seg = CURVED_SEGMENTS[currentSegment];
    if (!seg || currentPoint >= seg.length || currentSegment >= SEG_COUNT) {
      if (timer) clearTimeout(timer);
      // Final pause, show last marker
      if (markers[markers.length-1]) markers[markers.length-1].openTooltip();
      timer = setTimeout(function() {
        stopAnimation();
        timer = setTimeout(startAnimation, 6000);
      }, 4000);
      return;
    }
    var pt = seg[currentPoint];
    if (animDot) animDot.setLatLng(pt);

    currentPoint++;
    if (currentPoint >= seg.length) {
      if (markers[currentSegment + 1]) {
        markers[currentSegment + 1].openTooltip();
        var el = markers[currentSegment + 1].getElement();
        if (el) el.classList.add('mj-marker-active');
      }
      if (polylines[currentSegment]) {
        polylines[currentSegment].setStyle({ opacity: 0.6 });
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

  // ---- Start ----
  map.whenReady(function() {
    setTimeout(function() {
      if (markers[0]) markers[0].openTooltip();
      setTimeout(startAnimation, 2000);
    }, 500);
  });

  container.addEventListener('mouseenter', stopAnimation);
  container.addEventListener('mouseleave', function() {
    if (!animating) startAnimation();
  });

  window.mahjongMap = { start: startAnimation, stop: stopAnimation, map: map };
})();
