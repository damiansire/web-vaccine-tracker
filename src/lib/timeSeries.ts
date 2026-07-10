import type { Cell, Field } from "@/data/types";

/** Filas columnares -> pares [fecha, valor] para una métrica, descartando
 * huecos (null). Único lugar que hace este transform — Compare y
 * CountryDetail lo llamaban cada uno por su cuenta con la misma lógica
 * (filter+map sobre índices de FIELDS), divergencia viva que señaló el
 * recheck de Fragua (regla d/e). */
export function toTimeSeries(
  rows: Cell[][],
  fields: readonly Field[],
  field: Field,
): [Cell, Cell][] {
  const dateIdx = fields.indexOf("date");
  const valueIdx = fields.indexOf(field);
  return rows
    .filter((row) => typeof row[valueIdx] === "number")
    .map((row) => [row[dateIdx], row[valueIdx]] as [Cell, Cell]);
}

const MS_PER_DAY = 86_400_000;

/** Como toTimeSeries, pero el eje X es "días desde el primer dato de esta
 * serie" en vez de la fecha calendario. Países que arrancaron su campaña
 * en fechas distintas no se pueden comparar de forma justa por fecha
 * calendario — indexar por día-desde-el-inicio deja ver quién avanzó más
 * rápido, independiente de cuándo empezó (ver Compare: modo "Días desde
 * el inicio"). */
export function toIndexedSeries(
  rows: Cell[][],
  fields: readonly Field[],
  field: Field,
): [number, Cell][] {
  const dateIdx = fields.indexOf("date");
  const valueIdx = fields.indexOf(field);
  const firstDate = rows[0]?.[dateIdx];
  if (typeof firstDate !== "string") return [];
  return rows
    .filter((row) => typeof row[valueIdx] === "number")
    .map((row) => {
      const date = row[dateIdx];
      const dayOffset =
        typeof date === "string" ? Math.round((Date.parse(date) - Date.parse(firstDate)) / MS_PER_DAY) : 0;
      return [dayOffset, row[valueIdx]] as [number, Cell];
    });
}

/** Recorta una serie [fecha, valor] a solo los puntos con fecha <=
 * `asOfDate` — el "frame" de la animación de Evolución en un instante
 * dado. Comparación de string funciona porque las fechas del dataset son
 * ISO (`YYYY-MM-DD`), lexicográfico == cronológico. */
export function sliceSeriesUpTo(series: [Cell, Cell][], asOfDate: string): [Cell, Cell][] {
  return series.filter((pair) => typeof pair[0] === "string" && pair[0] <= asOfDate);
}
