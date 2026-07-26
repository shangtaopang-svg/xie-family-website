/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   交互脚本 v3
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // === i18n 初始化 ===
  if (typeof initLanguage === 'function') initLanguage();

  // === 首页照片背景（安全兜底，inline script 可能因网络延迟未生效） ===
  var hero = document.querySelector('.hero-section');
  if (hero && !hero.classList.contains('hero-photo-bg')) {
    var hbg = localStorage.getItem('xie_hero_bg');
    var hstyle = localStorage.getItem('xie_hero_style') || 'clean';
    if (hbg && hstyle === 'photo') {
      hero.classList.add('hero-photo-bg');
      hero.style.backgroundImage = 'url(' + hbg + ')';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
    }
  }

  // === 移动端导航切换 ===
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
      toggle.innerHTML = expanded ? '✕' : '☰';
    });
  }

  // === 回到顶部 ===
  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function() {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === 滚动淡入 ===
  window.initFadeIn = function initFadeIn(container) {
    var root = container || document;
    var fadeElements = root.querySelectorAll ? root.querySelectorAll('.fade-in') : [];
    if (fadeElements.length > 0) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      fadeElements.forEach(function(el) { observer.observe(el); });
    }
  };
  window.initFadeIn();

  // === 联系表单 ===
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = window.getLang && getLang() === 'en' ? '✓ Sent' : '提交成功 ✓';
      btn.style.background = 'var(--accent-orange)';
      btn.style.color = '#000';
      setTimeout(function() {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // === 访问统计 ===
  var countEl = document.getElementById('visit-count');
  if (countEl) {
    var visits = localStorage.getItem('xie_visits') || '0';
    var count = parseInt(visits) + 1;
    localStorage.setItem('xie_visits', count.toString());
    countEl.textContent = count;
    var adminVisits = document.getElementById('admin-visits');
    if (adminVisits) adminVisits.textContent = count;
  }

  // === 图片加载失败 ===
  document.querySelectorAll('img').forEach(function(img) {
    img.addEventListener('error', function() { this.style.display = 'none'; });
  });

  // === 滚动渐入动画 ===
  var fadeEls = document.querySelectorAll('.fade-in-section');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var fadeObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(function(el) { fadeObs.observe(el); });
  } else {
    fadeEls.forEach(function(el) { el.classList.add('visible'); });
  }

  // === 消息推送通知 ===
  (function() {
    fetch('/api/data/news').then(function(r){return r.json()}).then(function(news) {
      if (!news || !news.length) return;
      var lastVisit = localStorage.getItem('xie_last_visit') || 0;
      var latestTime = new Date(news[0].date || 0).getTime();
      if (latestTime > lastVisit && lastVisit > 0) {
        var count = 0;
        news.forEach(function(n) { if (new Date(n.date||0).getTime() > lastVisit) count++; });
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:9999;background:var(--accent-orange);color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.2);cursor:pointer;animation:slideIn 0.3s ease;max-width:300px;';
        toast.innerHTML = '<div style="font-weight:700;">📢 有新消息</div><div style="font-size:12px;margin-top:4px;">' + count + ' 条新消息发布</div>';
        toast.onclick = function() { window.location.href = 'pages/news.html'; };
        document.body.appendChild(toast);
        setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(function(){toast.remove();},500); }, 8000);
      }
      localStorage.setItem('xie_last_visit', Date.now().toString());
    }).catch(function(){});
  })();

  // === 按钮水波纹 ===
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.ripple-btn');
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    var size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 600);
  });
});

// ===== 深色/浅色模式 =====
(function() {
  var themeToggle = document.getElementById('theme-toggle');
  var currentTheme = localStorage.getItem('xie_theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '🌙';
  } else {
    if (themeToggle) themeToggle.textContent = '☀️';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var html = document.documentElement;
      var isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('xie_theme', 'light');
        themeToggle.textContent = '☀️';
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('xie_theme', 'dark');
        themeToggle.textContent = '🌙';
      }
    });
  }
})();

