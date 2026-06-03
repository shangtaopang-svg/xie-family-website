/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Hero background effects (toggle + restore from settings)
   Extracted from index.html
   ============================================ */

// === Hero background toggle buttons ===
(function() {
  var btns = document.querySelectorAll('.hbg-btn');
  var hero = document.querySelector('.hero-section');
  if (!hero || !btns.length) return;
  function apply(bg, style) {
    hero.classList.remove('hero-photo-bg', 'hero-map-bg');
    hero.style.backgroundImage = '';
    btns.forEach(function(b) { b.classList.remove('active'); });
    var match = document.querySelector('.hbg-btn[data-style="' + style + '"]');
    if (match) match.classList.add('active');
    if (style === 'map') {
      hero.classList.add('hero-map-bg');
      document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'map' }));
    } else if (bg && style === 'photo') {
      hero.classList.add('hero-photo-bg');
      hero.style.backgroundImage = 'url(' + bg + ')';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
      document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'particle' }));
    } else {
      document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'particle' }));
    }
  }
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function() {
      var style = this.getAttribute('data-style');
      localStorage.setItem('xie_hero_style', style);
      apply(localStorage.getItem('xie_hero_bg'), style);
    });
  }
  var cur = localStorage.getItem('xie_hero_style') || 'map';
  if (cur === 'particle') cur = 'clean';
  var activeBtn = document.querySelector('.hbg-btn[data-style="' + cur + '"]');
  if (activeBtn) activeBtn.classList.add('active');
})();

// === Restore from settings API ===
(function() {
  var hero = document.querySelector('.hero-section');
  if (!hero) return;
  function applyHero(bg, style) {
    hero.classList.remove('hero-photo-bg', 'hero-map-bg');
    hero.style.backgroundImage = '';
    if (style === 'map') {
      hero.classList.add('hero-map-bg');
      document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'map' }));
      window._xieBgPending = 'map';
    } else if (bg && style === 'photo') {
      hero.classList.add('hero-photo-bg');
      hero.style.backgroundImage = 'url(' + bg + ')';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
      document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'particle' }));
    } else {
      document.dispatchEvent(new CustomEvent('xie-bg-mode', { detail: 'particle' }));
    }
  }
  var bg = localStorage.getItem('xie_hero_bg');
  var style = localStorage.getItem('xie_hero_style') || 'clean';
  if (style === 'particle') style = 'clean';
  applyHero(bg, style);
  fetch('/api/data/settings').then(function(r) { return r.json(); }).then(function(data) {
    if (!data || !data.length) return;
    var sbg = '', sstyle = 'clean';
    for (var i = 0; i < data.length; i++) {
      if (data[i].key === 'hero_bg') sbg = data[i].value;
      if (data[i].key === 'hero_style') sstyle = data[i].value;
    }
    if (sstyle === 'particle') sstyle = 'clean';
    if (sbg !== bg || sstyle !== style) {
      localStorage.setItem('xie_hero_bg', sbg);
      localStorage.setItem('xie_hero_style', sstyle);
      applyHero(sbg, sstyle);
    }
  }).catch(function() {});
})();
