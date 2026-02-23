// Service Worker for 2026 Tokyo Travel Guide
const CACHE_NAME = 'tokyo2026-v1';
const CACHE_FILES = ["./", "index.html", "style.css", "manifest.json", "images/dome-09.jpg", "images/toridaishi-04.jpg", "images/immigration-02.jpg", "images/rokkasen-reservation.png", "images/immigration-03.jpg", "images/toridaishi-05.jpg", "images/dome-08.jpg", "images/toridaishi-tabelog.png", "images/toridaishi-07.jpg", "images/immigration-01.jpg", "images/toridaishi-06.jpg", "images/toridaishi-02.jpg", "images/.DS_Store", "images/immigration-04.jpg", "images/immigration-05.jpg", "images/toridaishi-03.jpg", "images/toridaishi-01.jpg", "images/immigration-07.jpg", "images/immigration-06.jpg", "images/kurogi-tabelog.png", "images/pelican-tabelog.png", "images/保險條款下載.pdf", "images/lapin-tabelog.png", "images/dome-01.jpg", "images/dome-03.jpg", "images/immigration-08.jpg", "images/dome-02.jpg", "images/kamotonegi-tabelog.png", "images/dome-06.jpg", "images/ara-tabelog.png", "images/dome-07.jpg", "images/dome-05.jpg", "images/toriton-tabelog.png", "images/dome-04.jpg"];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('index.html');
        }
      });
    })
  );
});
