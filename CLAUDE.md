# CLAUDE.md — web-vaccine-tracker

Panel histórico de vacunación COVID-19. El dominio está **cerrado** (la pandemia
terminó): no hay API en vivo, el dataset es el histórico completo de
[Our World in Data](https://ourworldindata.org/coronavirus/country/) horneado a
build-time en `src/data/` (formato columnar `{fields, rows}`, ver ese directorio
cuando exista). Arquetipo: **app de dataviz**, no librería — no aplican reglas de
`exports` map / tree-shaking / publicación npm.

## Estándar nivel mundial

Construido con `/fragua nuevo vite-react-ts` sobre el corpus de
`~/.claude/tools/_audit-tools/refs/`. Todo código nuevo se escribe CONTRA esto,
no se audita después.

### Piso Craft (regla de Intención Clara — `refs/architecture/fellow-standard.md`)
- **a. Nombres de dominio, no de mecanismo** — `daily_vaccinations`, no `data`/`item`.
- **b. Comentarios explican el PORQUÉ, nunca el QUÉ.**
- **c. La firma pública se entiende sin leer el cuerpo.**
- **d/e. Un cambio de regla se edita en UN lugar.** Ya nos mordió una vez (ver
  `git log` — `SelectCountry` duplicado en dos carpetas del repo viejo, un fix
  aplicado a una copia y no a la otra). Si aparece una segunda variante de un
  componente, extraer un `shared/` parametrizable antes de que diverjan.
- **f/g. Estado inmutable, consistente ante excepción.** El dataset es estático e
  inmutable en runtime — cualquier `useState`/derivado debe tratarlo como
  read-only; nada de mutar los JSON importados.
- **h. Fallos de carga de datos se loguean, nunca se tragan.** Un país sin archivo
  (`import()` que rechaza) es un boundary — no un `.catch(() => [])` silencioso
  sin traza. El bug de pantalla-en-blanco del repo anterior (home rota por
  `Promise.all` sin `.catch`) fue exactamente esto.
- **i. Toda carga async tiene manejo de fallo explícito** — usar `Promise.allSettled`
  cuando un país faltante no debe tumbar el batch completo.
- **j. N/A** (no hay auth/permisos en este repo — dataset público estático).

### Piso Legibilidad en frío (k–m)
- **k. El README lidera con una captura/GIF real** del panel, no solo texto —
  es un artefacto visual, la descripción sola no cuenta como prueba.
- **l. N/A por ahora** — no hay claim de perf/robustez que probar hasta que exista
  el pipeline de datos real; cuando se agregue el fetch/build de OWID, documentar
  con qué se validó (conteo de filas, rango de fechas, países cubiertos).
- **m. Framing honesto**: el README debe decir explícitamente que los datos son
  históricos y fijos (no un tracker en vivo) — no reusar lenguaje de "en tiempo
  real" heredado de la versión COVID-era.

### Reglas del stack (citadas del corpus)
- **tsconfig estricto** (`strict` + `noUncheckedIndexedAccess` +
  `exactOptionalPropertyTypes` + `forceConsistentCasingInFileNames`) — ya en
  `tsconfig.app.json`. Fuente: `refs/react/from-radix-primitives.md`,
  `refs/ts-libs/from-sindresorhus-type-fest.md`. `noUncheckedIndexedAccess` es el
  que más importa acá: el dataset columnar (`rows[i]`) es exactamente el patrón
  que rompe sin ese flag.
- **`useControlled`-style para cualquier selector controlado/no-controlado**
  (país seleccionado, filtros) — un solo hook, `isControlled` fijado en el primer
  render, nunca a mano por componente. Fuente: `refs/react/from-mui-material-ui.md`.
- **`forwardRef` en toda primitiva reusable** que envuelva un elemento DOM.
  Fuente: `refs/react/from-radix-primitives.md`.
- **CI bloqueante, sin `continue-on-error`**: `npm run verify` (lint + test +
  build, `build` ya incluye `tsc -b`) en cada push/PR a `main`
  (`.github/workflows/ci.yml`), un solo comando — no tres pasos que puedan
  divergir entre local y CI.
- **`npm run verify` en verde antes de cada commit** — es literalmente el
  mismo comando que corre CI, no una aproximación.

### UI
Tailwind v4 (CSS-first, sin `tailwind.config.js`) + shadcn/ui (`components.json`,
estilo `base-nova` sobre `@base-ui/react`). Un solo sistema de estilos — el repo
anterior tenía CUATRO (MUI v4 + Bootstrap + styled-components + Tailwind) a la
vez; no reintroducir una segunda librería de componentes.

`npx shadcn add <componente>` funciona, pero en Windows escribe en un
directorio literal `@/` en vez de resolver el alias — mover el archivo a
mano a `src/components/ui/` después. `npx shadcn init` está roto en este
entorno (mismo bug, sin workaround); la base ya está armada a mano
(`components.json` + `src/lib/utils.ts` + variables de tema en `index.css`).

### Charts
`echarts/core` modular (solo `LineChart` + los componentes que se usan, ver
`src/lib/echartsCore.ts`) para no pagar los ~20 tipos de gráfico que esta app
no usa. Se consume vía `src/components/EChart.tsx` (wrapper propio) — **no
usar el paquete `echarts-for-react`**: su variante `/lib/core` tiene un bug de
interop con el pre-bundling de Vite en dev (default export `undefined` ahí,
aunque `npm run build` compila bien). Ver `_audits/DECISIONES.md`.
Todo gráfico de serie temporal usa `xAxis: {type:'time'}` con cada serie
llevando sus propios pares `[fecha, valor]` — nunca un eje de categorías
compartido por posición (ese fue el bug de alineación del repo anterior
cuando dos países tenían series de longitud distinta).

### Datos
El dataset real (reemplazo de `src/data/` sintético del repo anterior) se genera
a build-time desde el CSV de OWID
(`owid/covid-19-data/public/data/vaccinations/vaccinations.csv`), nunca se
fetchea en runtime — el dominio está cerrado, no hace falta un backend ni una
API. Mantener el contrato columnar `{fields, rows}` documentado en
`src/data/README.md` cuando se cree.

### i18n
`react-i18next` + `i18next-resources-to-backend` (lazy-load de namespaces vía
`import()`, ver `src/i18n/config.ts`) — elegido por adopción real verificada con
`/deep-research` (ver `_audits/DECISIONES.md`). Español sin prefijo (`/ranking`,
default) / inglés bajo `/en` (`/en/ranking`) vía el prop `base` de wouter — **no
tocar la lógica de rutas de las páginas**, wouter prefija automáticamente todo
`<Link>`/`navigate()` con el `base` del Router.

- **Namespaces por página** (`src/i18n/locales/{es,en}/*.json`): `common`
  (navbar/footer/errores/selector de país/métricas compartidas), `worldSituation`,
  `ranking`, `compare`, `countryDetail`. Métricas compartidas entre Ranking y
  Compare viven en `common.metrics.*`, no duplicadas.
- **`useSuspense: false`** (no `true`): con Suspense, cada test que renderiza una
  página sin envolverla en `<Suspense>` revienta con "suspended without a
  boundary" — sin Suspense, `t()` devuelve la key mientras carga (ventana
  imperceptible, JSON chicos) y re-renderiza cuando el namespace llega.
- **Formateo de números/fechas por locale: NO uses el sistema de formatting de
  i18next** (`{{val, number}}`) — investigado y descartado: no es automático de
  verdad (requiere registrar formatters a mano por key). En su lugar,
  `src/lib/format.ts` toma `lang` como parámetro y `src/lib/useFormatters.ts` lo
  ata a `i18n.language` — usar ese hook en vez de importar `format.ts` directo.
- **Nombres de país sin traducir** (decisión deliberada, ver DECISIONES.md): OWID
  da los nombres en inglés y así se muestran en ambos idiomas — traducir 217
  nombres de país es un problema aparte, no entra en el alcance de esta etapa.
