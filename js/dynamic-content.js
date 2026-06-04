/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Dynamic content: photo wall + video reels + countdown
   Extracted from index.html
   ============================================ */

(function() {
    // 1. 照片墙 - 从管理后台加载已上传图片
    function loadCarouselPhotos() {
      var grid = document.getElementById('gallery-grid');
      if (!grid) return;
      try {
        var adminPhotos = JSON.parse(localStorage.getItem('xie_admin_photos') || '[]');
        if (!adminPhotos.length) return;

        getAllFiles('photo_').then(function(files) {
          var fileMap = {};
          files.forEach(function(f) {
            var id = parseInt(f.name.replace('photo_', ''));
            fileMap[id] = f.dataUrl;
          });
          renderGalleryPhotos(adminPhotos, fileMap);
        }).catch(function() {
          renderGalleryPhotos(adminPhotos, {});
        });

        function renderGalleryPhotos(photos, fileMap) {
          var hasAnyFile = photos.some(function(p) { return fileMap[p.id] || p.file_url; });
          if (!hasAnyFile) return;

          var defaultLabels = ['谢氏宗祠', '古树参天', '青山环绕', '明清古民居', '清明祭祖', '新春团拜', '宗祠风貌'];
          grid.innerHTML = '';
          photos.forEach(function(photo, idx) {
            var src = photo.file_url || fileMap[photo.id] || '';
            var item = document.createElement('div');
            item.className = 'gallery-item';
            // Vary aspect ratios for bento effect
            var bento = idx % 3;
            if (bento === 0) item.style.gridRow = 'span 2';
            else if (bento === 2) item.style.gridColumn = 'span 2';

            if (src) {
              var img = document.createElement('img');
              img.src = src;
              img.alt = photo.title || '';
              img.loading = 'lazy';
              item.appendChild(img);
            } else {
              item.innerHTML = '<div style="font-size:48px;opacity:0.4;display:flex;align-items:center;justify-content:center;height:100%;">' + (photo.icon || '🖼️') + '</div>';
            }
            var caption = document.createElement('span');
            caption.className = 'gallery-caption';
            var t = (photo.title || '').replace(/—/g, '').trim();
            caption.textContent = t || defaultLabels[idx % defaultLabels.length];
            item.appendChild(caption);
            grid.appendChild(item);
          });
          // Append dots
          var dotsContainer = document.getElementById('gallery-dots');
          if (dotsContainer) {
            dotsContainer.innerHTML = '';
            photos.forEach(function(_, i) {
              var dot = document.createElement('div');
              dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
              dotsContainer.appendChild(dot);
            });
          }
        }
      } catch(e) { /* silent */ }
    }

    // ===== 视频沉浸式上下滑动 =====
    function initVideoSection() {
      var container = document.getElementById('reels-container');
      if (!container) return;

      var allVideos = [];

      function buildReels(videos) {
  container.innerHTML = '';
  if (!videos.length) {
    container.innerHTML = '<div class="reel-empty">暂无视频</div>';
    return;
  }
  var coverSrc = 'images/carousel/123.jpg';
  videos.forEach(function(v, idx) {
    var wrapper = document.createElement('div');
    wrapper.className = 'reel-flip-wrap';
    // Inner container for 3D flip
    var inner = document.createElement('div');
    inner.className = 'reel-flip-inner';
    // Front face: cover image
    var front = document.createElement('div');
    front.className = 'reel-flip-front';
    front.style.backgroundImage = 'url(' + coverSrc + ')';
    front.style.backgroundSize = 'cover';
    front.style.backgroundPosition = 'center';
    // Play button overlay on front
    var playBtn = document.createElement('div');
    playBtn.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;border-radius:50%;background:rgba(0,0,0,0.5);border:2px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s;';
    playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="6,3 20,12 6,21"/></svg>';
    playBtn.onmouseover = function() { this.style.background = 'rgba(255,107,0,0.7)'; this.style.borderColor = 'var(--accent-orange)'; };
    playBtn.onmouseout = function() { this.style.background = 'rgba(0,0,0,0.5)'; this.style.borderColor = 'rgba(255,255,255,0.3)'; };
    front.appendChild(playBtn);
    // Title on front
    if (v.title) {
      var titleEl = document.createElement('div');
      titleEl.style.cssText = 'position:absolute;bottom:8px;left:8px;right:8px;color:#fff;font-size:12px;font-weight:600;text-shadow:0 1px 4px rgba(0,0,0,0.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
      titleEl.textContent = v.title;
      front.appendChild(titleEl);
    }
    // Back face: video
    var back = document.createElement('div');
    back.className = 'reel-flip-back';
    var video = document.createElement('video');
    video.className = 'reel-video';
    video.src = v.src;
    if (v.poster) video.poster = v.poster; else video.poster = coverSrc;
    video.muted = false;
    video.loop = false;
    video.playsInline = true;
    video.preload = 'metadata';
    video.controls = true;
    back.appendChild(video);
    // Assemble flip card
    inner.appendChild(front);
    inner.appendChild(back);
    wrapper.appendChild(inner);
    // Click to flip
    var flipped = false;
    wrapper.addEventListener('click', function(e) {
      if (e.target.closest('.reel-video') || e.target.closest('video')) return;
      if (!flipped) {
        inner.style.transform = 'rotateY(180deg)';
        flipped = true;
        setTimeout(function() { video.play().catch(function(){}); }, 400);
      }
    });
    // When video ends, flip back
    video.addEventListener('ended', function() {
      inner.style.transform = 'rotateY(0deg)';
      flipped = false;
    });
    video.addEventListener('pause', function() {
      if (video.currentTime > 0 && !video.ended) return;
      inner.style.transform = 'rotateY(0deg)';
      flipped = false;
    });
    container.appendChild(wrapper);
  });
}function loadVideosFromServer(callback) {
        var vxhr = new XMLHttpRequest();
        vxhr.open("GET", "/api/data/videos", true);
        vxhr.timeout = 20000;
        vxhr.onload = function() {
          if (vxhr.status === 200) {
            try {
              var sv = JSON.parse(vxhr.responseText);
              if (sv && Array.isArray(sv) && sv.length) {
                localStorage.setItem('xie_admin_videos', JSON.stringify(sv));
                callback(sv);
                return;
              }
            } catch(e) {}
          }
          callback(null);
        };
        vxhr.onerror = function() { callback(null); };
        vxhr.send();
      }

      // First, cached data
      try {
        var cachedVideos = JSON.parse(localStorage.getItem('xie_admin_videos') || '[]');
        if (cachedVideos.length) {
          cachedVideos.forEach(function(v) {
            if (v.file_url || (v.embed && v.embed.trim()) || v.url) {
              allVideos.push({ id: v.id, src: v.file_url, embed: v.embed || '', title: v.title || '', desc: v.desc || '', poster: v.poster || '' });
            }
          });
          buildReels(allVideos);
        }
      } catch(e) {}

      // Then fresh data
      loadVideosFromServer(function(serverVideos) {
        if (serverVideos && serverVideos.length) {
          allVideos = [];
          serverVideos.forEach(function(v) {
            if (v.file_url || (v.embed && v.embed.trim()) || v.url) {
              allVideos.push({ id: v.id, src: v.file_url, embed: v.embed || '', title: v.title || '', desc: v.desc || '', poster: v.poster || '' });
            }
          });
          buildReels(allVideos);
        } else if (!allVideos.length) {
          buildReels(allVideos);
        }
      });
    }

    // 3. 加载后台背景音乐（已由 main.js 自动同步，此函数保留为空壳避免报错）
    function loadAdminMusic() {}

    // 4. 始祖诞辰倒计时
    (function() {
      var targetDate = new Date(2026, 9, 18, 0, 0, 0); // 农历九月初九 · 重阳节
      var now = new Date();
      if (targetDate <= now) {
        targetDate = new Date(2027, 9, 18, 0, 0, 0);
      }
      function pad2(n) { return n < 10 ? '0' + n : '' + n; }
      function updateCountdown() {
        var diff = targetDate - new Date();
        if (diff <= 0) return;
        var days = Math.floor(diff / 86400000);
        var hours = Math.floor((diff % 86400000) / 3600000);
        var mins = Math.floor((diff % 3600000) / 60000);
        var secs = Math.floor((diff % 60000) / 1000);
        var d = document.getElementById('cd-days');
        if (d) d.textContent = days;
        d = document.getElementById('cd-hours');
        if (d) d.textContent = pad2(hours);
        d = document.getElementById('cd-minutes');
        if (d) d.textContent = pad2(mins);
        d = document.getElementById('cd-seconds');
        if (d) d.textContent = pad2(secs);
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);
    })();

    // 页面加载完成后执行（DOMContentLoaded，不等待图片/视频加载）
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      loadCarouselPhotos();
      initVideoSection();
      loadAdminMusic();
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        loadCarouselPhotos();
        initVideoSection();
        loadAdminMusic();
      });
    }
  })();
