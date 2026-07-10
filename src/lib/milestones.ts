// Import relativo, no el alias `@/` — este módulo lo consume tanto la app
// (src/) como el generador build-time (scripts/lib/owid-vaccinations.ts),
// y el tsconfig de scripts (tsconfig.node.json) no tiene el alias
// configurado (a propósito: scripts/ no es la app).
import type { Cell, Field } from "../data/types.ts";

const MS_PER_DAY = 86_400_000;

/** Umbral de la métrica "velocidad de vacunación" — 50% de esquema
 * completo. Un solo lugar: el generador (RANK_METRICS/daysToFully50) y
 * CountryDetail (hito mostrado en la página) leen esta misma constante en
 * vez de repetir el número 50 en dos sitios que podrían divergir. */
export const FULLY_VACCINATED_MILESTONE_PCT = 50;

/** Fecha en la que `field` alcanzó por primera vez `thresholdPct` (o más) —
 * asume `rows` en orden cronológico ascendente, como los entrega el
 * generador (mismo orden que trae el CSV de OWID por país). `null` si el
 * país nunca llegó a ese umbral en el dataset. */
export function dateAtThreshold(
  rows: Cell[][],
  fields: readonly Field[],
  field: Field,
  thresholdPct: number,
): string | null {
  const dateIdx = fields.indexOf("date");
  const valueIdx = fields.indexOf(field);
  for (const row of rows) {
    const value = row[valueIdx];
    if (typeof value === "number" && value >= thresholdPct) {
      const date = row[dateIdx];
      return typeof date === "string" ? date : null;
    }
  }
  return null;
}

/** Días calendario entre el primer dato de la serie y la fecha en la que
 * `field` alcanzó `thresholdPct` — "qué tan rápido" llegó un país a un
 * hito, no solo si llegó. Base de la métrica "velocidad de vacunación"
 * (Ranking) y del hito mostrado en CountryDetail. `null` si el país nunca
 * llegó al umbral. */
export function daysToThreshold(
  rows: Cell[][],
  fields: readonly Field[],
  field: Field,
  thresholdPct: number,
): number | null {
  const dateIdx = fields.indexOf("date");
  const firstDate = rows[0]?.[dateIdx];
  const thresholdDate = dateAtThreshold(rows, fields, field, thresholdPct);
  if (typeof firstDate !== "string" || thresholdDate === null) return null;
  return Math.round((Date.parse(thresholdDate) - Date.parse(firstDate)) / MS_PER_DAY);
}
