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

        // Always prepend promo videos first
        var allVids = [
          { id: 'promo1', src: '/video/promo1.mp4', title: '宣传片1', poster: '/images/carousel/123.jpg' },
          { id: 'promo2', src: '/video/promo2.mp4', title: '宣传片2', poster: '/images/carousel/123.jpg' },
          { id: 'v777', src: '/video/777.mp4', title: '视频777', poster: '/images/carousel/123.jpg' }
        ].concat(videos);

        if (!allVids.length) {
          container.innerHTML = '<div class="reel-empty">暂无视频</div>';
          return;
        }

        // Build each reel item — 完全独立的卡片
        allVids.forEach(function(v, idx) {
          var item = document.createElement('div');
          item.className = 'reel-item';
          // 所有视频默认暂停，互不影响
          item.classList.add('paused');

          var video = document.createElement('video');
          video.className = 'reel-video';
          video.dataset.src = v.src;  // lazy load: don't set src until play
          if (v.poster) video.poster = v.poster; else video.poster = 'images/carousel/123.jpg';
          video.muted = false;
          video.loop = true;
          video.playsInline = true;
          video.preload = 'none';

          item.appendChild(video);

          // 视频比例检测
          video.addEventListener('loadedmetadata', function() {
            if (video.videoHeight > video.videoWidth) {
              item.classList.add('is-portrait');
            } else if (video.videoWidth / video.videoHeight > 1.5) {
              item.classList.add('is-landscape');
            }
          });

          // Play icon overlay — 直接点击播放，防止被其他元素拦截
          var playIcon = document.createElement('div');
          playIcon.className = 'reel-play-icon';
          playIcon.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
          playIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (video.paused) {
              // Lazy-load video src on first play
              if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
                video.load();
              }
              video.play().catch(function(){});
              item.classList.remove('paused');
            } else {
              video.pause();
              item.classList.add('paused');
            }
          });
          item.appendChild(playIcon);

          // Bottom gradient overlay
          var overlay = document.createElement('div');
          overlay.className = 'reel-overlay';

          if (v.title) {
            var titleEl = document.createElement('div');
            titleEl.className = 'reel-title';
            titleEl.textContent = v.title;
            overlay.appendChild(titleEl);
          }

          // 进度条 + 时间
          var progressWrap = document.createElement('div');
          progressWrap.className = 'reel-progress-wrap';

          var progressBar = document.createElement('div');
          progressBar.className = 'reel-progress-bar';
          var progressFill = document.createElement('div');
          progressFill.className = 'reel-progress-fill';
          progressBar.appendChild(progressFill);

          var timeDisplay = document.createElement('span');
          timeDisplay.className = 'reel-time';
          timeDisplay.textContent = '0:00 / 0:00';

          progressWrap.appendChild(progressBar);
          progressWrap.appendChild(timeDisplay);

          // 进度条点击拖拽
          var _seeking = false;
          function getClickPct(e) {
            var rect = progressBar.getBoundingClientRect();
            var cx = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
            var x = Math.max(0, Math.min(cx - rect.left, rect.width));
            return x / rect.width;
          }
          function seekTo(e) {
            var pct = getClickPct(e);
            progressFill.classList.add('is-seeking');
            progressFill.style.width = (pct * 100) + '%';
            var dur = video.duration;
            if (dur && isFinite(dur) && dur > 0) {
              video.currentTime = pct * dur;
            }
          }
          progressBar.addEventListener('mousedown', function(e) {
            e.stopPropagation(); _seeking = true; seekTo(e);
          });
          document.addEventListener('mousemove', function(e) {
            if (!_seeking) return;
            e.preventDefault();
            var pct = getClickPct(e);
            progressFill.style.width = (pct * 100) + '%';
          });
          document.addEventListener('mouseup', function() {
            if (_seeking) { _seeking = false; progressFill.classList.remove('is-seeking'); }
          });
          progressBar.addEventListener('click', function(e) { e.stopPropagation(); seekTo(e); });
          progressBar.addEventListener('touchstart', function(e) {
            e.stopPropagation(); _seeking = true; seekTo(e.changedTouches[0]);
          }, { passive: true });
          progressBar.addEventListener('touchmove', function(e) {
            e.preventDefault(); seekTo(e.changedTouches[0]);
          }, { passive: false });

          // 进度和时间更新
          var _rafTick = false;
          video.addEventListener('timeupdate', function() {
            if (_rafTick) return;
            if (!video.duration) return;
            _rafTick = true;
            requestAnimationFrame(function() {
              _rafTick = false;
              progressFill.style.width = ((video.currentTime / video.duration) * 100) + '%';
              var cm = Math.floor(video.currentTime / 60);
              var cs = Math.floor(video.currentTime % 60);
              var dm = Math.floor(video.duration / 60);
              var ds = Math.floor(video.duration % 60);
              timeDisplay.textContent = cm + ':' + (cs < 10 ? '0' : '') + cs + ' / ' + dm + ':' + (ds < 10 ? '0' : '') + ds;
            });
          });

          overlay.appendChild(progressWrap);

          // Controls
          var controls = document.createElement('div');
          controls.className = 'reel-controls';

          var playBtn = document.createElement('button');
          playBtn.className = 'reel-btn reel-btn-play';
          playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
          playBtn.setAttribute('aria-label', '播放/暂停');
          playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (video.paused) {
              video.play().catch(function(){});
              item.classList.remove('paused');
            } else {
              video.pause();
              item.classList.add('paused');
            }
          });
          video.addEventListener('play', function() {
            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
            // 暂停背景音乐
            var bgMusic = document.getElementById('bg-music');
            if (bgMusic && !bgMusic.paused) {
              bgMusic.dataset._wasPlaying = 'true';
              bgMusic.pause();
            }
          });
          video.addEventListener('pause', function() {
            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
          });
          controls.appendChild(playBtn);

          var spacer = document.createElement('div');
          spacer.style.flex = '1';
          controls.appendChild(spacer);

          // 缩放
          var zoomBtn = document.createElement('button');
          zoomBtn.className = 'reel-btn reel-btn-zoom';
          zoomBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
          zoomBtn.setAttribute('aria-label', '缩放模式');
          zoomBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            item.classList.toggle('is-zoomed');
            var isZoomed = item.classList.contains('is-zoomed');
            zoomBtn.innerHTML = isZoomed
              ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>'
              : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
          });
          controls.appendChild(zoomBtn);

          // 关闭按钮
          var closeBtn = document.createElement('button');
          closeBtn.className = 'reel-btn reel-btn-close';
          closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
          closeBtn.setAttribute('aria-label', '关闭');
          closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            video.pause();
            video.currentTime = 0;
            video.loop = false;
            item.classList.add('paused');
          });
          controls.appendChild(closeBtn);

          // 全屏
          var fsBtn = document.createElement('button');
          fsBtn.className = 'reel-btn reel-btn-fs';
          fsBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
          fsBtn.setAttribute('aria-label', '全屏播放');
          fsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
              if (item.requestFullscreen) item.requestFullscreen();
              else if (item.webkitRequestFullscreen) item.webkitRequestFullscreen();
            } else {
              if (document.exitFullscreen) document.exitFullscreen();
              else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            }
          });
          function updateFsIcon() {
            var isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
            fsBtn.innerHTML = isFS
              ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'
              : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
          }
          document.addEventListener('fullscreenchange', updateFsIcon);
          document.addEventListener('webkitfullscreenchange', updateFsIcon);
          controls.appendChild(fsBtn);

          overlay.appendChild(controls);
          item.appendChild(overlay);

          // 点击视频切换播放/暂停
          item.addEventListener('click', function(e) {
            if (e.target.closest('.reel-controls') || e.target.closest('.reel-progress-wrap')) return;
            if (video.paused) {
              video.play().catch(function(){});
              item.classList.remove('paused');
            } else {
              video.pause();
              item.classList.add('paused');
            }
          });

          container.appendChild(item);
        });

        // BGM: 当 reels 区域离开视口时恢复背景音乐
        var reelsContainer = document.getElementById('reels-container');
        if (reelsContainer) {
          var sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (!entry.isIntersecting) {
                var bgMusic = document.getElementById('bg-music');
                if (bgMusic && bgMusic.dataset._wasPlaying === 'true' && bgMusic.paused) {
                  bgMusic.play().catch(function(){});
                }
              }
            });
          }, { threshold: 0 });
          sectionObserver.observe(reelsContainer);
        }
      }

      // Load videos from server data
      function loadVideosFromServer(callback) {
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
        }
        buildReels(allVideos);
      } catch(e) { buildReels(allVideos); }

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
