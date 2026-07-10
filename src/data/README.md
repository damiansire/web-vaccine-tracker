# src/data — dataset histórico real (OWID)

Generado desde el CSV público de
[Our World in Data](https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations)
por `scripts/generate-dataset.ts` (`npm run generate:data`). El dominio está
**cerrado** (la pandemia terminó): esto no se fetchea en runtime, se genera
una vez y se versiona junto al código. Re-correr el generador solo tiene
sentido si OWID amplía su histórico o corrige datos retroactivamente.

Última generación real: 217 países. Rango de fechas y fecha de generación
exactos en `manifest.json` → `dateRange`/`generatedAt` — esa es la única
fuente de verdad, no un valor copiado acá (que se desactualiza).

## Licencia del dato

El dataset horneado en este directorio es una redistribución del histórico
de vacunación de [Our World in Data](https://ourworldindata.org/coronavirus/country/),
publicado bajo **Creative Commons BY 4.0**. La licencia del dato es
independiente de la licencia del código de este repo (MIT, ver `LICENSE`):
al reusar estos JSON, se debe seguir citando a OWID como fuente.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `manifest.json` | `{ version, generatedAt, synthetic, source, countries[] }` — lista de países disponibles |
| `iso-codes.json` | `{ countryId, isoAlpha3 }[]` — **alpha-3**, no alpha-2 (distinto del dataset sintético viejo) |
| `last-data.json` | última fila de cada país, para ranking/mapa sin cargar la serie completa |
| `countries/<slug>.json` | serie temporal completa de un país, formato columnar (ver abajo) |
| `sources/<slug>.json` | `{ sources: string[] }` — links de referencia del dato |

`<slug>` sale de `src/lib/slugify.ts` ("United Kingdom" → `united-kingdom") —
mismo algoritmo en el generador y en el loader, o el loader no encuentra el
archivo.

## Formato columnar

```json
{ "countryName": "Argentina", "fields": ["date", "total_vaccinations", ...], "rows": [["2021-01-01", 0, ...], ...] }
```

`{fields, rows}` en vez de un array de objetos: evita repetir las 9 claves en
cada uno de los ~1000 puntos por país (es la mayor parte del peso de un JSON
tabular). `src/data/loader.ts` es el único punto de lectura — no importar
estos JSON directamente desde un componente.

## Campos (`src/data/types.ts` → `FIELDS`)

`date, total_vaccinations, people_vaccinated, people_fully_vaccinated,
total_boosters, daily_vaccinations, daily_vaccinations_per_million,
people_vaccinated_per_hundred, people_fully_vaccinated_per_hundred` — un
subconjunto curado de las columnas de OWID. Agregar una columna nueva (p. ej.
`total_boosters_per_hundred`) es una sola línea en `FIELDS`; el generador la
busca por nombre de columna en el CSV, no por posición.

## Métricas derivadas

`last-data.json` no es solo un recorte de `FIELDS`: también trae
`daysToFully50` (`number | null`), calculado a build-time desde la serie
completa del país (`src/lib/milestones.ts` → `daysToThreshold`) — días entre
el primer dato de la campaña y el día en que ese país llegó a 50% de esquema
completo. `null` si nunca llegó. Es la base de la métrica "velocidad de
vacunación" en Ranking y del hito que muestra CountryDetail. No está en
`FIELDS` porque no es una columna por-fecha de la serie histórica — es un
resumen del snapshot, no graficable como serie temporal (ver
`CHARTABLE_RANK_METRICS` en `src/lib/stats.ts`).

## Manejo de países faltantes

`loadCountry`/`loadCountrySources` en `src/data/loader.ts` nunca lanzan: un
país sin archivo loguea el error y degrada (`null` / `{ sources: [] }`).
`loadCountries` usa `Promise.allSettled`, así que un país roto no tumba a los
demás — el bug del repo anterior (home en blanco por un `Promise.all` sin
`.catch`) no puede repetirse acá.
