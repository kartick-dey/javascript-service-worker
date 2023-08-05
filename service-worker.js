const cacheArr = ['/'];
const CACHE_NAME = 'cache-v11';

// Registration of service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((res) =>
        console.log(`Registered and the scope is ${res.scope}`)
      );
  });
}

// Installation of service worker
self.addEventListener('install', (event) => {
  console.log('Service worker has been installed...');
  //   event.waitUntil(
  //     caches.open(CACHE_NAME).then((cache) => {
  //       console.log('Opened cache');
  //       cache.addAll(cacheArr).then(() => self.skipWaiting());
  //     })
  //   );
});

// Activation of sevice worker

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// First fetch from server and store in cache
self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith(
    fetch(fetchEvent.request)
      .then((res) => {
        const cacheRes = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(fetchEvent.request, cacheRes);
        });
        return res;
      })
      .catch(() => caches.match(fetchEvent.request).then((res) => res))
  );
});
