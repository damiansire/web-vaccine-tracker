# Dataset estático modular

Reemplazo de la API `api.thecovidvaccines.com` (caída). El front consume estos
JSON en vez de la red. Está pensado para **alta performance** y **lazy load
real**: cada país es un archivo aparte y se descarga solo cuando se lo necesita.

## Por qué es rápido

- **Modular, no monolítico.** En lugar de un blob único, hay un JSON por país
  (`countries/<slug>.json`, `sources/<slug>.json`). Con `import()` dinámico en
  `loader.js`, webpack los emite como _chunks_ separados: la pantalla de un país
  descarga solo ese país. Eso es lazy load real (code splitting), no diferir el
  render de un dato ya bajado.
- **Series en formato columnar.** Cada serie temporal se guarda como
  `{ fields, rows }` en vez de un array de objetos. Las claves
  (`date`, `daily_vaccinations`, …) aparecen **una sola vez** y no en cada
  punto, que es lo que más pesa en un JSON tabular. `loader.js` lo rehidrata a
  la forma `{ date, ... }` que esperan las tablas, en O(filas).
- **Cache de promesas.** Cada recurso se baja una sola vez por sesión
  (`once()` en `loader.js`).

## Estructura

| Archivo                     | Forma                                              | Lo usa                          |
| --------------------------- | -------------------------------------------------- | ------------------------------- |
| `manifest.json`             | `{ version, generatedAt, countries: string[], … }` | lista de países disponibles     |
| `iso-codes.json`            | `[{ countryId, code }]` (code = ISO alpha-2)        | mapa mundial                    |
| `last-data.json`            | `[{ countryId, date, ...métricas }]` (1 fila/país) | rankings y coloreo del mapa     |
| `countries/<slug>.json`     | `{ countryName, fields, rows }` (columnar)          | tabla y gráficos de un país     |
| `sources/<slug>.json`       | `{ sources: string[] }`                            | pantalla de fuentes             |

Las métricas en cada punto/fila son:
`daily_vaccinations`, `daily_vaccinations_per_million`, `people_vaccinated`,
`people_vaccinated_per_hundred`, `people_fully_vaccinated`,
`people_fully_vaccinated_per_hundred`, `total_dose_vaccinations`.

El `slug` se deriva del nombre con `slugify()` (en `loader.js` y en el
generador): `"United States" → "united-states"`.

## Regenerar

```bash
node scripts/generate-dataset.mjs
```

El generador es **determinista** (sin `Date.now()`): misma semilla → mismos
archivos.

> ⚠️ Los valores actuales son una **reconstrucción ilustrativa** (curva
> logística por país) para que la app funcione sin la API. Para datos reales,
> reemplazar el array `SEED` de `scripts/generate-dataset.mjs` por la fuente
> verdadera (p. ej. Our World in Data) manteniendo el mismo esquema.

## Volver a la API

El dataset estático es el _default_. Si la API vuelve, basta con setear:

```
REACT_APP_DATA_SOURCE=api
```

(y `REACT_APP_VACCINATION_API_ENDPOINT`). Los adapters en `src/adapters/`
vuelven a usar `fetch` sin tocar componentes.
