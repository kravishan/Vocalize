// Define a unique cache name for the audio version
var AUDIO_CACHE_NAME = 'Vocalize-Audio-v1';

// Specify URLs to cache for the audio version
var audioUrlsToCache = [
  'https://vocalizer.dev/audio/'
];

// Install event listener for the audio version
self.addEventListener('install', function(event) {
  event.waitUntil(
    // Open the cache and add specified audio URLs
    caches.open(AUDIO_CACHE_NAME).then(function(cache) {
      console.log('Opened audio cache');
      return cache.addAll(audioUrlsToCache);
    })
  );
});

// Fetch event listener for the audio version
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Intercept fetch requests for the audio version
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Return cached response if found for audio version
        }
        // If not in cache, fetch from network for audio version
        return fetch(event.request)
          .then(function(response) {
            // Check if the response is valid for audio version
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response to use and cache the original response for audio version
            var responseToCache = response.clone();
            caches.open(AUDIO_CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// Activate event listener for the audio version
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Add a condition to preserve the desired cache(s) for the audio version
          return cacheName.startsWith('Vocalize-Audio') && cacheName !== AUDIO_CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName); // Delete old caches for the audio version
        })
      );
    })
  );
});
