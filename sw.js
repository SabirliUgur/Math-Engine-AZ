/**
 * Service Worker for Math-Engine-AZ v2.0.0 ("Modern Split-Workspace UI & Dual-Theme Overhaul")
 * Network-First with Cache Fallback strategy for robust offline capability.
 */

const CACHE_NAME = 'math-engine-az-v2.0.0';

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './style.css',
    './app.js',
    './js/math-core.js',
    './icon-192.png',
    './icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.2.5/math.min.js'
];

// Install: precache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                PRECACHE_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn(`[SW] Precache failed for ${url}:`, err);
                    })
                )
            );
        }).then(() => self.skipWaiting())
    );
});

// Activate: clean up old cache versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Network-First with Cache Fallback for GET requests
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Bypass browser-extension and unsupported schemes
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If response is valid, update the cache
                if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Network failed: fallback to cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // For HTML navigations, fallback to cached index.html
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html') || caches.match('./');
                    }
                    return new Response('Şəbəkə bağlantısı yoxdur (Offline)', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
                    });
                });
            })
    );
});
