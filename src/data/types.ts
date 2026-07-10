/** Contrato del dataset — dueño: la app (src/data/). El generador
 * (scripts/generate-dataset.ts) produce datos que CONFORMAN a esto, no al
 * revés: si necesitás una columna nueva, se agrega acá primero. */

/** Subconjunto curado de columnas de OWID que consume la UI. */
export const FIELDS = [
  "date",
  "total_vaccinations",
  "people_vaccinated",
  "people_fully_vaccinated",
  "total_boosters",
  "daily_vaccinations",
  "daily_vaccinations_per_million",
  "people_vaccinated_per_hundred",
  "people_fully_vaccinated_per_hundred",
] as const;

export type Field = (typeof FIELDS)[number];
export type Cell = string | number | null;

export interface CountryFile {
  countryName: string;
  fields: readonly Field[];
  rows: Cell[][];
}

export interface SourcesFile {
  sources: string[];
}

export interface IsoCodeEntry {
  countryId: string;
  /** ISO-3166-1 alpha-3, tal como lo da OWID (NO alpha-2). */
  isoAlpha3: string;
}

export type LastDataRow = {
  countryId: string;
  /** Días entre el primer dato de la campaña y el día en que el país
   * alcanzó 50% de esquema completo — "velocidad de vacunación". `null` si
   * el país nunca llegó a ese umbral en el dataset. Calculado a build-time
   * (ver scripts/lib/owid-vaccinations.ts) desde la serie completa, no
   * recomputable desde `last-data.json` solo (que es un snapshot). */
  daysToFully50: number | null;
} & Record<Field, Cell>;

export interface Manifest {
  version: number;
  generatedAt: string;
  synthetic: boolean;
  source: string;
  countries: string[];
  /** Rango real de fechas cubierto por el dataset completo (no solo
   * last-data.json) — calculado una vez en la generación, no adivinado en la UI. */
  dateRange: { from: string; to: string };
}
