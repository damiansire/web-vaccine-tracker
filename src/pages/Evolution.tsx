import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CountrySelect } from "@/components/CountrySelect";
import { EChart } from "@/components/EChart";
import { MetricSelect } from "@/components/MetricSelect";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadCountries, manifest } from "@/data/loader";
import { FIELDS, type Cell, type CountryFile } from "@/data/types";
import { COLORS } from "@/lib/colors";
import { buildDailyRange } from "@/lib/dateRange";
import { timeSeriesOption } from "@/lib/echartsTheme";
import { CHARTABLE_RANK_METRICS, RANK_METRICS, type ChartableRankMetric } from "@/lib/stats";
import { sliceSeriesUpTo, toTimeSeries } from "@/lib/timeSeries";
import { useFormatters } from "@/lib/useFormatters";
import { cn } from "@/lib/utils";

const MAX_COUNTRIES = 4;
const SERIES_COLORS = [COLORS.amber, COLORS.teal, COLORS.indigo, COLORS.rose];
const DEFAULT_COUNTRIES = ["Argentina", "Chile"].filter((c) => manifest.countries.includes(c));
const SPEED_OPTIONS = [0.5, 1, 2, 4] as const;
// Avanzar de a varios días por tick (no de a uno) es lo que hace que ~1300
// días de historia se recorran en un tiempo mirable — un tick por día real
// tardaría minutos incluso a velocidad alta.
const DAYS_PER_TICK = 3;
const TICK_MS = 60;

export function Evolution() {
  const { t } = useTranslation(["evolution", "common"]);
  const { formatNumber, formatPercent, formatDate } = useFormatters();
  const [selected, setSelected] = useState<string[]>(DEFAULT_COUNTRIES);
  const [metric, setMetric] = useState<ChartableRankMetric>("people_fully_vaccinated_per_hundred");
  const [countryFiles, setCountryFiles] = useState<CountryFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEED_OPTIONS)[number]>(1);
  const [cursorIndex, setCursorIndex] = useState(0);
  const config = RANK_METRICS.find((m) => m.value === metric)!;

  const dailyRange = useMemo(
    () => buildDailyRange(manifest.dateRange.from, manifest.dateRange.to),
    [],
  );
  const lastIndex = Math.max(dailyRange.length - 1, 0);
  const cursorDate = dailyRange[cursorIndex] ?? manifest.dateRange.to;

  useEffect(() => {
    if (selected.length === 0) {
      setCountryFiles([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadCountries(selected).then((files) => {
      if (!cancelled) {
        setCountryFiles(files);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  // Auto-pausa al llegar al final — sin esto, el interval de abajo seguiría
  // corriendo (aunque clamped) indefinidamente después de terminar la corrida.
  useEffect(() => {
    if (playing && cursorIndex >= lastIndex) setPlaying(false);
  }, [playing, cursorIndex, lastIndex]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCursorIndex((i) => Math.min(i + Math.round(DAYS_PER_TICK * speed), lastIndex));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, speed, lastIndex]);

  function togglePlay() {
    if (!playing && cursorIndex >= lastIndex) setCursorIndex(0);
    setPlaying((p) => !p);
  }

  // Serie completa por país — se recalcula solo si cambian los países o la
  // métrica, NUNCA por tick de la animación (sliceSeriesUpTo sí, es barato:
  // un filter sobre un array ya calculado).
  const fullSeriesByCountry = useMemo(
    () =>
      countryFiles.map((file) => ({
        name: file.countryName,
        full: toTimeSeries(file.rows, FIELDS, metric),
      })),
    [countryFiles, metric],
  );

  // Eje Y fijo sobre la serie COMPLETA (no la recortada al cursor): si
  // escalara con cada frame, el gráfico "temblaría" en vez de crecer con
  // sentido — el punto de la animación es ver la curva subir contra un
  // techo estable.
  const yAxisMax = useMemo(() => {
    if (config.isPercent) return 100;
    const max = fullSeriesByCountry
      .flatMap((s) => s.full.map(([, v]) => (typeof v === "number" ? v : 0)))
      .reduce((m, v) => Math.max(m, v), 0);
    return max > 0 ? max * 1.05 : undefined;
  }, [fullSeriesByCountry, config.isPercent]);

  const option = timeSeriesOption({
    legendData: fullSeriesByCountry.map((s) => s.name),
    animation: false,
    ...(yAxisMax !== undefined ? { yAxisMax } : {}),
    ...(config.isPercent ? { yAxisFormatter: "{value}%" } : {}),
    series: fullSeriesByCountry.map((s, i) => ({
      name: s.name,
      type: "line",
      showSymbol: false,
      lineStyle: { width: 2 },
      color: SERIES_COLORS[i % SERIES_COLORS.length] ?? COLORS.amber,
      data: sliceSeriesUpTo(s.full, cursorDate),
    })),
  });

  function valueAsOfCursor(countryName: string): Cell {
    const series = fullSeriesByCountry.find((s) => s.name === countryName)?.full ?? [];
    const upToCursor = sliceSeriesUpTo(series, cursorDate);
    return upToCursor.length > 0 ? upToCursor[upToCursor.length - 1]![1] : null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold">{t("evolution:title")}</h1>
        <p className="text-ink-2">{t("evolution:description", { max: MAX_COUNTRIES })}</p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <CountrySelect
          multiple
          countries={manifest.countries}
          value={selected}
          onChange={setSelected}
          max={MAX_COUNTRIES}
          className="w-full max-w-sm"
        />
        <MetricSelect
          value={metric}
          onChange={setMetric}
          triggerClassName="w-64"
          metrics={CHARTABLE_RANK_METRICS}
        />
        <div className="flex items-center gap-1 rounded-md border border-hairline p-0.5 text-xs">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
              className={cn(
                "rounded px-2 py-1.5 tabular transition-colors",
                speed === s ? "bg-surface-2 text-foreground" : "text-ink-muted hover:text-foreground",
              )}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {selected.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-ink-muted">
          {t("evolution:emptyState")}
        </p>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? t("evolution:pause") : t("evolution:play")}
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-hairline hover:bg-surface-2"
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={lastIndex}
              value={cursorIndex}
              onChange={(e) => {
                setPlaying(false);
                setCursorIndex(Number(e.target.value));
              }}
              aria-label={t("evolution:scrubberLabel")}
              className="w-full accent-amber"
            />
            <span className="tabular w-24 shrink-0 text-right text-sm text-ink-2">
              {formatDate(cursorDate)}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-surface/40 p-4">
            {loading ? (
              <div className="flex h-[400px] items-center justify-center text-ink-muted">
                {t("common:loading")}
              </div>
            ) : (
              <EChart option={option} style={{ height: 400 }} />
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("evolution:columns.country")}</TableHead>
                  <TableHead className="text-right">
                    {t("evolution:columns.valueAsOf", { metric: t(config.labelKey), date: formatDate(cursorDate) })}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.map((countryId) => {
                  const value = valueAsOfCursor(countryId);
                  return (
                    <TableRow key={countryId}>
                      <TableCell className="font-medium">{countryId}</TableCell>
                      <TableCell className="tabular text-right">
                        {typeof value !== "number"
                          ? "—"
                          : config.isPercent
                            ? formatPercent(value)
                            : formatNumber(value)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
