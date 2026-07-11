const CACHE = 'ccna-zokietech-v1';
const FILES = [
  '.',
  'index.html',
  'manifest.json',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const ct = res.headers.get('content-type') || '';
    if (res && res.status === 200 && (ct.startsWith('text/') || ct.startsWith('application/') || ct.startsWith('image/'))) {
      const c = caches.open(CACHE).then(cache => { cache.put(e.request, res.clone()); return res; });
      return c;
    }
    return res;
  }).catch(() => caches.match('index.html'))));
});