// ===== 中英文切换 =====
// Handled by i18n.js (initLanguage + toggleLanguage)

// ===== 宁海天气 + 日期 =====
(function() {
  var heroWeatherEl = document.getElementById('hero-weather-desc');
  var heroTempEl = document.getElementById('hero-weather-temp');
  if (!heroWeatherEl) return;

  var cache = localStorage.getItem('xie_weather_cache');
  var cached = null;
  if (cache) {
    try { cached = JSON.parse(cache); } catch(e) {}
  }
  var now = Date.now();

  if (cached && (now - cached.time < 3600000)) { // 1h cache
    heroWeatherEl.textContent = cached.condition;
    if (heroTempEl) heroTempEl.textContent = cached.temp;
    return;
  }

  // Show cached or placeholder immediately, don't block UI
  if (cached) {
    heroWeatherEl.textContent = cached.condition;
    if (heroTempEl) heroTempEl.textContent = cached.temp;
  } else {
    heroWeatherEl.textContent = '宁海';
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://wttr.in/Ninghai?format=%C|%t&lang=zh&m', true);
  xhr.timeout = 4000;
  xhr.onload = function() {
    if (xhr.status === 200) {
      var html = xhr.responseText;
      var raw = html;
      var last = html.lastIndexOf('term-container');
      if (last !== -1) {
        var tagEnd = html.indexOf('>', last);
        var divEnd = html.indexOf('</div>', tagEnd);
        if (tagEnd !== -1 && divEnd !== -1) {
          raw = html.substring(tagEnd + 1, divEnd).trim();
        }
      }
      var sep = raw.indexOf('|');
      var condition = sep !== -1 ? raw.substring(0, sep).trim() : raw;
      var temp = sep !== -1 ? raw.substring(sep + 1).trim() : '—';
      heroWeatherEl.textContent = condition;
      if (heroTempEl) heroTempEl.textContent = temp;
      localStorage.setItem('xie_weather_cache', JSON.stringify({condition: condition, temp: temp, time: Date.now()}));
    }
  };
  xhr.onerror = function() {};
  xhr.ontimeout = function() {};
  xhr.send();
})();

// ===== 背景音乐（支持多首播放列表） =====
function initMusicPlayer() {
  var musicToggle = document.getElementById('music-toggle');
  var musicPrev = document.getElementById('music-prev');
  var musicNext = document.getElementById('music-next');
  var musicAudio = document.getElementById('bg-music');
  var trackName = document.getElementById('music-track-name');
  if (!musicToggle || !musicAudio) return;

  var playlist = [];
  var currentIndex = 0;

  function resolveUrl(url) {
    if (!url) return '';
    if (url.indexOf('://') > 0 || url.indexOf('//') === 0) return url;
    if (url.indexOf('/') === 0) return window.location.origin + url;
    return window.location.origin + '/' + url;
  }

  function loadPlaylist() {
    try {
      var data = JSON.parse(localStorage.getItem('xie_admin_music') || '[]');
      playlist = data.filter(function(v) { return v.file_url && v.file_url.trim(); });
    } catch(e) { playlist = []; }
    if (!playlist.length) {
      playlist = [{ title: '背景音乐', file_url: 'music/background.mp3' }];
    }
  }

  function setTrack(index) {
    if (index < 0) index = playlist.length - 1;
    if (index >= playlist.length) index = 0;
    currentIndex = index;
    var track = playlist[currentIndex];
    if (!track) return;
    var src = resolveUrl(track.file_url || 'music/background.mp3');
    if (musicAudio.src !== src) {
      musicAudio.src = src;
      musicAudio.load();
    }
    if (trackName) trackName.textContent = track.title || '未知曲目';
    localStorage.setItem('xie_music_index', currentIndex);
  }

  function doPlay() {
    // Lazy-load audio: set src only when user actually clicks play
    if (!musicAudio.src || musicAudio.src === window.location.href || musicAudio.src === '') {
      setTrack(currentIndex);
    }
    var p = musicAudio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function(e) {
        console.warn('Music play blocked:', e.message);
        // Autoplay likely blocked by browser — reset button state
        musicToggle.textContent = '🔈';
        musicToggle.classList.remove('playing');
        localStorage.setItem('xie_music_playing', 'false');
      });
    }
  }

  function togglePlay() {
    if (musicAudio.paused) {
      doPlay();
      musicToggle.textContent = '🔊';
      musicToggle.classList.add('playing');
      localStorage.setItem('xie_music_playing', 'true');
    } else {
      musicAudio.pause();
      musicToggle.textContent = '🔈';
      musicToggle.classList.remove('playing');
      localStorage.setItem('xie_music_playing', 'false');
    }
  }

  function playNext() { setTrack(currentIndex + 1); if (playlist.length > 0) doPlay(); }
  function playPrev() { setTrack(currentIndex - 1); if (playlist.length > 0) doPlay(); }

  // Init
  loadPlaylist();
  // Default to playing on first visit
  if (localStorage.getItem('xie_music_playing') === null) {
    localStorage.setItem('xie_music_playing', 'true');
  }
  var isPlaying = localStorage.getItem('xie_music_playing') === 'true';
  var savedTime = parseFloat(localStorage.getItem('xie_music_time')) || 0;
  var savedIndex = parseInt(localStorage.getItem('xie_music_index')) || 0;

  if (savedIndex < playlist.length) currentIndex = savedIndex;
  // Don't pre-load audio file — wait until user clicks play
  // setTrack(currentIndex);  (removed for performance)
  if (isPlaying && playlist.length) {
    musicAudio.currentTime = savedTime;
    doPlay();
    musicToggle.textContent = '🔊';
    musicToggle.classList.add('playing');
  }

  musicToggle.addEventListener('click', togglePlay);
  if (musicPrev) musicPrev.addEventListener('click', playPrev);
  if (musicNext) musicNext.addEventListener('click', playNext);

  musicAudio.addEventListener('timeupdate', function() {
    localStorage.setItem('xie_music_time', musicAudio.currentTime);
  });

  // Log audio errors (file 404, decode failure, etc.)
  musicAudio.addEventListener('error', function() {
    var errMsg = 'unknown';
    if (musicAudio.error) {
      errMsg = 'code=' + musicAudio.error.code + ' message=' + musicAudio.error.message;
    }
    console.warn('Music audio error (' + musicAudio.src + '): ' + errMsg);
    // Reset playing state so UI isn't stuck
    musicToggle.textContent = '🔈';
    musicToggle.classList.remove('playing');
    localStorage.setItem('xie_music_playing', 'false');
  });

  musicAudio.addEventListener('ended', function() {
    if (playlist.length > 1) {
      playNext();
    } else {
      musicToggle.textContent = '🔈';
      musicToggle.classList.remove('playing');
      localStorage.setItem('xie_music_playing', 'false');
      localStorage.setItem('xie_music_time', '0');
    }
  });

  // Expose for external reload (after XHR sync)
  window.reloadMusicPlaylist = function() {
    loadPlaylist();
    setTrack(0);
    localStorage.setItem('xie_music_index', '0');
    if (musicToggle.classList.contains('playing')) {
      doPlay();
    }
  };

  // Also fetch fresh music data from server on init
  var mxhr = new XMLHttpRequest();
  mxhr.open("GET", "/api/data/music", true);
  mxhr.timeout = 10000;
  mxhr.onload = function() {
    if (mxhr.status === 200) {
      try {
        var sm = JSON.parse(mxhr.responseText);
        if (sm && Array.isArray(sm) && sm.length) {
          var oldStr = localStorage.getItem('xie_admin_music');
          var newStr = JSON.stringify(sm);
          if (oldStr !== newStr) {
            localStorage.setItem('xie_admin_music', newStr);
            window.reloadMusicPlaylist();
          }
        } else {
          // Server returned no music — log for debugging
          if (localStorage.getItem('xie_admin_music') && !sm.length) {
            console.warn('Music XHR: server returned empty array, but localStorage has data');
          }
        }
      } catch(e) { console.warn('Music XHR parse error:', e.message); }
    } else {
      console.warn('Music XHR failed: HTTP ' + mxhr.status);
    }
  };
  mxhr.onerror = function() { console.warn('Music XHR network error'); };
  mxhr.ontimeout = function() { console.warn('Music XHR timeout'); };
  mxhr.send();

  // Listen for localStorage changes from other tabs (admin saves music)
  window.addEventListener('storage', function(e) {
    if (e.key === 'xie_admin_music' && e.newValue) {
      var oldLen = playlist.length;
      loadPlaylist();
      if (playlist.length !== oldLen) {
        setTrack(0);
        if (musicToggle.classList.contains('playing')) doPlay();
      }
    }
  });
}

