import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isRankMetric, RANK_METRICS, type RankMetric } from "@/lib/stats";
import { cn } from "@/lib/utils";

interface MetricSelectProps<M extends RankMetric> {
  value: M;
  onChange: (value: M) => void;
  triggerClassName?: string;
  /** Qué métricas ofrecer — default RANK_METRICS (Ranking). Compare pasa
   * CHARTABLE_RANK_METRICS: no todas las métricas del ranking se pueden
   * graficar como serie temporal (ej. daysToFully50 es un derivado del
   * snapshot, no una columna por-fecha). */
  metrics?: readonly { value: M; labelKey: string }[];
}

/** Único selector de métrica de la app — Ranking y Compare lo comparten en
 * vez de llevar cada uno su propia copia del mismo <Select> (regla d/e del
 * CLAUDE.md: ya mordió una vez con SelectCountry duplicado). Genérico sobre
 * `M` para que Compare pueda restringir el value/onChange a un subconjunto
 * de RankMetric sin perder type-safety (ver ChartableRankMetric). */
export function MetricSelect<M extends RankMetric = RankMetric>({
  value,
  onChange,
  triggerClassName,
  metrics = RANK_METRICS as unknown as readonly { value: M; labelKey: string }[],
}: MetricSelectProps<M>) {
  const { t } = useTranslation("common");

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (!isRankMetric(v)) return;
        const found = metrics.find((m) => m.value === v);
        if (found) onChange(found.value);
      }}
    >
      <SelectTrigger className={cn("w-72", triggerClassName)}>
        <SelectValue>{(v: M) => t(metrics.find((m) => m.value === v)?.labelKey ?? "")}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {metrics.map((m) => (
          <SelectItem key={m.value} value={m.value}>
            {t(m.labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
