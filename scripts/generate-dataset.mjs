// Generador del dataset estático modular que reemplaza a la API caída
// (api.thecovidvaccines.com). Es determinista: misma semilla -> mismos archivos,
// así el resultado es reproducible y versionable.
//
// Estructura que emite (ver src/data/README.md):
//   src/data/manifest.json          índice liviano: versión + lista de países
//   src/data/iso-codes.json         [{ countryId, code }]  (code = ISO-3166-1 alpha-2)
//   src/data/last-data.json         snapshot: última fila por país (ranking/mapa)
//   src/data/countries/<slug>.json  serie temporal por país, formato COLUMNAR
//   src/data/sources/<slug>.json    { sources: [url, ...] }
//
// El formato columnar { fields, rows } evita repetir las claves en cada punto
// de la serie (que es la mayor parte del peso de un JSON tabular). El loader
// del front lo rehidrata a array de objetos en O(filas).
//
// Uso:  node scripts/generate-dataset.mjs
//
// NOTA: los valores son una reconstrucción ILUSTRATIVA (curva logística por
// país) para que la app renderice sin la API. Para datos reales, reemplazar la
// semilla SEED por la fuente verdadera (p. ej. Our World in Data) manteniendo
// el mismo esquema.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");

// slug determinista, igual al del loader del front (src/data/loader.js).
const slugify = (name) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Semilla: país, ISO alpha-2 (minúscula, como espera react-svg-worldmap),
// población y % de población totalmente vacunada hacia fin de 2021.
const SEED = [
  ["Argentina", "ar", 45_400_000, 0.62],
  ["Uruguay", "uy", 3_500_000, 0.77],
  ["Chile", "cl", 19_100_000, 0.85],
  ["Brazil", "br", 214_000_000, 0.66],
  ["Mexico", "mx", 126_000_000, 0.55],
  ["United States", "us", 331_000_000, 0.62],
  ["Canada", "ca", 38_000_000, 0.78],
  ["United Kingdom", "gb", 67_000_000, 0.7],
  ["Germany", "de", 83_000_000, 0.71],
  ["France", "fr", 67_000_000, 0.73],
  ["Spain", "es", 47_000_000, 0.8],
  ["Italy", "it", 60_000_000, 0.74],
  ["Israel", "il", 9_200_000, 0.65],
  ["India", "in", 1_393_000_000, 0.44],
  ["China", "cn", 1_412_000_000, 0.85],
  ["Japan", "jp", 125_000_000, 0.78],
  ["South Korea", "kr", 51_700_000, 0.82],
  ["Australia", "au", 25_700_000, 0.73],
];

// Las mismas métricas que consumen las tablas/rankings del front, en orden.
const FIELDS = [
  "date",
  "daily_vaccinations",
  "daily_vaccinations_per_million",
  "people_vaccinated",
  "people_vaccinated_per_hundred",
  "people_fully_vaccinated",
  "people_fully_vaccinated_per_hundred",
  "total_dose_vaccinations",
];

// 12 puntos mensuales de 2021 (mediados de mes).
const MONTHS = Array.from({ length: 12 }, (_, m) => {
  const mm = String(m + 1).padStart(2, "0");
  return `2021-${mm}-15`;
});

// Logística normalizada a [~0, ~1] sobre los 12 meses (centrada en el mes 6).
const logistic = (m) => 1 / (1 + Math.exp(-(m - 6) / 1.6));
const L0 = logistic(0);
const L11 = logistic(11);
const ramp = (m) => (logistic(m) - L0) / (L11 - L0);

const round = (n) => Math.round(n);

// Construye la serie columnar de un país y devuelve también la última fila
// (para el snapshot last-data).
function buildCountry([name, , population, fullyPct]) {
  const finalFully = population * fullyPct;
  const rows = [];
  let prevDoses = 0;

  MONTHS.forEach((date, m) => {
    const fully = finalFully * ramp(m);
    const vaccinated = Math.min(population, fully * 1.25); // parciales + completos
    const totalDoses = vaccinated + fully; // ~1 dosis parciales + 2 completos
    const monthlyDoses = Math.max(0, totalDoses - prevDoses);
    prevDoses = totalDoses;

    const daily = round(monthlyDoses / 30);
    rows.push([
      date,
      daily,
      round((daily / population) * 1_000_000),
      round(vaccinated),
      +((vaccinated / population) * 100).toFixed(2),
      round(fully),
      +((fully / population) * 100).toFixed(2),
      round(totalDoses),
    ]);
  });

  const last = rows[rows.length - 1];
  const lastRow = { countryId: name };
  FIELDS.forEach((f, i) => (lastRow[f] = last[i]));

  return { file: { countryName: name, fields: FIELDS, rows }, lastRow };
}

function sourcesFor(name) {
  const owidSlug = slugify(name);
  return {
    sources: [
      `https://ourworldindata.org/coronavirus/country/${owidSlug}`,
      "https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations",
    ],
  };
}

// --- emisión de archivos ---------------------------------------------------

mkdirSync(join(DATA_DIR, "countries"), { recursive: true });
mkdirSync(join(DATA_DIR, "sources"), { recursive: true });

const write = (relPath, obj) =>
  writeFileSync(join(DATA_DIR, relPath), JSON.stringify(obj) + "\n");

const countries = [];
const isoCodes = [];
const lastData = [];

for (const seed of SEED) {
  const [name, code] = seed;
  const slug = slugify(name);
  const { file, lastRow } = buildCountry(seed);

  write(join("countries", `${slug}.json`), file);
  write(join("sources", `${slug}.json`), sourcesFor(name));

  countries.push(name);
  isoCodes.push({ countryId: name, code });
  lastData.push(lastRow);
}

write("manifest.json", {
  version: 1,
  // Fecha fija para que el output sea determinista (sin Date.now()).
  generatedAt: "2021-12-31",
  synthetic: true,
  note:
    "Reconstrucción ilustrativa para operar sin la API caída. Reemplazar la " +
    "semilla del generador por datos reales manteniendo el esquema.",
  source: "scripts/generate-dataset.mjs",
  countries: countries.sort(),
});
write("iso-codes.json", isoCodes);
write("last-data.json", lastData);

console.log(
  `OK: ${countries.length} países -> countries/*.json, sources/*.json, ` +
    `manifest.json, iso-codes.json, last-data.json`
);
