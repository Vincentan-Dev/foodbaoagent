// FoodBao Admin Service Worker

const CACHE_NAME = 'foodbao-admin-v1';

// Assets to cache initially
const INITIAL_CACHED_RESOURCES = [
  './',
  './index.html',
  './login.html',
  './src/css/materialize.min.css',
  './css/styles.css',
  './js/components/header.js',
  './js/components/footer.js',
  './js/services/authService.js',
  './js/app.js',
  './img/FBLogo.jpg',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js'
];

// Install event - cache initial resources
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  
  // Wait until caching is complete before becoming active
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching initial resources');
        return cache.addAll(INITIAL_CACHED_RESOURCES);
      })
      .catch(err => console.error('[ServiceWorker] Cache error:', err))
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  // Immediately claim clients to control page on first load
  return self.clients.claim();
});

// Fetch event - respond with cached resources when available
self.addEventListener('fetch', event => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith('http')) {
    return;
  }
  
  // Skip API requests (these shouldn't be cached)
  if (event.request.url.includes('/api/') ||
      event.request.url.includes('/ords/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            // Cache the fetched resource for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(error => {
            console.log('[ServiceWorker] Fetch failed:', error);
            // You could return a custom offline page here
          });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}