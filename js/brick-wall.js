/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Brick flip wall — click-to-ripple reveal
   ============================================ */

(function() {
  'use strict';

  var brickPhotos = [
    { src:'images/carousel/11.jpg', label:'村景 01' },
    { src:'images/carousel/23.jpg', label:'村景 02' },
    { src:'images/carousel/36.jpg', label:'村景 03' },
    { src:'images/carousel/37.jpg', label:'村景 04' },
    { src:'images/carousel/38.jpg', label:'村景 05' },
    { src:'images/carousel/40.jpg', label:'村景 06' },
    { src:'images/carousel/42.jpg', label:'村景 07' },
    { src:'images/carousel/51.jpg', label:'村景 08' },
    { src:'images/carousel/52.jpg', label:'村景 09' },
    { src:'images/carousel/121.jpg', label:'村景 10' },
    { src:'images/carousel/123.jpg', label:'村景 11' },
    { src:'images/carousel/W020230307562232959074.jpg', label:'宗祠全景' },
    { src:'images/carousel/W020230307562236561236.jpg', label:'宗祠内景' },
    { src:'images/carousel/W020230307562239043622.jpg', label:'古树' },
    { src:'images/carousel/W020230307562241110405.jpg', label:'活动留影' },
  ];

  var grid, bricks = [], totalFlipped = 0, resetTimer = null;
  var particleCtx = null, particleCanvas = null, particleAnim = null;

  // ===== 1. Build responsive spiral grid =====
  function buildBrickGrid() {
    grid = document.getElementById('brick-grid');
    if (!grid) return;
    grid.innerHTML = '';
    bricks = [];
    totalFlipped = 0;

    // Responsive sizing
    var vw = window.innerWidth;
    var containerW = Math.min(700, vw - 40);
    var cols = vw < 500 ? 3 : vw < 700 ? 4 : 5;
    var gap = vw < 500 ? 6 : 8;
    var brickSize = Math.floor((containerW - gap * (cols - 1)) / cols);
    var rows = Math.ceil(brickPhotos.length / cols);
    var containerH = rows * brickSize + (rows - 1) * gap + 20;

    grid.style.cssText = 'position:relative;width:100%;max-width:' + containerW + 'px;height:' + containerH + 'px;margin:0 auto;';

    // Pre-shuffle photo order
    var shuffled = brickPhotos.slice().sort(function() { return 0.5 - Math.random(); });

    shuffled.forEach(function(photo, idx) {
      var row = Math.floor(idx / cols);
      var col = idx % cols;
      var x = col * (brickSize + gap);
      var y = row * (brickSize + gap);

      var brick = document.createElement('div');
      brick.className = 'brick-tile';
      brick.style.cssText =
        'position:absolute;left:' + x + 'px;top:' + y + 'px;' +
        'width:' + brickSize + 'px;height:' + brickSize + 'px;' +
        'cursor:pointer;transform-style:preserve-3d;' +
        'transition:transform 0.7s cubic-bezier(0.34,1.56,0.64,1);' +
        'border-radius:' + (brickSize * 0.12) + 'px;' +
        'box-shadow:0 2px 8px rgba(0,0,0,0.1);overflow:hidden;';
      brick.setAttribute('data-flipped', 'false');
      brick.setAttribute('data-index', idx);

      // Back face — 谢 character
      var back = document.createElement('div');
      var tc = ['#c4956a','#b8895e','#d4a97a','#a67c52','#c49a6e'][idx % 5];
      back.style.cssText =
        'position:absolute;top:0;left:0;right:0;bottom:0;' +
        'border-radius:' + (brickSize * 0.12) + 'px;' +
        'background:linear-gradient(145deg,' + tc + ',' + (idx % 2 === 0 ? '#8b6d4a' : '#a67c52') + ');' +
        'display:flex;align-items:center;justify-content:center;' +
        '-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1;';
      back.innerHTML = '<span style="font-size:' + (brickSize * 0.3) + 'px;color:rgba(255,255,255,0.12);font-family:serif;font-weight:700;">谢</span>';

      // Front face — photo
      var front = document.createElement('div');
      front.style.cssText =
        'position:absolute;top:0;left:0;right:0;bottom:0;' +
        'border-radius:' + (brickSize * 0.12) + 'px;overflow:hidden;' +
        '-webkit-backface-visibility:hidden;backface-visibility:hidden;' +
        'transform:rotateY(180deg);z-index:2;';
      front.innerHTML = '<img src="' + photo.src + '" alt="' + photo.label + '" style="width:100%;height:100%;object-fit:cover;display:block;' + (vw < 500 ? '' : '') + '">';

      brick.appendChild(back);
      brick.appendChild(front);

      // Click handler — ripple reveal
      brick.addEventListener('click', function(e) {
        e.stopPropagation();
        if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
        triggerRipple(parseInt(this.getAttribute('data-index')));
      });

      grid.appendChild(brick);
      bricks.push(brick);
    });

    updateStatus();
  }

  // ===== 2. Ripple wave reveal from clicked brick =====
  function triggerRipple(clickedIdx) {
    var allFlipped = bricks.every(function(b) { return b.getAttribute('data-flipped') === 'true'; });
    if (allFlipped) {
      // If all already flipped, reset and start again
      resetAndRestart(clickedIdx);
      return;
    }

    // Calculate distance from clicked brick to all others
    var gridRects = [];
    bricks.forEach(function(b) {
      gridRects.push({ left: b.offsetLeft, top: b.offsetTop });
    });
    var cx = gridRects[clickedIdx].left;
    var cy = gridRects[clickedIdx].top;

    // Create ordered list by distance
    var ordered = [];
    bricks.forEach(function(b, i) {
      if (b.getAttribute('data-flipped') === 'true') return;
      var dx = gridRects[i].left - cx;
      var dy = gridRects[i].top - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      ordered.push({ index: i, dist: dist });
    });
    ordered.sort(function(a, b) { return a.dist - b.dist; });

    // Flip in ripple order
    ordered.forEach(function(item, step) {
      setTimeout(function() {
        flipBrick(bricks[item.index], item.index);
      }, step * 60 + 50);
    });
  }

  // ===== 3. Flip a single brick with particles =====
  function flipBrick(brick, idx) {
    if (!brick || brick.getAttribute('data-flipped') === 'true') return;

    var rx = (Math.random() - 0.5) * 12;
    var ry = 180 + (Math.random() - 0.5) * 8;
    var rz = (Math.random() - 0.5) * 10;
    brick.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) rotateZ(' + rz + 'deg) scale(1.05)';
    brick.setAttribute('data-flipped', 'true');
    totalFlipped++;

    // Spawn particles
    spawnParticles(brick);

    // Settle to flat after overshoot
    setTimeout(function() {
      brick.style.transform = 'rotateX(' + (rx * 0.3) + 'deg) rotateY(180deg) rotateZ(' + (rz * 0.3) + 'deg) scale(1)';
      // Add float animation
      brick.style.animation = 'brick-float ' + (2.5 + Math.random() * 1.5) + 's ease-in-out ' + (Math.random() * 2) + 's infinite alternate';
    }, 500);

    updateStatus();

    // Check if all done
    if (totalFlipped >= bricks.length) {
      setTimeout(function() {
        var status = document.getElementById('brick-status');
        if (status) status.textContent = '✨ 全部翻开！点击照片查看大图，再次点击重新开始';
        // Auto reset after 8s
        resetTimer = setTimeout(autoReset, 8000);
      }, 800);
    }
  }

  // ===== 4. Particle burst effect =====
  function spawnParticles(brick) {
    var rect = brick.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var count = 8 + Math.floor(Math.random() * 6);

    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'brick-particle';
      var size = 3 + Math.random() * 5;
      var angle = Math.random() * Math.PI * 2;
      var speed = 40 + Math.random() * 80;
      var dx = Math.cos(angle) * speed;
      var dy = Math.sin(angle) * speed;
      var colors = ['#ff6b00', '#d4a97a', '#ffd700', '#ff8c42', '#ffffff'];
      p.style.cssText =
        'position:fixed;left:' + cx + 'px;top:' + cy + 'px;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'border-radius:50%;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
        'pointer-events:none;z-index:999;' +
        'opacity:1;';
      document.body.appendChild(p);

      // Animate with CSS transition
      requestAnimationFrame(function() {
        p.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
        p.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0)';
        p.style.opacity = '0';
      });

      // Remove after animation
      setTimeout(function() { if (p.parentNode) p.parentNode.removeChild(p); }, 700);
    }
  }

  // ===== 5. Auto reset =====
  function autoReset() {
    // Randomly flip some back, then re-reveal
    var toFlip = bricks.slice().sort(function() { return 0.5 - Math.random(); }).slice(0, 4);
    toFlip.forEach(function(b, i) {
      setTimeout(function() {
        b.style.transform = 'rotateY(0deg) scale(1)';
        b.style.animation = 'none';
        b.setAttribute('data-flipped', 'false');
        totalFlipped--;
      }, i * 120);
    });
    setTimeout(function() {
      // Trigger new ripple from center
      var centerIdx = Math.floor(bricks.length / 2);
      triggerRipple(centerIdx);
    }, 800);
  }

  function resetAndRestart(fromIdx) {
    bricks.forEach(function(b) {
      b.style.transform = 'rotateY(0deg) scale(1)';
      b.style.animation = 'none';
      b.setAttribute('data-flipped', 'false');
    });
    totalFlipped = 0;
    updateStatus();
    setTimeout(function() { triggerRipple(fromIdx); }, 300);
  }

  // ===== 6. Status update =====
  function updateStatus() {
    var el = document.getElementById('brick-status');
    if (!el) return;
    if (totalFlipped === 0) {
      el.textContent = '共 ' + bricks.length + ' 块 · 点击任意砖块涟漪展开';
    } else if (totalFlipped >= bricks.length) {
      el.textContent = '✨ 全部翻开！点击照片查看大图';
    } else {
      el.textContent = '共 ' + bricks.length + ' 块 · 已翻转 ' + totalFlipped;
    }
  }

  // ===== 7. Responsive rebuild =====
  var resizeTimer = null;
  window.addEventListener('resize', function() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      var wasFlipped = [];
      bricks.forEach(function(b) { wasFlipped.push(b.getAttribute('data-flipped') === 'true'); });
      buildBrickGrid();
      // Re-flip those that were flipped
      bricks.forEach(function(b, i) {
        if (wasFlipped[i]) {
          b.style.transform = 'rotateX(0deg) rotateY(180deg) rotateZ(0deg) scale(1)';
          b.setAttribute('data-flipped', 'true');
          b.style.animation = 'brick-float ' + (2.5 + Math.random() * 1.5) + 's ease-in-out ' + (Math.random() * 2) + 's infinite alternate';
          totalFlipped++;
        }
      });
      updateStatus();
    }, 300);
  });

  // ===== 8. Init =====
  document.addEventListener('DOMContentLoaded', function() {
    buildBrickGrid();
    // Add CSS for float animation
    var style = document.createElement('style');
    style.textContent =
      '@keyframes brick-float {' +
      '  0% { transform: rotateX(0deg) rotateY(180deg) rotateZ(0deg) translateY(0); }' +
      '  100% { transform: rotateX(0deg) rotateY(180deg) rotateZ(0deg) translateY(-4px); }' +
      '}' +
      '.brick-particle { will-change: transform, opacity; }';
    document.head.appendChild(style);
  });

})();
