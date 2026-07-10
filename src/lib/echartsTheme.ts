import type { LineSeriesOption } from "echarts/charts";
import { COLORS } from "@/lib/colors";

/** Config base compartida por TODOS los gráficos ECharts de la app (Compare,
 * CountryDetail) — el tooltip claro por default de ECharts no combina con el
 * tema oscuro; centralizado acá para no repetirlo (y no divergir) en cada
 * gráfico. */
export const baseChartOption = {
  backgroundColor: "transparent",
  textStyle: { color: COLORS.paper, fontFamily: "Inter, sans-serif" },
  tooltip: {
    trigger: "axis" as const,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.ink,
    textStyle: { color: COLORS.paper },
  },
  legend: { textStyle: { color: COLORS.inkMuted }, top: 0 },
};

export const axisTheme = {
  axisLabel: { color: COLORS.inkMuted },
  axisLine: { lineStyle: { color: COLORS.ink } },
  splitLine: { lineStyle: { color: COLORS.ink } },
};

interface TimeSeriesOptionParams {
  legendData: string[];
  series: LineSeriesOption[];
  /** Compare usa 48 (una sola serie de KPIs), CountryDetail 56 (el eje Y de
   * dosis diarias tiene números más largos, necesita más aire). */
  gridLeft?: number;
  /** Charts de cobertura (0-100%) fijan el techo del eje. */
  yAxisMax?: number;
  yAxisFormatter?: string;
  /** "time" (default): eje X de fecha calendario. "value": eje X numérico
   * — usado por Compare en modo "días desde el inicio" (ver
   * toIndexedSeries), donde cada serie ya viene indexada [díaOffset,
   * valor] en vez de [fecha, valor]. */
  xAxisType?: "time" | "value";
  xAxisName?: string;
  /** `false` para charts que se re-renderizan seguido con `setOption`
   * (Evolution: un frame nuevo por tick de la animación) — la animación de
   * "dibujado" propia de ECharts en cada `setOption` no llega a terminar
   * antes del siguiente tick y se ve entrecortada. Default `true`
   * (Compare/CountryDetail solo cambian de opción ante una acción del
   * usuario, ahí la transición de ECharts suma). */
  animation?: boolean;
}

/** Scaffold compartido de un chart de serie temporal: grid + eje de tiempo +
 * eje de valor + leyenda, sobre baseChartOption/axisTheme. Compare y
 * CountryDetail armaban este mismo esqueleto cada uno por su lado — único
 * lugar ahora, así que un cambio de eje/leyenda no hay que hacerlo en dos
 * (ni tres) sitios. */
export function timeSeriesOption({
  legendData,
  series,
  gridLeft = 48,
  yAxisMax,
  yAxisFormatter,
  xAxisType = "time",
  xAxisName,
  animation = true,
}: TimeSeriesOptionParams) {
  return {
    ...baseChartOption,
    animation,
    legend: { ...baseChartOption.legend, data: legendData },
    grid: { left: gridLeft, right: 24, top: 40, bottom: 32 },
    xAxis: {
      type: xAxisType,
      ...axisTheme,
      ...(xAxisName ? { name: xAxisName, nameLocation: "middle" as const, nameGap: 28 } : {}),
    },
    yAxis: {
      type: "value",
      ...axisTheme,
      ...(yAxisMax !== undefined ? { max: yAxisMax } : {}),
      ...(yAxisFormatter
        ? { axisLabel: { ...axisTheme.axisLabel, formatter: yAxisFormatter } }
        : {}),
    },
    series,
  };
}
