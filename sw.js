const CACHE = 'xie-clan-v10';
const STATIC = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/style.css?v=20260901-entry-switch-06',
  '/css/ai.css?v=100',
  '/css/public-access-gate.css?v=20260830-access-mobile-01',
  '/js/i18n.js?v=20260901-lang-11',
  '/js/main.js?v=10',
  '/js/ai-assistant.js?v=100',
  '/js/public-access-gate.js?v=20260830-access-mobile-01',
  '/js/media-performance.js?v=20260830-media-01',
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

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // Skip API and uploads
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/uploads/')) return;

  // Skip HTML navigation - let them go directly to network (no SW delay)
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/offline.html')));
    return;
  }

  const path = url.pathname;

  // CSS / JS: network-first（优先网络拿最新，离线回退缓存）
  // 解决旧版 CSS/JS 被 SW 长期缓存导致样式不更新的问题
  if (path.endsWith('.css') || path.endsWith('.js')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
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
      if (res.ok && ct.match(/image|font/)) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