// Wait for DOM before initializing music player
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initMusicPlayer();
} else {
  document.addEventListener('DOMContentLoaded', initMusicPlayer);
}

// ===== 管理后台登录（服务端认证，带本地兜底） =====
window.adminLogin = function adminLogin() {
  var pwd = document.getElementById('admin-password');
  var error = document.getElementById('admin-error');
  var loginBox = document.getElementById('admin-login-box');
  var panel = document.getElementById('admin-panel');
  if (!pwd || !loginBox || !panel) return;

  var password = pwd.value;

  function enterPanel() {
    loginBox.style.display = 'none';
    panel.classList.add('active');
    localStorage.setItem('xie_admin_authed', 'true');
    // Trigger admin.js initialization
    if (typeof renderModule === 'function') {
      renderModule(currentModule || 'news');
      if (typeof updateStats === 'function') updateStats();
    }
    if (typeof loadFromSupabase === 'function') {
      loadFromSupabase();
    }
  }

  function showError(msg) {
    if (error) {
      error.textContent = msg || (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS['admin.login.error']
        ? TRANSLATIONS['admin.login.error'][getLang()] || '密码错误，请重试'
        : '密码错误，请重试');
      error.style.display = 'block';
    }
  }

  // 1. Try server-side auth first
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.timeout = 5000;
  xhr.onload = function() {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      if (data.ok) {
        localStorage.setItem('xie_admin_token', data.token);
        localStorage.setItem('xie_admin_authed', 'true');
        enterPanel();
        return;
      }
    }
    // 2. Server returned error
    showError();
  };
  xhr.onerror = function() {
    document.getElementById('admin-error').textContent = '无法连接服务器，请检查网络后重试';
    document.getElementById('admin-error').style.display = 'block';
  };
  xhr.ontimeout = function() {
    document.getElementById('admin-error').textContent = '服务器响应超时，请刷新后重试';
    document.getElementById('admin-error').style.display = 'block';
  };
  xhr.send(JSON.stringify({ password: password }));
}

