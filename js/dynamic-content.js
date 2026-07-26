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
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
        container.style.gap = '12px';
        container.style.padding = '8px';

        var allVids = [
          { id: 'intro', src: '/video/reports-intro.mp4', title: '下枫槎宣传片' },
          { id: 'yuanyu', src: '/video/yuanpu.mp4', title: '圆谱2026' },
          { id: 'promo2', src: '/video/promo2.mp4', title: '宣传片2' },
          { id: 'v777', src: '/video/777.mp4', title: '视频777' }
        ].concat(videos);

        if (!allVids.length) {
          container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">暂无视频</div>';
          return;
        }

        allVids.forEach(function(v) {
          var card = document.createElement('div');
          card.style.cssText = 'border-radius:12px;overflow:hidden;background:var(--glass-bg);border:1px solid var(--glass-border);position:relative;aspect-ratio:16/9;cursor:pointer;';

          // 封面海报
          var posterUrl = '';
          if (v.poster && v.poster.trim()) {
            posterUrl = v.poster;
          } else if (v.src && v.src.indexOf('/video/') === 0) {
            var pn = v.src.replace('/video/', '').replace('_comp.mp4', '.mp4').replace('.mp4', '') + '-poster.jpg';
            posterUrl = '/images/video-posters/' + pn;
          } else if (v.src && v.src.indexOf('/uploads/') === 0) {
            var upn = v.src.replace('/uploads/videos/', '').replace('_comp.mp4', '.mp4').replace('.mp4', '') + '.jpg';
            posterUrl = '/uploads/posters/' + upn;
          }

          // 视频标题
          var titleEl = document.createElement('div');
          titleEl.textContent = v.title || '';
          titleEl.style.cssText = 'padding:8px 10px;font-size:12px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

          if (posterUrl) {
            card.style.background = 'url(' + posterUrl + ') center/cover no-repeat, radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)';
          } else {
            card.style.background = 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)';
          }

          // 播放按钮（居中大三角）
          var playBtn2 = document.createElement('div');
          playBtn2.innerHTML = '<svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"><polygon points="8,5 19,12 8,19 8,5"/></svg>';
          playBtn2.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.8;transition:opacity 0.2s;pointer-events:none;';

          card.appendChild(playBtn2);

          // 点击播放：替换为video标签
          var _played = false;
          card.addEventListener('click', function() {
            if (_played) return;
            _played = true;
            var video = document.createElement('video');
            video.src = v.src;
            video.muted = false;
            video.playsInline = true;
            video.controls = true;
            video.autoplay = true;
            video.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;background:#000;';
            video.addEventListener('error', function() {
              card.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:red;font-size:24px;">⚠️</div>';
            });
            card.innerHTML = '';
            card.style.background = '#000';
            card.appendChild(video);
          });

          var wrapper = document.createElement('div');
          wrapper.appendChild(card);
          wrapper.appendChild(titleEl);
          container.appendChild(wrapper);
        });
      }

      // Hide the hint text since we use grid
      var hint = container.closest('.reels-wrapper')?.querySelector('.reels-hint');
      if (hint) hint.style.display = 'none';
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
