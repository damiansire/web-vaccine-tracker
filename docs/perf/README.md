# Medición de performance (Core Web Vitals + Lighthouse)

Este directorio guarda el snapshot inicial de performance del panel, tomado
contra el **build de producción real** (`npm run build && npm run preview`),
nunca contra el dev server (`vite dev` no representa el bundle que llega a
GitHub Pages).

## `lighthouse-baseline.json`

Generado el 2026-07-11 con Chrome DevTools real (no un mock): Lighthouse
`navigation` mode (accessibility/best-practices/SEO/agentic-browsing) +
un Performance trace aparte para Core Web Vitals de lab (CLS). El modo
`navigation` de la herramienta usada excluye la categoría `performance` de
Lighthouse (LCP/TBT/Speed Index viven en el trace, no en ese reporte) — por
eso el JSON separa `lighthouse` (categorías) de `coreWebVitals` (trace).

Cómo se generó (repetible a mano con cualquier Chrome headless o el MCP
`chrome-devtools`):

1. `npm run build && npm run preview -- --port 4173 --strictPort`
2. Lighthouse contra `http://localhost:4173/` en modo `navigation`, desktop.
3. Performance trace (Chrome DevTools Protocol) sobre la misma URL, leer
   `CLS` de las métricas de lab del insight set de la navegación.

## `web-vitals` en runtime

`src/lib/reportWebVitals.ts` usa el paquete `web-vitals` (medición real del
navegador, no simulada) y loguea cada métrica (CLS/INP/LCP/FCP/TTFB) a la
consola en producción. Es un dataset estático sin backend propio — no hay
endpoint de analytics al que mandar estos datos todavía — así que hoy el
punto de integración es el `console.info` (ver el comentario en el archivo).
Cuando exista un colector, `onReport` es el único lugar a tocar.

## CI

`.github/workflows/lighthouse.yml` corre este mismo flujo (build + preview +
Lighthouse) en cada push a `main` y sube el JSON como artifact versionado —
no bloquea el merge (no es parte de `npm run verify`), es observabilidad.

## Cuándo regenerar el baseline

Cuando cambie algo que pueda mover estos números a propósito (code-splitting,
service worker, layout de la home) — no en cada commit. Reemplazar
`lighthouse-baseline.json` a mano siguiendo los mismos 3 pasos de arriba.
