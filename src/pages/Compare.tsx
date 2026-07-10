import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CountrySelect } from "@/components/CountrySelect";
import { EChart } from "@/components/EChart";
import { MetricSelect } from "@/components/MetricSelect";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { lastData, loadCountries, manifest } from "@/data/loader";
import { FIELDS, type CountryFile } from "@/data/types";
import { COLORS } from "@/lib/colors";
import { timeSeriesOption } from "@/lib/echartsTheme";
import { CHARTABLE_RANK_METRICS, RANK_METRICS, type ChartableRankMetric } from "@/lib/stats";
import { toIndexedSeries, toTimeSeries } from "@/lib/timeSeries";
import { useFormatters } from "@/lib/useFormatters";
import { cn } from "@/lib/utils";

const MAX_COUNTRIES = 4;
const COMPARE_SERIES_COLORS = [COLORS.amber, COLORS.teal, COLORS.indigo, COLORS.rose];
const DEFAULT_COUNTRIES = ["Argentina", "Chile"].filter((c) => manifest.countries.includes(c));
type AlignMode = "calendar" | "days";

export function Compare() {
  const { t } = useTranslation(["compare", "common"]);
  const { formatNumber, formatPercent } = useFormatters();
  const [selected, setSelected] = useState<string[]>(DEFAULT_COUNTRIES);
  const [metric, setMetric] = useState<ChartableRankMetric>("people_fully_vaccinated_per_hundred");
  const [alignMode, setAlignMode] = useState<AlignMode>("calendar");
  const [countryFiles, setCountryFiles] = useState<CountryFile[]>([]);
  const [loading, setLoading] = useState(false);
  const config = RANK_METRICS.find((m) => m.value === metric)!;

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

  const option = timeSeriesOption({
    legendData: countryFiles.map((f) => f.countryName),
    xAxisType: alignMode === "days" ? "value" : "time",
    ...(alignMode === "days" ? { xAxisName: t("compare:alignMode.daysAxisLabel") } : {}),
    series: countryFiles.map((file, i) => ({
      name: file.countryName,
      type: "line",
      showSymbol: false,
      lineStyle: { width: 2 },
      color: COMPARE_SERIES_COLORS[i % COMPARE_SERIES_COLORS.length] ?? COLORS.amber,
      data:
        alignMode === "days"
          ? toIndexedSeries(file.rows, FIELDS, metric)
          : toTimeSeries(file.rows, FIELDS, metric),
    })),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold">{t("compare:title")}</h1>
        <p className="text-ink-2">{t("compare:description", { max: MAX_COUNTRIES })}</p>
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
          {(["calendar", "days"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAlignMode(mode)}
              aria-pressed={alignMode === mode}
              className={cn(
                "rounded px-2 py-1.5 transition-colors",
                alignMode === mode
                  ? "bg-surface-2 text-foreground"
                  : "text-ink-muted hover:text-foreground",
              )}
            >
              {t(`compare:alignMode.${mode}`)}
            </button>
          ))}
        </div>
      </div>

      {selected.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-ink-muted">
          {t("compare:emptyState")}
        </p>
      ) : (
        <>
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
                  <TableHead>{t("compare:columns.country")}</TableHead>
                  <TableHead className="text-right">
                    {t("compare:columns.lastValue", { metric: t(config.labelKey) })}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.map((countryId) => {
                  const row = lastData.find((r) => r.countryId === countryId);
                  const value = row?.[metric];
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
