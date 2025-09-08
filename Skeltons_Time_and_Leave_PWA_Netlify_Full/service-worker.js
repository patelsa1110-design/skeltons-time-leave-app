self.addEventListener('install', event => {
  event.waitUntil(caches.open('skeltons-static-v1').then(cache => cache.addAll([
    '/', '/index.html', '/styles.css', '/app.js', '/assets/logo.png', '/manifest.webmanifest'
  ])));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
});
