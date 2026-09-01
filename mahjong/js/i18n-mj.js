/* ============================================
   宁海三中98届麻将交流群 — 翻译兼容层
   ============================================ */

const MJ_TRANSLATIONS = {
  'site.title': { zh: '宁海三中98届麻将交流群', en: 'Class 98·Mahjong Club' },
  'site.subtitle': { zh: '以牌会友 · 乐在其中', en: 'Friendship Through Mahjong' },
  'hero.sub': { zh: '宁海三中98届 · 麻将交流群', en: 'Class 98 Ninghai · Mahjong Club' },
  'nav.home': { zh: '首页', en: 'Home' },
  'nav.records': { zh: '战绩', en: 'Records' },
  'nav.stats': { zh: '统计', en: 'Stats' },
  'nav.friendship': { zh: '友谊时刻', en: 'Moments' },
  'nav.culture': { zh: '麻将文化', en: 'Culture' },
  'nav.posts': { zh: '心得', en: 'Blog' },
  'nav.theme': { zh: '切换主题', en: 'Toggle theme' },
  'nav.lang': { zh: '中英文切换', en: 'Switch language' },
  'weather.fetching': { zh: '获取天气中...', en: 'Fetching...' },
  'weather.location': { zh: '宁波宁海', en: 'Ninghai, Ningbo' },
  'weekday.0': { zh: '星期日', en: 'Sunday' },
  'weekday.1': { zh: '星期一', en: 'Monday' },
  'weekday.2': { zh: '星期二', en: 'Tuesday' },
  'weekday.3': { zh: '星期三', en: 'Wednesday' },
  'weekday.4': { zh: '星期四', en: 'Thursday' },
  'weekday.5': { zh: '星期五', en: 'Friday' },
  'weekday.6': { zh: '星期六', en: 'Saturday' },
};

// 语言切换入口已取消，麻将页面统一使用简体中文。
var mjLang = 'zh';

function getMjLang() { return mjLang; }

function toggleMjLang() {
  // 保留全局函数以兼容旧缓存脚本，但不再允许切换语言。
  mjLang = 'zh';
  try { localStorage.removeItem('xie_lang'); } catch (e) {}
  return false;
}

function applyMjLang() {
  var lang = mjLang;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var t = MJ_TRANSLATIONS[key];
    if (t) {
      var val = t[lang] || t['zh'];
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        // Preserve leading emoji if present
        var emoji = el.textContent.match(/^(©|®|[ -㌀]|\ud83c[퀀-\udfff]|\ud83d[퀀-\udfff]|\ud83e[퀀-\udfff])\s*/);
        if (emoji) val = emoji[0] + ' ' + val;
        el.textContent = val;
      }
    }
  });
  document.title = MJ_TRANSLATIONS['site.title'][lang] || '宁海三中98届麻将交流群';
  updateHeroDate(lang);
}

// Lunar calendar (simplified)
function getLunarDate(y, m, d) {
  // Approximate lunar date for 2026
  var lunarMap = {
    '2026-01-01': '冬月十三','2026-02-01': '腊月十四','2026-03-01': '正月十三',
    '2026-04-01': '二月十四','2026-05-01': '三月十五','2026-06-01': '四月十六',
    '2026-06-03': '四月十八','2026-07-01': '五月十七','2026-08-01': '六月十八',
    '2026-09-01': '七月十九','2026-10-01': '八月廿一','2026-11-01': '九月廿二',
    '2026-12-01': '十月廿三',
  };
  var key = y + '-' + String(m).padStart(2,'0') + '-' + String(d).padStart(2,'0');
  var approx = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
    '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
    '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  var dayOfYear = Math.floor((Date.UTC(y,m-1,d) - Date.UTC(y,0,1)) / 86400000);
  var lunarDay = approx[(dayOfYear + 18) % 30];
  return lunarMap[key] || ('四月' + lunarDay);
}

function updateHeroDate(lang) {
  var now = new Date();
  var y = now.getFullYear(), m = now.getMonth()+1, d = now.getDate(), w = now.getDay();
  var dayEl = document.getElementById('hero-day');
  var monthEl = document.getElementById('hero-month');
  var weekdayEl = document.getElementById('hero-weekday');
  var yearEl = document.getElementById('hero-year');
  var lunarEl = document.getElementById('hero-lunar');
  if (dayEl) dayEl.textContent = d;
  if (monthEl) monthEl.textContent = lang === 'en' ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1] : m + '月';
  var enWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var zhWeek = (MJ_TRANSLATIONS['weekday.' + w] || {}).zh || '';
  if (weekdayEl) weekdayEl.textContent = lang === 'en' ? enWeek[w] : zhWeek;
  var lunarStr = getLunarDate(y, m, d);
  if (lunarEl) lunarEl.textContent = lang === 'en' ? 'Lunar ' + lunarStr.replace(/[^初二十廿卅一二三四五六七八九十]/g,'') : '农历' + lunarStr;
  if (yearEl) yearEl.textContent = lang === 'en' ? y.toString() : y + '年';
}

// ---- Weather ----
function initWeather() {
  var descEl = document.getElementById('hero-weather-desc');
  var tempEl = document.getElementById('hero-weather-temp');
  if (!descEl) return;
  var cache = localStorage.getItem('xie_weather_cache');
  var cached = null;
  if (cache) { try { cached = JSON.parse(cache); } catch(e) {} }
  var now = Date.now();
  if (cached && (now - cached.time < 3600000)) {
    descEl.textContent = cached.condition;
    if (tempEl) tempEl.textContent = cached.temp;
    return;
  }
  if (cached) { descEl.textContent = cached.condition; if (tempEl) tempEl.textContent = cached.temp; }
  else descEl.textContent = '宁海';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://wttr.in/Ninghai?format=%C|%t&lang=zh&m', true);
  xhr.timeout = 4000;
  xhr.onload = function() {
    if (xhr.status === 200) {
      var raw = xhr.responseText;
      var sep = raw.indexOf('|');
      var condition = sep !== -1 ? raw.substring(0, sep).trim() : raw;
      var temp = sep !== -1 ? raw.substring(sep + 1).trim() : '—';
      descEl.textContent = condition;
      if (tempEl) tempEl.textContent = temp;
      localStorage.setItem('xie_weather_cache', JSON.stringify({condition: condition, temp: temp, time: Date.now()}));
    }
  };
  xhr.send();
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', function() {
  applyMjLang();
  initWeather();
});
