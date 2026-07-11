import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

/** Sin backend propio (dataset estático, sin API) todavía no hay a dónde
 * mandar estos valores — loguear a consola es el punto de integración real
 * hasta que exista un colector; `onReport` es el único lugar a tocar cuando
 * eso pase. Ver docs/perf/README.md para el baseline de Lighthouse. */
function onReport(metric: Metric): void {
  console.info(`[web-vitals] ${metric.name}=${metric.value.toFixed(2)} (rating: ${metric.rating})`);
}

export function reportWebVitals(): void {
  onCLS(onReport);
  onINP(onReport);
  onLCP(onReport);
  onFCP(onReport);
  onTTFB(onReport);
}
