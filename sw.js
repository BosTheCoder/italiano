// Offline: precache the app and every audio clip; serve cache first, refresh shell in the background.
importScripts('./data.js');
const CACHE = 'parla-v1';
const SHELL = ['./', './index.html', './app.js', './data.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const AUDIO = CARDS.flatMap(c => [`./audio/${c.id}.mp3`, `./audio/${c.id}s.mp3`]);
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll([...SHELL, ...AUDIO])).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok && !e.request.url.includes('/audio/')) cache.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