// admin logout
document.addEventListener('DOMContentLoaded', function() {
  var logoutBtn = document.getElementById('admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      document.getElementById('admin-login-box').style.display = 'block';
      document.getElementById('admin-panel').classList.remove('active');
      var pwd = document.getElementById('admin-password');
      if (pwd) pwd.value = '';
      var area = document.getElementById('admin-content-area');
      if (area) area.innerHTML = '';
    });
  }
});


// ===== 照片轮播 =====
var carouselIndex = 0;
var carouselAutoTimer = null;

function initCarousel() {
  var track = document.getElementById('carousel-track');
  var dots = document.getElementById('carousel-dots');
  if (!track || !dots) return;
  var slides = track.querySelectorAll('.carousel-slide');
  for (var i = 0; i < slides.length; i++) {
    var dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('data-index', i);
    dot.addEventListener('click', function() { goToCarousel(parseInt(this.getAttribute('data-index'))); });
    dots.appendChild(dot);
  }
  // Touch/swipe support for mobile
  var startX = 0, startY = 0;
  track.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    stopAutoPlay();
  }, { passive: true });
  track.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) moveCarousel(-1); else moveCarousel(1);
    }
    startAutoPlay();
  }, { passive: true });
  startAutoPlay();
}

function moveCarousel(dir) { goToCarousel(carouselIndex + dir); }

