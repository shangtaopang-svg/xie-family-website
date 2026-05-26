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

// ===== 背景音乐 =====
(function() {
  var musicToggle = document.getElementById('music-toggle');
  var musicAudio = document.getElementById('bg-music');
  if (!musicToggle || !musicAudio) return;

  var isPlaying = localStorage.getItem('xie_music_playing') === 'true';
  var savedTime = parseFloat(localStorage.getItem('xie_music_time')) || 0;

  if (isPlaying) {
    musicAudio.currentTime = savedTime;
    musicAudio.play().catch(function() {});
    musicToggle.textContent = '🔊';
    musicToggle.classList.add('playing');
  }

  musicToggle.addEventListener('click', function() {
    if (musicAudio.paused) {
      musicAudio.play().catch(function() {});
      musicToggle.textContent = '🔊';
      musicToggle.classList.add('playing');
      localStorage.setItem('xie_music_playing', 'true');
    } else {
      musicAudio.pause();
      musicToggle.textContent = '🔈';
      musicToggle.classList.remove('playing');
      localStorage.setItem('xie_music_playing', 'false');
    }
  });

  musicAudio.addEventListener('timeupdate', function() {
    localStorage.setItem('xie_music_time', musicAudio.currentTime);
  });

  musicAudio.addEventListener('ended', function() {
    musicToggle.textContent = '🔈';
    musicToggle.classList.remove('playing');
    localStorage.setItem('xie_music_playing', 'false');
    localStorage.setItem('xie_music_time', '0');
  });
})();

// ===== 管理后台登录 =====
window.adminLogin = function adminLogin() {
  var pwd = document.getElementById('admin-password');
  var error = document.getElementById('admin-error');
  if (!pwd) return;
  if (pwd.value === 'admin2025') {
    document.getElementById('admin-login-box').style.display = 'none';
    document.getElementById('admin-panel').classList.add('active');
    // Trigger admin.js initialization
    if (typeof renderModule === 'function') {
      renderModule(currentModule || 'news');
      if (typeof updateStats === 'function') updateStats();
    }
    // Load data from Supabase
    if (typeof loadFromSupabase === 'function') {
      loadFromSupabase();
    }
  } else {
    if (error) {
      var errMsg = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS['admin.login.error']) ? (TRANSLATIONS['admin.login.error'][getLang()] || '密码错误，请重试') : '密码错误，请重试';
      error.textContent = errMsg;
      error.style.display = 'block';
    }
  }
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