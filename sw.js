// RunRoutine Service Worker
// Strategy:
//   - HTML (index.html / root): network-first, fallback to cache. Ensures updates show through.
//   - Everything else (icons, CDN libs, manifest): cache-first.
// Bump CACHE_VERSION on every meaningful update.
const CACHE_VERSION = 'v9';
const CACHE_NAME = 'runroutine-' + CACHE_VERSION;
const ASSETS = [
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.13/dist/cdn.min.js',
  'https://cdn.jsdelivr.net/npm/dexie@3/dist/dexie.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(ASSETS.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isHtmlRequest(request) {
  const accept = request.headers.get('accept') || '';
  const url = new URL(request.url);
  if (accept.includes('text/html')) return true;
  if (url.pathname === '/' || url.pathname === '' || url.pathname.endsWith('/index.html')) return true;
  return false;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // HTML: network-first so deploys propagate immediately when online
  if (isHtmlRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || new Response('Offline', { status: 503 })))
    );
    return;
  }

  // Other assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});