function goToCarousel(idx) {
  var track = document.getElementById('carousel-track');
  var dots = document.getElementById('carousel-dots');
  if (!track || !dots) return;
  var slides = track.querySelectorAll('.carousel-slide');
  if (idx < 0) idx = slides.length - 1;
  if (idx >= slides.length) idx = 0;
  carouselIndex = idx;
  track.style.transform = 'translateX(-' + (idx * 100) + '%)';
  dots.querySelectorAll('.carousel-dot').forEach(function(d, i) {
    d.classList.toggle('active', i === idx);
  });
  resetAutoPlay();
}

function startAutoPlay() { stopAutoPlay(); carouselAutoTimer = setInterval(function() { moveCarousel(1); }, 2200); }
function stopAutoPlay() { if (carouselAutoTimer) { clearInterval(carouselAutoTimer); carouselAutoTimer = null; } }
function resetAutoPlay() { stopAutoPlay(); startAutoPlay(); }

document.addEventListener('DOMContentLoaded', initCarousel);

// ===== 灯箱 Lightbox =====
(function() {
  var overlay, imgWrap, img, counter, thumbsWrap, autoTimer;
  var photos = [];
  var currentIdx = 0;

  function createOverlay() {
    if (document.querySelector('.lightbox-overlay')) return;
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.id = 'lightbox-overlay';
    overlay.innerHTML =
      '<button class="lightbox-close" id="lb-close">✕</button>' +
      '<div class="lightbox-img-wrap" id="lb-img-wrap">' +
        '<button class="lightbox-nav lightbox-nav-prev" id="lb-prev">‹</button>' +
        '<img id="lb-img" src="" alt="">' +
        '<button class="lightbox-nav lightbox-nav-next" id="lb-next">›</button>' +
        '<div class="lightbox-counter" id="lb-counter"></div>' +
      '</div>' +
      '<div class="lightbox-thumbs" id="lb-thumbs"></div>';
    document.body.appendChild(overlay);
    imgWrap = document.getElementById('lb-img-wrap');
    img = document.getElementById('lb-img');
    counter = document.getElementById('lb-counter');
    thumbsWrap = document.getElementById('lb-thumbs');

    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', function() { navLightbox(-1); });
    document.getElementById('lb-next').addEventListener('click', function() { navLightbox(1); });

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    });
  }

  window.openLightbox = function(photoArray, index) {
    createOverlay();
    if (!photoArray || photoArray.length === 0) return;
    photos = photoArray;
    currentIdx = index || 0;
    if (currentIdx < 0) currentIdx = 0;
    if (currentIdx >= photos.length) currentIdx = photos.length - 1;
    overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    updateLightbox();
    startAutoPlay();
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    overlay = document.getElementById('lightbox-overlay');
    if (overlay) overlay.classList.remove('open');
    stopAutoPlay();
    document.body.style.overflow = '';
  };

  function navLightbox(dir) {
    stopAutoPlay();
    currentIdx += dir;
    if (currentIdx < 0) currentIdx = photos.length - 1;
    if (currentIdx >= photos.length) currentIdx = 0;
    updateLightbox();
    startAutoPlay();
  }

  window.lightboxPrev = function() { navLightbox(-1); };
  window.lightboxNext = function() { navLightbox(1); };

  function updateLightbox() {
    if (!photos.length) return;
    img = document.getElementById('lb-img');
    counter = document.getElementById('lb-counter');
    thumbsWrap = document.getElementById('lb-thumbs');
    if (img) img.src = photos[currentIdx];
    if (counter) counter.textContent = (currentIdx + 1) + ' / ' + photos.length;

    if (thumbsWrap) {
      thumbsWrap.innerHTML = '';
      for (var i = 0; i < photos.length; i++) {
        var thumb = document.createElement('img');
        thumb.src = photos[i];
        thumb.className = i === currentIdx ? 'active' : '';
        thumb.onerror = function() { this.style.display = 'none'; };
        thumb.onclick = (function(idx) { return function() {
          stopAutoPlay();
          currentIdx = idx;
          updateLightbox();
          startAutoPlay();
        }; })(i);
        thumbsWrap.appendChild(thumb);
      }
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(function() { navLightbox(1); }, 3000);
  }
  function stopAutoPlay() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Touch/swipe support
  document.addEventListener('DOMContentLoaded', function() {
    createOverlay();
    overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    var startX = 0;
    overlay.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', function(e) {
      var diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) navLightbox(1);
        else navLightbox(-1);
      }
    }, { passive: true });
  });
})();
/* ===== 页面过渡特效 ===== */
document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.getElementById('page-transition');
  // 如果页面没有遮罩HTML，动态创建
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-transition';
    overlay.style.display = 'none';
    overlay.innerHTML = '<div class="pt-bar"></div><div class="pt-content"><div class="pt-tri"><svg viewBox="0 0 60 60"><line x1="30" y1="6" x2="7" y2="48"/><line x1="7" y1="48" x2="53" y2="48"/><line x1="53" y1="48" x2="30" y2="6"/></svg></div><div class="pt-title">ShangTaoPang 正在工作中<span class="pt-dot">.</span><span class="pt-dot">.</span><span class="pt-dot">.</span></div></div>';
    document.body.appendChild(overlay);
  }

  // 事件委托：拦截所有导航点击
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    // 只拦截站内导航
    if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
    if (!href.includes('.html') && !href.includes('/')) return;
    // 当前页不跳转
    var cur = window.location.pathname.split('/').pop() || 'index.html';
    if (href === cur || href === './' + cur) return;
    
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem('pt_transition', '1');
    overlay.style.cssText = 'display:flex !important;';
    setTimeout(function() {
      window.location.href = href;
    }, 800);
  });
});

