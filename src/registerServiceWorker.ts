// Registro separado de main.tsx para que un fallo acá (browser sin soporte,
// registro rechazado) nunca tumbe el boot de la app — es una mejora de
// cache, no una dependencia del render (regla h del CLAUDE.md: los fallos
// se loguean, nunca se tragan en silencio).
export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;

  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl).catch((error: unknown) => {
      console.error("[sw] no se pudo registrar el service worker:", error);
    });
  });
}
