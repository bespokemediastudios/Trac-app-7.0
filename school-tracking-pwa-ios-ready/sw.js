
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('bus-tracker-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'app.js',
        'style.css',
        'manifest.json',
        'chime.mp3'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