/* ===== 打字机效果 ===== */
document.addEventListener('DOMContentLoaded', function() {
  function typeWriter(el, text, speed, callback) {
    el.textContent = '';
    var cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    el.after(cursor);
    var i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(function() {
          cursor.classList.add('stop');
          setTimeout(function() {
            if (cursor.parentNode) cursor.remove();
            if (callback) callback();
          }, 2500);
        }, 500);
      }
    }
    type();
  }

  // 侧边栏打字：下枫槎谢氏
  var sidebarTitle = document.querySelector('.logo-text h1');
  if (sidebarTitle) {
    var origText = sidebarTitle.textContent;
    if (origText) {
      typeWriter(sidebarTitle, origText, 120, function() {
        
      });
    }
  }

  // 首页 hero 打字：乌衣世泽 宝树家声 → 副标题
  var heroMotto = document.querySelector('.hero-motto');
  if (heroMotto) {
    var mottoText = heroMotto.textContent;
    heroMotto.style.display = 'inline-block';
    typeWriter(heroMotto, mottoText, 150, function() {
      var heroSub = document.querySelector('.hero-sub');
      if (heroSub) {
        var subText = heroSub.textContent;
        heroSub.style.display = 'inline-block';
        typeWriter(heroSub, subText, 100, function() {
          
        });
      }
    });
  }
});
