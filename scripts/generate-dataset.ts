// Genera src/data/ desde el histórico REAL de OWID (dominio cerrado: la
// pandemia terminó, el dataset ya no cambia en runtime). Reemplaza al viejo
// generador sintético (curva logística inventada) que tapaba la caída de
// api.thecovidvaccines.com.
//
// Uso: node scripts/generate-dataset.ts
//
// Salida (ver src/data/README.md para el contrato completo):
//   src/data/manifest.json          versión + lista de países + fecha de fetch
//   src/data/iso-codes.json         [{ countryId, isoAlpha3 }]
//   src/data/last-data.json         snapshot: última fila por país
//   src/data/countries/<slug>.json  serie temporal por país, columnar {fields, rows}
//   src/data/sources/<slug>.json    { sources: [url, ...] }

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "../src/lib/slugify.ts";
import { parseCsv } from "./lib/csv.ts";
import { sourcesFor, transformVaccinations } from "./lib/owid-vaccinations.ts";

const OWID_VACCINATIONS_CSV_URL =
  "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";

// El único fetch del repo, corrido a mano por quien regenera el dataset —
// sin deadline, un cuelgue de red (no un 4xx/5xx, un cuelgue real) deja el
// proceso esperando para siempre en vez de fallar ruidoso.
const FETCH_TIMEOUT_MS = 30_000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");

async function fetchOwidCsv(): Promise<string> {
  console.log(`Descargando ${OWID_VACCINATIONS_CSV_URL} ...`);
  const response = await fetch(OWID_VACCINATIONS_CSV_URL, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(
      `OWID respondió ${response.status} ${response.statusText} — no se generó nada.`,
    );
  }
  return response.text();
}

async function main() {
  const csvText = await fetchOwidCsv();
  const table = parseCsv(csvText);
  const { countries, isoCodes, lastData, dateRange } = transformVaccinations(table);

  if (countries.size === 0) {
    throw new Error(
      "0 países tras el filtro — probablemente OWID cambió el esquema del CSV. Abortado sin escribir nada.",
    );
  }

  mkdirSync(join(DATA_DIR, "countries"), { recursive: true });
  mkdirSync(join(DATA_DIR, "sources"), { recursive: true });

  const write = (relPath: string, data: unknown) =>
    writeFileSync(join(DATA_DIR, relPath), JSON.stringify(data) + "\n");

  const countryNames: string[] = [];
  for (const [countryName, file] of countries) {
    const slug = slugify(countryName);
    write(join("countries", `${slug}.json`), file);
    write(join("sources", `${slug}.json`), sourcesFor(countryName));
    countryNames.push(countryName);
  }
  countryNames.sort((a, b) => a.localeCompare(b));

  write("manifest.json", {
    version: 1,
    generatedAt: new Date().toISOString().slice(0, 10),
    synthetic: false,
    source: OWID_VACCINATIONS_CSV_URL,
    countries: countryNames,
    dateRange,
  });
  write("iso-codes.json", isoCodes);
  write("last-data.json", lastData);

  console.log(
    `OK: ${countryNames.length} países -> countries/*.json, sources/*.json, ` +
      `manifest.json, iso-codes.json, last-data.json`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
