import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { EChart } from "@/components/EChart";
import { StatTile } from "@/components/StatTile";
import { loadCountry, loadCountrySources, manifest } from "@/data/loader";
import { FIELDS, type CountryFile, type SourcesFile } from "@/data/types";
import { COLORS, SERIES_COLORS } from "@/lib/colors";
import { timeSeriesOption } from "@/lib/echartsTheme";
import { dateAtThreshold, FULLY_VACCINATED_MILESTONE_PCT } from "@/lib/milestones";
import { slugify } from "@/lib/slugify";
import { toTimeSeries } from "@/lib/timeSeries";
import { useFormatters } from "@/lib/useFormatters";

const COUNTRY_BY_SLUG = new Map(manifest.countries.map((name) => [slugify(name), name]));

export function CountryDetail({ params }: { params: { slug: string } }) {
  const { t } = useTranslation(["countryDetail", "common"]);
  const { formatDate, formatNumber, formatPercent } = useFormatters();
  const countryName = COUNTRY_BY_SLUG.get(params.slug);
  const [data, setData] = useState<CountryFile | null>(null);
  const [sources, setSources] = useState<SourcesFile>({ sources: [] });
  // "loading" != "error": un país que está en el manifest pero cuyo JSON no
  // descarga (404, red caída, chunk corrupto) es un fallo, no una carga
  // lenta — antes ambos casos quedaban indistinguibles en "Cargando…" para
  // siempre (regla h del CLAUDE.md: los fallos se muestran, no se tragan).
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!countryName) return;
    let cancelled = false;
    setStatus("loading");
    Promise.all([loadCountry(countryName), loadCountrySources(countryName)]).then(
      ([countryData, countrySources]) => {
        if (cancelled) return;
        if (countryData === null) {
          setStatus("error");
          return;
        }
        setData(countryData);
        setSources(countrySources);
        setStatus("ready");
      },
    );
    return () => {
      cancelled = true;
    };
  }, [countryName, retryKey]);

  if (!countryName) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-ink-2">{t("countryDetail:notFound")}</p>
        <Link href="/ranking" className="text-amber underline underline-offset-2">
          {t("countryDetail:backToRanking")}
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-ink-2">{t("countryDetail:loadError")}</p>
        <button
          type="button"
          onClick={() => setRetryKey((k) => k + 1)}
          className="rounded-md border border-hairline px-3 py-1.5 text-sm hover:bg-surface-2"
        >
          {t("common:errorBoundary.retry")}
        </button>
      </div>
    );
  }

  if (status === "loading" || !data) {
    return <p className="text-ink-muted">{t("common:loading")}</p>;
  }

  const last = data.rows[data.rows.length - 1];
  const at = (field: (typeof FIELDS)[number]) => last?.[FIELDS.indexOf(field)] ?? null;
  const milestoneDate = dateAtThreshold(
    data.rows,
    FIELDS,
    "people_fully_vaccinated_per_hundred",
    FULLY_VACCINATED_MILESTONE_PCT,
  );

  const coverageOption = timeSeriesOption({
    legendData: [t("countryDetail:coverageChart.atLeastOneDose"), t("countryDetail:coverageChart.fullyVaccinated")],
    yAxisMax: 100,
    yAxisFormatter: "{value}%",
    series: [
      {
        name: t("countryDetail:coverageChart.atLeastOneDose"),
        type: "line",
        showSymbol: false,
        color: SERIES_COLORS[0],
        data: toTimeSeries(data.rows, FIELDS, "people_vaccinated_per_hundred"),
      },
      {
        name: t("countryDetail:coverageChart.fullyVaccinated"),
        type: "line",
        showSymbol: false,
        color: SERIES_COLORS[1],
        data: toTimeSeries(data.rows, FIELDS, "people_fully_vaccinated_per_hundred"),
      },
    ],
  });

  const dosesOption = timeSeriesOption({
    legendData: [t("countryDetail:dosesChart.daily")],
    gridLeft: 56,
    series: [
      {
        name: t("countryDetail:dosesChart.daily"),
        type: "line",
        showSymbol: false,
        areaStyle: { color: COLORS.amber, opacity: 0.15 },
        color: COLORS.amber,
        data: toTimeSeries(data.rows, FIELDS, "daily_vaccinations"),
      },
    ],
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link href="/ranking" className="w-fit text-sm text-ink-muted hover:text-foreground">
          {t("countryDetail:backToRanking")}
        </Link>
        <h1 className="font-display text-4xl font-semibold">{countryName}</h1>
        <p className="text-ink-2">
          {t("countryDetail:lastUpdate", { date: formatDate(at("date") as string | null) })}
        </p>
        <p className="text-sm text-teal">
          {milestoneDate
            ? t("countryDetail:milestone.reached", { date: formatDate(milestoneDate) })
            : t("countryDetail:milestone.notReached")}
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label={t("countryDetail:kpi.fullyVaccinated")}
          value={formatPercent(at("people_fully_vaccinated_per_hundred") as number | null)}
        />
        <StatTile
          label={t("countryDetail:kpi.atLeastOneDose")}
          value={formatPercent(at("people_vaccinated_per_hundred") as number | null)}
        />
        <StatTile
          label={t("countryDetail:kpi.totalDoses")}
          value={formatNumber(at("total_vaccinations") as number | null)}
        />
        <StatTile
          label={t("countryDetail:kpi.boosters")}
          value={formatNumber(at("total_boosters") as number | null)}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">{t("countryDetail:coverageChart.title")}</h2>
        <div className="rounded-lg border border-border bg-surface/40 p-4">
          <EChart option={coverageOption} style={{ height: 320 }} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">{t("countryDetail:dosesChart.title")}</h2>
        <div className="rounded-lg border border-border bg-surface/40 p-4">
          <EChart option={dosesOption} style={{ height: 280 }} />
        </div>
      </section>

      {sources.sources.length > 0 ? (
        <section className="flex flex-col gap-2 border-t border-border pt-6">
          <h2 className="font-display text-sm font-semibold text-ink-2 uppercase">
            {t("countryDetail:sources")}
          </h2>
          <ul className="flex flex-col gap-1">
            {sources.sources.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-amber underline decoration-hairline underline-offset-2 hover:text-amber-300"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
