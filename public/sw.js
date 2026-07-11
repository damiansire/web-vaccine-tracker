// Service worker cache-first para los assets con fingerprint de Vite
// (`/assets/*.js`, `/assets/*.css`) — incluye los chunks por país de
// src/data/ (import() dinámico los convierte en chunks JS con hash de
// contenido en el build, ver src/data/loader.ts). El dataset es inmutable
// post-build: si el contenido cambia, el hash del nombre de archivo
// cambia, así que cache-first nunca sirve algo stale bajo el mismo nombre.
// GitHub Pages no soporta headers de cache custom (deploy-pages.yml usa
// actions/deploy-pages@v4 sin runner propio) — este SW es el único lugar
// donde podemos declarar "esto no cambia, no lo vuelvas a pedir".
const CACHE_VERSION = "v1";
const CACHE_NAME = `wvt-static-${CACHE_VERSION}`;
const IMMUTABLE_ASSET_RE = /\/assets\/.+\.(js|css)$/;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!IMMUTABLE_ASSET_RE.test(url.pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      // Solo se cachean respuestas OK — un 404/500 transitorio no debe
      // quedar pegado en cache para siempre (regla h del CLAUDE.md: los
      // fallos de carga son un boundary, no se tragan ni se persisten).
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }),
  );
});
