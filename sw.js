// Offline: precache the app and every audio clip; serve cache first, refresh shell in the background.
importScripts('./data.js');
const CACHE = 'parla-v6', AUDIO_CACHE = 'parla-audio-v1';   // audio lives in its own cache so app updates don't re-download 5 MB
const SHELL = ['./', './index.html', './app.js', './data.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './fonts/baloo2-latin.woff2'];
const AUDIO = CARDS.flatMap(c => [`./audio/${c.id}.mp3`, `./audio/${c.id}s.mp3`]);
self.addEventListener('install', e => e.waitUntil(Promise.all([caches.open(CACHE).then(c => c.addAll(SHELL)), caches.open(AUDIO_CACHE).then(async c => { const have = new Set((await c.keys()).map(r => new URL(r.url).pathname)); return c.addAll(AUDIO.filter(a => !have.has(new URL(a, self.registration.scope).pathname))); })]).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== AUDIO_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await caches.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok && !e.request.url.includes('/audio/')) cache.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
