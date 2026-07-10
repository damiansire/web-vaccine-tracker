import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { WorldMap, regions, type ISOCode } from "react-svg-worldmap";
import { StatTile } from "@/components/StatTile";
import { isoCodes, lastData, manifest } from "@/data/loader";
import { amberSequential, COLORS } from "@/lib/colors";
import { slugify } from "@/lib/slugify";
import { computeGlobalStats, rankCountries } from "@/lib/stats";
import { buildCountryIdByAlpha2, toAlpha2 } from "@/lib/iso";
import { useFormatters } from "@/lib/useFormatters";

const isoByCountry = new Map(isoCodes.map((entry) => [entry.countryId, entry.isoAlpha3]));
// react-svg-worldmap trae su propio SVG con 175 territorios — no cubre los
// 217 países del dataset (microestados, dependencias). Se filtra contra su
// lista real en vez de asumir que todo alpha-2 válido tiene forma en el mapa.
const MAPPABLE_CODES = new Set(regions.map((region) => region.code));

// context.countryName (que expone react-svg-worldmap en el click) es el
// nombre INTERNO de esa librería, no el countryId de OWID — difieren para
// ~10 países (ej. "Czech Republic" vs "Czechia") y el slug resultante no
// existe en el dataset. countryCode (alpha-2) sí es estable: es la MISMA
// clave con la que se arma mapData, así que reconstruir el countryId real
// desde ahí garantiza que todo click resuelve a un país que existe.
const countryIdByAlpha2 = buildCountryIdByAlpha2(isoCodes);

export function WorldSituation() {
  const { t } = useTranslation("worldSituation");
  const { formatCompact, formatDate, formatNumber, formatPercent } = useFormatters();
  const [, navigate] = useLocation();
  const ranked = useMemo(
    () => rankCountries(lastData, "people_fully_vaccinated_per_hundred"),
    [],
  );

  const mapData = useMemo(
    () =>
      ranked
        .map(({ countryId, value }) => {
          const alpha3 = isoByCountry.get(countryId);
          const alpha2 = alpha3 ? toAlpha2(alpha3) : null;
          return alpha2 && MAPPABLE_CODES.has(alpha2) ? { country: alpha2 as ISOCode, value } : null;
        })
        .filter((entry): entry is { country: ISOCode; value: number } => entry !== null),
    [ranked],
  );

  const top5 = ranked.slice(0, 5);
  const bottom5 = ranked.slice(-5).reverse();
  // Los 4 agregados (KPIs) salen de computeGlobalStats, no de un segundo
  // cálculo inline — antes había dos implementaciones divergiendo (regla
  // d/e), y solo la de acá (no la testeada) corría en producción.
  const stats = computeGlobalStats(lastData);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4 border-b border-border pb-8">
        <span className="tabular w-fit rounded-full border border-hairline px-3 py-1 text-[11px] tracking-widest text-ink-muted uppercase">
          {formatDate(manifest.dateRange.from)} — {formatDate(manifest.dateRange.to)}
        </span>
        <h1 className="font-display max-w-3xl text-4xl leading-tight font-semibold text-balance sm:text-5xl">
          {t("headline")}
        </h1>
        <p className="max-w-2xl text-ink-2">
          {t("description", { count: manifest.countries.length })}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label={t("kpi.countriesWithData")} value={formatNumber(manifest.countries.length)} />
        <StatTile
          label={t("kpi.totalDoses")}
          value={formatCompact(stats.totalDoses)}
          hint={formatNumber(stats.totalDoses)}
        />
        <StatTile
          label={t("kpi.avgCoverage")}
          value={
            stats.avgFullyVaccinatedPct === null
              ? "—"
              : formatPercent(Number(stats.avgFullyVaccinatedPct.toFixed(1)))
          }
          hint={t("kpi.avgCoverageHint")}
        />
        <StatTile
          label={t("kpi.topCountry")}
          value={stats.topCountry ? formatPercent(stats.topCountry.pct) : "—"}
          hint={stats.topCountry?.name}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">{t("mapSection.title")}</h2>
        <p className="text-sm text-ink-muted">{t("mapSection.description")}</p>
        <div className="rounded-lg border border-border bg-surface/40 p-4">
          <WorldMap
            size="responsive"
            data={mapData}
            color={COLORS.amber}
            backgroundColor="transparent"
            borderColor={COLORS.ink}
            tooltipBgColor={COLORS.surface}
            tooltipTextColor={COLORS.paper}
            valueSuffix="%"
            styleFunction={(context) => ({
              fill:
                context.countryValue === undefined
                  ? COLORS.surface
                  : amberSequential(
                      (context.countryValue - context.minValue) /
                        (context.maxValue - context.minValue || 1),
                    ),
              stroke: COLORS.ink,
              strokeWidth: 0.5,
              cursor: context.countryValue === undefined ? "default" : "pointer",
            })}
            onClickFunction={(context) => {
              const countryId = countryIdByAlpha2.get(context.countryCode.toUpperCase());
              if (context.countryValue !== undefined && countryId) {
                navigate(`/pais/${slugify(countryId)}`);
              }
            }}
          />
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <RankPreview title={t("rankPreview.highest")} rows={top5} tone="high" />
        <RankPreview title={t("rankPreview.lowest")} rows={bottom5} tone="low" />
      </section>
    </div>
  );
}

function RankPreview({
  title,
  rows,
  tone,
}: {
  title: string;
  rows: { countryId: string; value: number }[];
  tone: "high" | "low";
}) {
  const { formatPercent } = useFormatters();
  const [, navigate] = useLocation();
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <h3 className="font-display text-sm font-semibold text-ink-2 uppercase">{title}</h3>
      <ul className="flex flex-col divide-y divide-hairline">
        {rows.map((row) => (
          <li key={row.countryId}>
            <button
              type="button"
              onClick={() => navigate(`/pais/${slugify(row.countryId)}`)}
              className="flex w-full items-center justify-between py-2 text-left text-sm hover:text-foreground"
            >
              <span className="text-ink-2">{row.countryId}</span>
              <span
                className={`tabular font-medium ${tone === "low" && row.value < 20 ? "text-rose" : "text-foreground"}`}
              >
                {formatPercent(row.value)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
