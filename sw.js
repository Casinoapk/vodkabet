const CACHE_NAME = 'vodka-site-cache-v6';
const urlsToCache = [
  '/public/cache/style.css',
  '/',
  '/index.html',
  '/deposit.html',
  '/vivod.html',
  '/YouTube.html',
  '/public/cache/poker.jpg',
  '/public/cache/roulette.jpg',
  '/public/cache/slots.jpg',
  '/public/cache/blackjack.jpg',
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
  '/public/cache/images/deposit/panel_dlia_deposita_v_vodka_casino.avif',
  '/public/cache/images/deposit/panel_dlia_deposita_v_vodka_casino.min.avif',
  '/public/cache/images/deposit/panel_dlia_deposita_v_vodka_casino.mobile.avif',
  '/public/cache/images/deposit/stranica_popolnenia_scheta_na_vodka_casono.avif',
  '/public/cache/images/deposit/stranica_popolnenia_scheta_na_vodka_casono.min.avif',
  '/public/cache/images/deposit/vodka_casino_najmi_na_plus_i_popadeesh_na_stranicu_popolnenia_scheeta.min.avif',
  '/public/cache/images/deposit/vodka_casino_zagruzi_itot_chek_dlia_podtverjdenia_depozita.avif',
  '/public/cache/images/deposit/vodka_casino_zagruzi_itot_chek_dlia_podtverjdenia_depozita.min.avif',
  '/public/cache/images/vivod/nalichnii_vivod_casino_vodka.avif',
  '/public/cache/images/vivod/nalichnii_vivod_casino_vodka.min.avif',
  '/public/cache/images/vivod/samii_bistrii_vivod_vodka_casino.avif',
  '/public/cache/images/vivod/samii_bistrii_vivod_vodka_casino.min.avif',
  '/public/cache/images/vivod/usdt-trc20_vivod_vodka_casino.avif',
  '/public/cache/images/vivod/usdt-trc20_vivod_vodka_casino.min.avif',
  '/public/cache/images/vivod/vivod_iz_vodka_casino_po_nomeru_cheta.avif',
  '/public/cache/images/vivod/vivod_iz_vodka_casino_po_nomeru_cheta.min.avif',
  '/public/cache/images/vivod/vivod_na_piastrix_iz_vodka_casino.avif',
  '/public/cache/images/vivod/vivod_na_piastrix_iz_vodka_casino.min.avif',
  '/public/cache/images/vivod/vivodi_na_t-bank_vodka_casino.avif',
  '/public/cache/images/vivod/vivodi_na_t-bank_vodka_casino.min.avif',
  '/public/cache/images/vivod/vivodi_na_t-bank_vodka_casino.mobile.avif',
  '/public/cache/images/vivod/vodka_casino_spb_vivod_po_nomeru_telefon.avif',
  '/public/cache/images/vivod/vodka_casino_vivod_na_sberbank.avif',
  '/public/cache/images/vivod/vodka_casino_vivod_na_sberbank.min.avif',
  '/public/cache/subtitles_vodka_casino/ar.vtt',
  '/public/cache/subtitles_vodka_casino/de.vtt',
  '/public/cache/subtitles_vodka_casino/en.vtt',
  '/public/cache/subtitles_vodka_casino/es.vtt',
  '/public/cache/subtitles_vodka_casino/fr.vtt',
  '/public/cache/subtitles_vodka_casino/hi.vtt',
  '/public/cache/subtitles_vodka_casino/kr.vtt',
  '/public/cache/subtitles_vodka_casino/pt.vtt',
  '/public/cache/subtitles_vodka_casino/ru.vtt',
  '/public/cache/subtitles_vodka_casino/tr.vtt',
  '/public/cache/subtitles_vodka_casino/uk.vtt',
  '/public/cache/subtitles_vodka_casino/zh-CN.vtt',
  '/public/cache/subtitles_vodka_casino_metod/ar.vtt',
  '/public/cache/subtitles_vodka_casino_metod/de.vtt',
  '/public/cache/subtitles_vodka_casino_metod/en.vtt',
  '/public/cache/subtitles_vodka_casino_metod/es.vtt',
  '/public/cache/subtitles_vodka_casino_metod/fr.vtt',
  '/public/cache/subtitles_vodka_casino_metod/hi.vtt',
  '/public/cache/subtitles_vodka_casino_metod/kr.vtt',
  '/public/cache/subtitles_vodka_casino_metod/pt.vtt',
  '/public/cache/subtitles_vodka_casino_metod/ru.vtt',
  '/public/cache/subtitles_vodka_casino_metod/tr.vtt',
  '/public/cache/subtitles_vodka_casino_metod/uk.vtt',
  '/public/cache/subtitles_vodka_casino_metod/zh-CN.vtt'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const request = event.request;
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
      const networkResponse = await fetch(request);

      // ✅ кэшируем только успешные полные ответы (200 OK)
      const url = new URL(request.url);
      if (
        url.origin === self.location.origin &&
        request.method === 'GET' &&
        networkResponse.status === 200
      ) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (error) {
      if (request.mode === 'navigate') {
        return caches.match('/index.html');
      }
      return new Response('', { status: 503, statusText: 'Service Unavailable' });
    }
  })());
});
