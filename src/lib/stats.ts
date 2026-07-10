import type { LastDataRow } from "@/data/types";

export interface GlobalStats {
  countryCount: number;
  /** Promedio simple entre países con dato — NO ponderado por población: es
   * "el país promedio", no "la persona promedio del planeta" (para eso
   * haría falta población por país, que no está en este dataset). */
  avgFullyVaccinatedPct: number | null;
  topCountry: { name: string; pct: number } | null;
  totalDoses: number;
}

export function computeGlobalStats(lastData: LastDataRow[]): GlobalStats {
  const withPct = lastData.filter(
    (row): row is LastDataRow & { people_fully_vaccinated_per_hundred: number } =>
      typeof row.people_fully_vaccinated_per_hundred === "number",
  );

  const avgFullyVaccinatedPct =
    withPct.length === 0
      ? null
      : withPct.reduce((sum, row) => sum + row.people_fully_vaccinated_per_hundred, 0) /
        withPct.length;

  const top = withPct.reduce<(typeof withPct)[number] | null>((best, row) => {
    if (!best || row.people_fully_vaccinated_per_hundred > best.people_fully_vaccinated_per_hundred) {
      return row;
    }
    return best;
  }, null);

  const totalDoses = lastData.reduce(
    (sum, row) => sum + (typeof row.total_vaccinations === "number" ? row.total_vaccinations : 0),
    0,
  );

  return {
    countryCount: lastData.length,
    avgFullyVaccinatedPct,
    topCountry: top ? { name: top.countryId, pct: top.people_fully_vaccinated_per_hundred } : null,
    totalDoses,
  };
}

export type RankMetric = Extract<
  keyof LastDataRow,
  | "people_vaccinated_per_hundred"
  | "people_fully_vaccinated_per_hundred"
  | "total_vaccinations"
  | "total_boosters"
  | "daysToFully50"
>;

/** El subconjunto de RankMetric que además es una columna real de la serie
 * histórica por país (ver Field en data/types.ts) — lo que Compare puede
 * graficar. */
export type ChartableRankMetric = Exclude<RankMetric, "daysToFully50">;

interface RankMetricConfig {
  value: RankMetric;
  labelKey: string;
  isPercent: boolean;
  /** Para la mayoría de las métricas "más es primero" (cobertura, dosis) —
   * para `daysToFully50` es al revés, el país MÁS RÁPIDO (menos días) va
   * primero. */
  ascending?: boolean;
  /** `false` para métricas derivadas del snapshot (`daysToFully50`) que NO
   * existen como columna por-fecha en la serie histórica de un país — no
   * se pueden graficar en Compare (que arma un gráfico de líneas
   * fecha→valor), solo tienen sentido en el ranking del snapshot. */
  isTimeSeriesField?: boolean;
}

/** `labelKey` en vez de texto fijo: "common:metrics.xxx" — mismas etiquetas
 * las usan Ranking y Compare, viven en el namespace `common` para no
 * duplicarlas en dos JSON. */
export const RANK_METRICS: RankMetricConfig[] = [
  {
    value: "people_fully_vaccinated_per_hundred",
    labelKey: "common:metrics.peopleFullyVaccinatedPerHundred",
    isPercent: true,
  },
  {
    value: "people_vaccinated_per_hundred",
    labelKey: "common:metrics.peopleVaccinatedPerHundred",
    isPercent: true,
  },
  {
    value: "total_vaccinations",
    labelKey: "common:metrics.totalVaccinations",
    isPercent: false,
  },
  {
    value: "total_boosters",
    labelKey: "common:metrics.totalBoosters",
    isPercent: false,
  },
  {
    value: "daysToFully50",
    labelKey: "common:metrics.daysToFully50",
    isPercent: false,
    ascending: true,
    isTimeSeriesField: false,
  },
];

/** Subconjunto de RANK_METRICS que Compare puede graficar como serie
 * temporal — excluye métricas derivadas del snapshot como `daysToFully50`.
 * Type predicate (no un `.filter` sin tipar) para que `value` quede
 * angosto a `ChartableRankMetric`, no al `RankMetric` completo — si no,
 * `<MetricSelect metrics={CHARTABLE_RANK_METRICS}>` no podría inferir un
 * `onChange` más angosto que `RankMetric` en Compare. */
export const CHARTABLE_RANK_METRICS: (RankMetricConfig & { value: ChartableRankMetric })[] =
  RANK_METRICS.filter(
    (m): m is RankMetricConfig & { value: ChartableRankMetric } => m.isTimeSeriesField !== false,
  );

/** Type guard para el `string` crudo que entrega `onValueChange` de un
 * `<Select>` (base-ui) — sin esto, castear directo a `RankMetric` confía en
 * que el Select nunca emita un valor fuera de sus propios `SelectItem`. */
export function isRankMetric(value: string | null): value is RankMetric {
  return value !== null && RANK_METRICS.some((m) => m.value === value);
}

export interface RankedRow {
  countryId: string;
  value: number;
}

/** Ordena países por una métrica, descartando los que no tienen dato para
 * ella (no los muestra como "0" — un país sin dato de refuerzos no es lo
 * mismo que un país con cero refuerzos). `direction` default "desc" (más es
 * primero); "asc" para métricas donde MENOS es mejor (ej. días hasta 50%
 * de cobertura — el país más rápido va primero). */
export function rankCountries(
  lastData: LastDataRow[],
  metric: RankMetric,
  direction: "asc" | "desc" = "desc",
): RankedRow[] {
  return lastData
    .filter((row): row is LastDataRow & Record<RankMetric, number> => typeof row[metric] === "number")
    .map((row) => ({ countryId: row.countryId, value: row[metric] }))
    .sort((a, b) => (direction === "desc" ? b.value - a.value : a.value - b.value));
}
