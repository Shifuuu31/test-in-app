// service-worker.js

const CACHE_NAME = 'my-app-cache-v1';
const CACHE_URLS = [
  '/', // your app's home page
  '/index.html', // main HTML file
  '/icon/icon-192x192.png', // your icons
  '/icon/icon-512x512.png', // your icons
  '/images/offline-image.png' // the image to show when offline
];

// Install event - Cache the necessary files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

// Fetch event - Serve files from the cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return cached file if found
      }

      // If the user is offline and the request is for an image, serve the offline image
      if (event.request.url.includes('offline-image.png')) {
        return caches.match('/images/offline-image.png');
      }

      // Otherwise, fetch the request normally
      return fetch(event.request);
    })
  );
});

// Activate event - Remove old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
