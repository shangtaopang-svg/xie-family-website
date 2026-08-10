const CACHE = 'xie-clan-v6';
const STATIC = [
  '/css/style.css?v=5',
  '/js/i18n.js?v=9',
  '/js/main.js?v=10',
  '/favicon.svg',
  '/favicon.ico'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // Skip API and uploads
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/uploads/')) return;

  // Skip HTML navigation - let them go directly to network (no SW delay)
  if (e.request.mode === 'navigate') return;

  const path = url.pathname;

  // CSS / JS: network-first（优先网络拿最新，离线回退缓存）
  // 解决旧版 CSS/JS 被 SW 长期缓存导致样式不更新的问题
  if (path.endsWith('.css') || path.endsWith('.js')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || Response.error()))
    );
    return;
  }

  // 图片/字体等：cache-first，更新时回填
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const ct = res.headers.get('Content-Type') || '';
      if (ct.match(/image|font/)) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
