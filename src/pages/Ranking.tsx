import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { MetricSelect } from "@/components/MetricSelect";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { lastData } from "@/data/loader";
import { slugify } from "@/lib/slugify";
import { RANK_METRICS, rankCountries, type RankMetric } from "@/lib/stats";
import { useFormatters } from "@/lib/useFormatters";
import { cn } from "@/lib/utils";

const LOW_COVERAGE_THRESHOLD = 20;

export function Ranking() {
  const { t } = useTranslation(["ranking", "common"]);
  const { formatNumber, formatPercent } = useFormatters();
  const [, navigate] = useLocation();
  const [metric, setMetric] = useState<RankMetric>("people_fully_vaccinated_per_hundred");
  const config = RANK_METRICS.find((m) => m.value === metric)!;
  const ranked = useMemo(
    () => rankCountries(lastData, metric, config.ascending ? "asc" : "desc"),
    [metric, config.ascending],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold">{t("ranking:title")}</h1>
        <p className="text-ink-2">{t("ranking:description", { count: ranked.length })}</p>
      </div>

      <MetricSelect value={metric} onChange={setMetric} triggerClassName="w-72" />

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-12 sm:table-cell">{t("ranking:columns.rank")}</TableHead>
              <TableHead>{t("ranking:columns.country")}</TableHead>
              <TableHead className="text-right">{t(config.labelKey)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranked.map((row, index) => {
              const isLow = config.isPercent && row.value < LOW_COVERAGE_THRESHOLD;
              return (
                <TableRow
                  key={row.countryId}
                  className="cursor-pointer"
                  onClick={() => navigate(`/pais/${slugify(row.countryId)}`)}
                >
                  <TableCell className="tabular hidden text-ink-muted sm:table-cell">
                    {index + 1}
                  </TableCell>
                  <TableCell className="max-w-[9rem] truncate font-medium whitespace-nowrap sm:max-w-none">
                    {row.countryId}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "tabular text-right font-medium",
                      isLow ? "text-rose" : "text-foreground",
                    )}
                  >
                    {config.isPercent ? formatPercent(row.value) : formatNumber(row.value)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
