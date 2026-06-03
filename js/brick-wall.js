/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Photo wall — masonry grid with hover & click effects
   ============================================ */

(function() {
  'use strict';

  var photos = [
    { src:'images/carousel/11.jpg', label:'下枫槎村景' },
    { src:'images/carousel/23.jpg', label:'下枫槎村景' },
    { src:'images/carousel/36.jpg', label:'下枫槎风光' },
    { src:'images/carousel/37.jpg', label:'下枫槎风光' },
    { src:'images/carousel/38.jpg', label:'下枫槎风光' },
    { src:'images/carousel/40.jpg', label:'下枫槎风光' },
    { src:'images/carousel/42.jpg', label:'下枫槎风光' },
    { src:'images/carousel/51.jpg', label:'下枫槎村景' },
    { src:'images/carousel/52.jpg', label:'下枫槎村景' },
    { src:'images/carousel/W020230307562232959074.jpg', label:'宗祠全景' },
    { src:'images/carousel/W020230307562236561236.jpg', label:'宗祠内景' },
    { src:'images/carousel/W020230307562239043622.jpg', label:'古树' },
    { src:'images/carousel/W020230307562241110405.jpg', label:'活动留影' },
  ];

  var grid, autoTimer = null;

  // ===== 1. Build responsive masonry grid =====
  function buildWall() {
    grid = document.getElementById('brick-grid');
    if (!grid) return;
    grid.innerHTML = '';

    var vw = window.innerWidth;
    var containerW = Math.min(900, vw - 40);
    var cols = vw < 480 ? 2 : vw < 700 ? 3 : 4;
    var gap = vw < 480 ? 6 : 8;
    var colW = Math.floor((containerW - gap * (cols - 1)) / cols);

    // Assign each photo a random height multiplier (1 or 1.5 or 2)
    var items = photos.slice().sort(function() { return 0.5 - Math.random(); });
    items = items.slice(0, 13); // max 13 photos

    // Build columns array for masonry
    var colHeights = new Array(cols).fill(0);
    var placed = [];

    items.forEach(function(photo, idx) {
      // Find shortest column
      var minCol = 0;
      for (var c = 1; c < cols; c++) {
        if (colHeights[c] < colHeights[minCol]) minCol = c;
      }

      // Random aspect ratio: 1:1 (square), 2:3 (portrait), 3:2 (landscape)
      var variants = [
        { rows: 1, cols: 1 }, // square
        { rows: 2, cols: 1 }, // tall
        { rows: 1, cols: 2 }, // wide (only if space)
      ];
      // Pick a variant that fits
      var v = variants[0];
      if (idx % 5 === 0 && minCol + 1 < cols) v = variants[2]; // wide
      else if (idx % 7 === 0) v = variants[1]; // tall

      placed.push({
        photo: photo,
        col: minCol,
        colSpan: v.cols,
        rowSpan: v.rows,
        x: minCol * (colW + gap),
        y: colHeights[minCol],
        w: v.cols * colW + (v.cols - 1) * gap,
        h: v.rows * colW + (v.rows - 1) * gap,
      });

      // Update column heights
      var h = v.rows * colW + (v.rows - 1) * gap + gap;
      for (var c = minCol; c < minCol + v.cols; c++) {
        colHeights[c] += h;
      }
    });

    var wallH = Math.max.apply(null, colHeights);
    grid.style.cssText = 'position:relative;width:100%;max-width:' + containerW + 'px;height:' + wallH + 'px;margin:0 auto;';

    placed.forEach(function(item, idx) {
      var el = document.createElement('div');
      el.className = 'brick-tile';
      el.style.cssText =
        'position:absolute;left:' + item.x + 'px;top:' + item.y + 'px;' +
        'width:' + item.w + 'px;height:' + item.h + 'px;' +
        'cursor:pointer;overflow:hidden;border-radius:10px;' +
        'box-shadow:0 2px 12px rgba(0,0,0,0.12);' +
        'transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;';
      el.setAttribute('data-idx', idx);
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');

      // Photo
      var img = document.createElement('img');
      img.src = item.photo.src;
      img.alt = item.photo.label;
      img.style.cssText =
        'width:100%;height:100%;object-fit:cover;display:block;' +
        'transition:transform 0.5s ease;';

      // Watermark overlay (subtle "谢" in corner)
      var watermark = document.createElement('div');
      watermark.style.cssText =
        'position:absolute;bottom:6px;right:8px;' +
        'font-size:' + (item.w * 0.12) + 'px;' +
        'color:rgba(255,255,255,0.2);font-family:serif;' +
        'font-weight:700;pointer-events:none;' +
        'text-shadow:0 1px 3px rgba(0,0,0,0.3);' +
        'transition:opacity 0.4s ease;';
      watermark.textContent = '谢';
      watermark.className = 'brick-watermark';

      // Label overlay (bottom bar)
      var label = document.createElement('div');
      label.style.cssText =
        'position:absolute;bottom:0;left:0;right:0;' +
        'padding:20px 10px 6px;' +
        'background:linear-gradient(transparent,rgba(0,0,0,0.55));' +
        'color:#fff;font-size:12px;letter-spacing:0.5px;' +
        'opacity:0;transition:opacity 0.3s;' +
        'pointer-events:none;';
      label.textContent = item.photo.label;
      label.className = 'brick-label';

      el.appendChild(img);
      el.appendChild(watermark);
      el.appendChild(label);

      // Hover: scale + show label
      el.addEventListener('mouseenter', function() {
        this.querySelector('img').style.transform = 'scale(1.08)';
        this.querySelector('.brick-label').style.opacity = '1';
        this.style.boxShadow = '0 6px 30px rgba(255,107,0,0.25)';
      });
      el.addEventListener('mouseleave', function() {
        this.querySelector('img').style.transform = 'scale(1)';
        this.querySelector('.brick-label').style.opacity = '0';
        this.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
      });

      // Click: lightbox
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        if (typeof openPhotoLightbox === 'function') {
          openPhotoLightbox(item.photo.src, item.photo.label);
        } else {
          // Fallback: viewFullscreen
          if (typeof viewFullscreen === 'function') {
            viewFullscreen(item.photo.src, item.photo.label);
          }
        }
      });

      // Keyboard support
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });

      grid.appendChild(el);
    });

    updateStatus(photos.length);

    // Start auto-shuffle: every 8s, randomly highlight a few tiles
    startAutoShuffle(placed);
  }

  // ===== 2. Auto-shuffle effect =====
  function startAutoShuffle(placed) {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(function() {
      var tiles = grid.querySelectorAll('.brick-tile');
      // Pick 1-2 random tiles to "pop"
      var count = 1 + Math.floor(Math.random() * 2);
      var picked = [];
      for (var i = 0; i < count; i++) {
        var idx = Math.floor(Math.random() * tiles.length);
        if (picked.indexOf(idx) === -1) picked.push(idx);
      }
      picked.forEach(function(idx) {
        var tile = tiles[idx];
        if (!tile) return;
        // Pop animation: scale up, add glow, then back
        tile.style.transform = 'scale(1.06)';
        tile.style.boxShadow = '0 8px 35px rgba(255,107,0,0.3)';
        tile.style.zIndex = '10';
        setTimeout(function() {
          tile.style.transform = 'scale(1)';
          tile.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
          tile.style.zIndex = '1';
        }, 1200);
      });
    }, 5000);
  }

  // ===== 3. Status =====
  function updateStatus(count) {
    var el = document.getElementById('brick-status');
    if (el) el.textContent = '共 ' + count + ' 张 · 悬停放大 · 点击查看大图';
  }

  // ===== 4. Responsive =====
  var resizeTimer = null;
  window.addEventListener('resize', function() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (autoTimer) clearInterval(autoTimer);
      buildWall();
    }, 400);
  });

  // ===== 5. Init =====
  document.addEventListener('DOMContentLoaded', buildWall);
})();
