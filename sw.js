const CACHE = 'xie-clan-v4';
const STATIC = [
  '/css/style.css',
  '/js/i18n.js',
  '/js/main.js',
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

  // For static assets: cache-first, update cache on miss
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const ct = res.headers.get('Content-Type') || '';
      // Only cache images, fonts, CSS, JS
      if (ct.match(/image|font|css|javascript/)) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
