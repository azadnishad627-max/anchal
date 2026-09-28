// Service Worker for Anchal Web App 🌹
const CACHE_NAME = 'anchal-cache-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/songs.js',
  './js/player.js',
  './js/butterflies.js',
  './js/app.js',
  './manifest.json',
  './photos/icon-192.png',
  './photos/icon-512.png',
  './photos/anchal_1.jpg',
  './photos/anchal_2.jpg',
  './photos/anchal_3.jpg',
  './photos/anchal_4.jpg',
  './photos/anchal_5.jpg',
  './photos/anchal_6.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Let audio streams pass through directly without cache interference
  if (e.request.url.includes('/songs/') || e.request.url.includes('.mp3')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
