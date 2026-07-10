/** Espejo en JS de los tokens de `src/index.css` (`@theme inline`) — Tailwind
 * resuelve las variables CSS en el DOM, pero ECharts/react-svg-worldmap piden
 * hex plano para pintar canvas/SVG. Si cambia un valor acá, cambia allá
 * también (ver `_audits/DECISIONES.md`: paleta validada con la skill dataviz,
 * no la toques sin re-correr `validate_palette.js`). */
export const COLORS = {
  ink: "#0e1a24",
  surface: "#142530",
  paper: "#ece7d8",
  inkMuted: "#64798a",
  amber: "#d97706",
  amberLight: "#fcd34d",
  amberDark: "#78350f",
  teal: "#0d9488",
  indigo: "#6366f1",
  rose: "#f43f5e",
  statusGood: "#0ca30c",
  statusWarning: "#fab219",
  statusSerious: "#ec835a",
  statusCritical: "#d03b3b",
} as const;

/** Orden categórico fijo (regla de la skill dataviz: nunca reordenar según el
 * valor, siempre en esta secuencia) para las 3 series que sí varían por
 * país/gráfico: dosis / esquema completo / refuerzo. */
export const SERIES_COLORS = [COLORS.amber, COLORS.teal, COLORS.indigo] as const;

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

/** Rampa secuencial de una sola tonalidad (ámbar), ratio 0..1 -> hex. En
 * superficie oscura el extremo bajo se acerca al fondo (recede) y el alto es
 * el paso más claro — el "flip" de ancla que pide la skill dataviz para modo
 * oscuro, no la misma dirección que en modo claro. */
export function amberSequential(ratio: number): string {
  const t = Math.min(1, Math.max(0, ratio));
  const from = hexToRgb(COLORS.amberDark);
  const to = hexToRgb(COLORS.amberLight);
  const mixed: [number, number, number] = [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
  return rgbToHex(mixed);
}
