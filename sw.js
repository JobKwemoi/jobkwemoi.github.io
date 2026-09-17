// ============================================================
// 👑 KIRONG AI — SERVICE WORKER
// ------------------------------------------------------------
// NETWORK-FIRST for the app shell, deliberately — the previous
// version was cache-first, which meant once a phone installed the
// PWA, it kept serving that exact cached HTML/CSS/JS forever, even
// after a fresh deploy changed branding/colors/features. Cache-first
// is invisible-stale-app-forever; network-first tries the real
// server every time and only falls back to cache when actually
// offline, which is what "offline support" should mean here.
//
// API calls (/api/*) are NEVER cached or intercepted — this app is
// live data (chat, memory, agent runs, payments); a cached response
// for any of those would be actively wrong, not just outdated.
//
// Bump CACHE_VERSION whenever the app shell files change so old
// clients drop their stale cache instead of holding onto it.
// ============================================================

const CACHE_VERSION = "kirong-shell-v7-2";
const APP_SHELL = [
  "/",
  "/index.html",
  "/app.js",
  "/style.css",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never intercept POST/PUT/DELETE (payments, chat, uploads, etc.)

  const url = new URL(req.url);

  // API calls and anything cross-origin: always go straight to the
  // network, never served from or written to cache.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  // App shell: network first, so a redeploy is visible immediately
  // for anyone online. Cache is purely the offline fallback.
  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("/index.html")))
  );
});
