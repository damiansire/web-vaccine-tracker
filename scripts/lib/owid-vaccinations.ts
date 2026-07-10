import { daysToThreshold, FULLY_VACCINATED_MILESTONE_PCT } from "../../src/lib/milestones.ts";
import { slugify } from "../../src/lib/slugify.ts";
import {
  FIELDS,
  type Cell,
  type CountryFile,
  type Field,
  type IsoCodeEntry,
} from "../../src/data/types.ts";
import type { CsvTable } from "./csv.ts";

/** OWID mezcla países reales con agregados (continentes, grupos de ingreso,
 * "World", naciones constituyentes del Reino Unido) bajo el mismo `location`.
 * Los agregados siempre llevan `iso_code` con este prefijo — es la señal que
 * usa la fuente para distinguirlos, no una heurística nuestra. */
const OWID_AGGREGATE_ISO_PREFIX = "OWID_";

export interface TransformResult {
  countries: Map<string, CountryFile>;
  isoCodes: IsoCodeEntry[];
  lastData: Record<string, Cell>[];
  dateRange: { from: string; to: string };
}

export function transformVaccinations(table: CsvTable): TransformResult {
  const locationIdx = requireIndex(table.header, "location");
  const isoIdx = requireIndex(table.header, "iso_code");
  const fieldIdx = Object.fromEntries(
    FIELDS.map((field) => [field, requireIndex(table.header, field)]),
  ) as Record<Field, number>;

  const byCountry = new Map<string, { iso: string; rows: string[][] }>();
  for (const row of table.rows) {
    const iso = row[isoIdx];
    if (!iso || iso.startsWith(OWID_AGGREGATE_ISO_PREFIX)) {
      continue; // continente / grupo de ingreso / "World", no un país
    }
    const location = row[locationIdx];
    if (!location) continue;

    const entry = byCountry.get(location);
    if (entry) {
      entry.rows.push(row);
    } else {
      byCountry.set(location, { iso, rows: [row] });
    }
  }

  const countries = new Map<string, CountryFile>();
  const isoCodes: IsoCodeEntry[] = [];
  const lastData: Record<string, Cell>[] = [];
  const dateIdx = fieldIdx.date;
  let minDate = "9999-99-99";
  let maxDate = "0000-00-00";

  for (const [countryName, { iso, rows }] of byCountry) {
    const columnarRows = rows.map((row) =>
      FIELDS.map((field) => parseCell(row[fieldIdx[field]])),
    );
    countries.set(countryName, { countryName, fields: FIELDS, rows: columnarRows });
    isoCodes.push({ countryId: countryName, isoAlpha3: iso });

    const last = columnarRows[columnarRows.length - 1];
    if (last) {
      const lastRow: Record<string, Cell> = { countryId: countryName };
      FIELDS.forEach((field, i) => (lastRow[field] = last[i] ?? null));
      lastRow.daysToFully50 = daysToThreshold(
        columnarRows,
        FIELDS,
        "people_fully_vaccinated_per_hundred",
        FULLY_VACCINATED_MILESTONE_PCT,
      );
      lastData.push(lastRow);
    }

    for (const row of rows) {
      const date = row[dateIdx];
      if (date && date < minDate) minDate = date;
      if (date && date > maxDate) maxDate = date;
    }
  }

  return { countries, isoCodes, lastData, dateRange: { from: minDate, to: maxDate } };
}

export function sourcesFor(countryName: string): { sources: string[] } {
  return {
    sources: [
      `https://ourworldindata.org/coronavirus/country/${slugify(countryName)}`,
      "https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations",
    ],
  };
}

function requireIndex(header: string[], columnName: string): number {
  const index = header.indexOf(columnName);
  if (index === -1) {
    throw new Error(
      `Columna esperada ausente en el CSV de OWID: "${columnName}". ` +
        `La fuente pudo haber cambiado de esquema — revisar antes de confiar en el output.`,
    );
  }
  return index;
}

function parseCell(raw: string | undefined): Cell {
  if (raw === undefined || raw === "") return null;
  const num = Number(raw);
  return Number.isNaN(num) ? raw : num;
}
