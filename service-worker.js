// QuickScan Service Worker - v2.139 (relocated to repo ROOT so its scope covers the root app).
// Precaches ONLY the app shell (root index.html + PWA/manifest.json + the icons) and posts per-file
// progress to the page during the first install, so the welcome splash can show a real precache progress
// bar. Nothing else is precached (notably NOT any archived/old app HTML). Same-origin GET requests are
// served cache-first for the precached shell; navigations are network-first (so an updated app is fetched
// when online) with a cached fallback for offline launch.
//
// v2.138: the four vendor libs (Chart.js, PDF.js main + worker, jsPDF) are now INLINED into index.html,
// so they ride along in the precached shell automatically - no separate vendor URLs to precache, and the
// app GRADES fully offline (not just launches). The shell is ~2.5 MB now; the bumped CACHE name forces
// existing installs to fetch the new, larger shell.
//
// NOTE: relative URLs below resolve against this worker's location, so on GitHub Pages at /quickscan/
// they correctly target /quickscan/index.html, /quickscan/PWA/manifest.json, etc. - no hardcoded subpath.

const CACHE = 'quickscan-shell-v2.139';
const ASSETS = [
  './',
  './index.html',
  './PWA/manifest.json',
  './PWA/icon-192.png',
  './PWA/icon-512.png',
  './PWA/apple-touch-icon.png',
];

async function precache() {
  const cache = await caches.open(CACHE);
  const total = ASSETS.length;
  let cached = 0;
  for (const url of ASSETS) {
    try { await cache.add(new Request(url, { cache: 'reload' })); } catch (e) { /* best effort */ }
    cached++;
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    for (const c of clients) c.postMessage({ type: 'precache-progress', cached, total });
  }
}

self.addEventListener('install', event => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));  // drop old shells
    await self.clients.claim();
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    for (const c of clients) c.postMessage({ type: 'precache-done' });
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;                       // let the browser handle non-GET normally
  if (req.mode === 'navigate') {
    // network-first so an online user always gets the latest app; cached shell for offline launch
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }
  // cache-first for the precached shell assets; anything else falls through to network. (As of v2.138
  // the app has no external runtime deps - the vendor libs are inlined into the precached index.html.)
  event.respondWith(caches.match(req).then(c => c || fetch(req)));
});
