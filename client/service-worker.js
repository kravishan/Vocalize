// Define a unique cache name
var CACHE_NAME = 'Vocalize-v1';

// Specify URLs to cache
var urlsToCache = [
  'https://vocalizer.dev/'
];

// Install event listener
self.addEventListener('install', function(event) {
  event.waitUntil(
    // Open the cache and add specified URLs
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
    .then(function() {
      // Once the cache is opened and URLs are added, clean up old caches
      return caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            // Filter out the current cache and delete the rest
            return cacheName !== CACHE_NAME;
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    })
  );
});

// Fetch event listener
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Intercept fetch requests
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Return cached response if found
        }
        // If not in cache, fetch from network
        return fetch(event.request);
      })
  );
});
