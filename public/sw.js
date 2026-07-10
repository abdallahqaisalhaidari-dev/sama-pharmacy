/* Sama Pharmacy — minimal service worker
 * Network-first with cache fallback, enough for PWA installability
 * and basic offline resilience. */
const CACHE = "sama-pharmacy-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  // Never cache API / auth traffic
  if (request.url.includes("/supabase") || request.url.includes("/auth")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && request.url.startsWith(self.location.origin)) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || Response.error())
      )
  );
});
