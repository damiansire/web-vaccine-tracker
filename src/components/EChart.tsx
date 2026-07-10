import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { EChartsCoreOption } from "echarts/core";
import { echarts } from "@/lib/echartsCore";

interface EChartProps {
  option: EChartsCoreOption;
  style?: CSSProperties;
}

/** Wrapper propio en vez de `echarts-for-react`: su variante `/lib/core`
 * (necesaria para el import modular de echarts, ver `lib/echartsCore.ts`)
 * tiene un bug de interop con el pre-bundling de Vite en dev — el default
 * export resuelve a `undefined` ahí (el build de producción no lo sufre,
 * pero "anda en build y no en dev" no es aceptable). Esto es ~20 líneas y
 * evita la dependencia frágil. */
export function EChart({ option, style }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return <div ref={containerRef} style={style} />;
}
