const CACHE_NAME = 'vodka-site-cache-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/deposit.html',
  '/vivod.html',
  '/YouTube.html',
  '/public/cache/script.js',
  '/public/cache/manifest.json',
  '/public/cache/manifest.webmanifest',
  '/public/cache/logo192.png',
  '/public/cache/logo512.png',
  '/public/cache/icons/favicon.ico',
  '/public/cache/icons/favicon.svg',
  '/public/cache/icons/favicon-16x16.png',
  '/public/cache/icons/favicon-32x32.png',
  '/public/cache/icons/favicon-48x48.png',
  '/public/cache/icons/favicon-64x64.png',
  '/public/cache/icons/favicon-96x96.png',
  '/public/cache/icons/android-chrome-192x192.png',
  '/public/cache/icons/android-chrome-512x512.png',
  '/public/cache/icons/web-app-manifest-192x192.png',
  '/public/cache/icons/web-app-manifest-512x512.png',
  '/public/cache/icons/apple-touch-icon-180x180.png',
  '/public/cache/icons/site.webmanifest',
  '/public/cache/images/back.svg',
  '/public/cache/images/vodka-casino-vitus.webp',
  '/public/cache/images/vodka_casino_vibor_valuti.webm'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
  );
});

// Simple strategies
function isHTML(request){ return request.mode === 'navigate' || (request.headers.get('accept')||'').includes('text/html'); }
function isAsset(request){ const d=request.destination; return ['style','script','font'].includes(d); }
function isImage(request){ return request.destination === 'image' || /\.(png|jpe?g|webp|avif|svg)$/i.test(new URL(request.url).pathname); }

self.addEventListener('fetch', event => {
  const req = event.request;
  // HTML: network-first
  if (isHTML(req)) {
    event.respondWith((async () => {
      try {
        const net = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, net.clone());
        return net;
      } catch {
        const cached = await caches.match(req);
        return cached || caches.match('/index.html');
      }
    })());
    return;
  }
  // CSS/JS/Fonts: cache-first
  if (isAsset(req)) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const net = await fetch(req);
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, net.clone());
      return net;
    })());
    return;
  }
  // Images: stale-while-revalidate
  if (isImage(req)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then(response => { cache.put(req, response.clone()); return response; });
      return cached || fetchPromise;
    })());
    return;
  }
  // Default: cache falling back to network
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    const net = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, net.clone());
    return net;
  })());
});

