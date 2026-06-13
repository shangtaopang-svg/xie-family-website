/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Fullscreen/lightbox viewers
   Extracted from index.html
   ============================================ */

(function() {
// 图片全屏
  function viewFullscreen(imgSrc, label) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    overlay.onclick = function() { overlay.remove(); };
    var img = document.createElement('img');
    img.src = imgSrc;
    img.style.cssText = 'max-width:92vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.5);';
    overlay.appendChild(img);
    if (label) {
      var cap = document.createElement('div');
      cap.textContent = label;
      cap.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);color:#ccc;font-size:14px;background:rgba(0,0,0,0.6);padding:8px 20px;border-radius:6px;pointer-events:none;';
      overlay.appendChild(cap);
    }
    document.body.appendChild(overlay);
  }

  // 视频全屏

  // Photo lightbox for carousel images
  function openPhotoLightbox(src, title) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;';
    // Only close when clicking on overlay background, not on the image
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    var img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'max-width:95vw;max-height:92vh;object-fit:contain;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.5);cursor:zoom-in;transition:transform 0.3s ease;';
    img.alt = title || '';
    img.onclick = function(e) {
      e.stopPropagation();
      if (img.style.transform === 'scale(1.5)') {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'zoom-in';
      } else {
        img.style.transform = 'scale(1.5)';
        img.style.cursor = 'zoom-out';
      }
    };
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:fixed;top:16px;right:20px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.4);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:18px;cursor:pointer;z-index:10;display:flex;align-items:center;justify-content:center;opacity:0.6;';
    closeBtn.onmouseover = function() { this.style.opacity = '1'; };
    closeBtn.onmouseout = function() { this.style.opacity = '0.6'; };
    closeBtn.onclick = function(e) { e.stopPropagation(); overlay.remove(); };
    overlay.appendChild(closeBtn);
    overlay.appendChild(img);
    if (title) {
      var cap = document.createElement('div');
      cap.textContent = title + '（点击图片缩放）';
      cap.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);color:#aaa;font-size:13px;background:rgba(0,0,0,0.5);padding:5px 14px;border-radius:6px;pointer-events:none;';
      overlay.appendChild(cap);
    }
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escHandler); }
    });
    document.body.appendChild(overlay);
  }

  function viewVideoFullscreen(src, title, poster) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    overlay.onclick = function(e) { if (e.target === overlay) { closeVid(); } };

    // Show poster immediately — no black screen
    if (poster) {
      overlay.style.backgroundImage = 'url(' + poster + ')';
      overlay.style.backgroundSize = 'contain';
      overlay.style.backgroundPosition = 'center';
      overlay.style.backgroundRepeat = 'no-repeat';
    }

    function closeVid() {
      if (video) {
        video.pause();
        video.muted = true;
        video.src = '';
        video.load();
      }
      overlay.remove();
    }

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:fixed;top:20px;right:24px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;z-index:10;opacity:0.7;';
    closeBtn.onclick = closeVid;
    overlay.appendChild(closeBtn);

    var video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.style.cssText = 'max-width:92vw;max-height:85vh;width:auto;height:auto;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.5);opacity:0;transition:opacity 0.15s;';
    video.src = src;

    // When video can play, hide poster and show video
    var ready = function() {
      overlay.style.backgroundImage = '';
      video.style.opacity = '1';
    };
    video.addEventListener('canplay', ready);
    video.addEventListener('loadeddata', ready);

    overlay.appendChild(video);

    if (title) {
      var cap = document.createElement('div');
      cap.textContent = title;
      cap.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);color:#aaa;font-size:13px;background:rgba(0,0,0,0.5);padding:6px 16px;border-radius:4px;pointer-events:none;';
      overlay.appendChild(cap);
    }

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') { closeVid(); document.removeEventListener('keydown', escHandler); }
    });
    document.body.appendChild(overlay);
  }

  // 点击照片→全屏
  document.addEventListener('click', function(e) {
    var item = e.target.closest('.gallery-item');
    if (item) {
      var img = item.querySelector('img');
      if (img) {
        var captionEl = item.querySelector('.gallery-caption');
        viewFullscreen(img.src, captionEl ? captionEl.textContent : '');
      }
    }
  });
  // Export functions globally for inline onclick use
  window.openPhotoLightbox = openPhotoLightbox;
  window.viewFullscreen = viewFullscreen;
})();
