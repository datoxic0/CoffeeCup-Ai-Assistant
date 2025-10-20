const CACHE_VERSION = 'v1.0.2';
const STATIC_CACHE = `app-static-${CACHE_VERSION}`;
const ASSETS = [
    '/',
    '/assistant.html',
    '/style.css',
    '/script.js',
    '/server.js',
    '/loading.svg',
    '/coffee-cup-integration-example.html',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js',
    'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/highlight.min.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(ASSETS))
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(key => key.startsWith('app-static-') && key !== STATIC_CACHE)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);

    if (ASSETS.some(assetPath => url.pathname.endsWith(assetPath)) || /cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.gstatic\.com|fonts\.googleapis\.com/.test(url.host)) {
        e.respondWith(
            caches.match(e.request).then(cachedResponse => {
                const fetchPromise = fetch(e.request).then(networkResponse => {
                    const responseToCache = networkResponse.clone();
                    caches.open(STATIC_CACHE).then(cache => {
                        cache.put(e.request, responseToCache);
                    });
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            })
        );
    }
});