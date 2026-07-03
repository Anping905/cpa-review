const CACHE = 'cpa-v1';
const URLS = [
  '/cpa-review/',
  '/cpa-review/index.html',
  '/cpa-review/manifest.json',
  '/cpa-review/icon-192.png',
  '/cpa-review/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {if(k!==CACHE) return caches.delete(k)}))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if(e.request.url.includes('/cpa-review/') && e.request.method==='GET'){
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
