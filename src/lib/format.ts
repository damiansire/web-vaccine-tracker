import type { Lang } from "@/i18n/lang";

const LOCALE_BY_LANG: Record<Lang, string> = { es: "es-AR", en: "en-US" };

// Cacheados por locale: se llaman en loops de render (217 filas en Ranking)
// y construir un Intl.NumberFormat por celda sería un costo real.
const numberFormatters = new Map<string, Intl.NumberFormat>();
const compactFormatters = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(locale: string): Intl.NumberFormat {
  const cached = numberFormatters.get(locale);
  if (cached) return cached;
  const formatter = new Intl.NumberFormat(locale);
  numberFormatters.set(locale, formatter);
  return formatter;
}

function getCompactFormatter(locale: string): Intl.NumberFormat {
  const cached = compactFormatters.get(locale);
  if (cached) return cached;
  // compactDisplay "long" (no "short"): en es-AR, "short" da símbolos raros a
  // partir de mil millones ("12,5 mil M"), sin abreviatura corta estándar
  // para "billion" en español ("B" es ambiguo — en castellano billón = 10^12).
  const formatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "long",
    maximumFractionDigits: 1,
  });
  compactFormatters.set(locale, formatter);
  return formatter;
}

// Formato fijo por idioma en vez de Intl.DateTimeFormat: distintos
// entornos/versiones de ICU devuelven "15 de mar de 2021" vs "15 mar 2021"
// para el mismo locale — acá el formato es parte del contrato de la tabla,
// no accesorio.
const MONTHS: Record<Lang, readonly string[]> = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/** `null`/`undefined` se muestran como guion — nunca "NaN" ni "undefined". */
export function formatNumber(value: number | null | undefined, lang: Lang = "es"): string {
  if (value === null || value === undefined) return "—";
  return getNumberFormatter(LOCALE_BY_LANG[lang]).format(value);
}

/** Números grandes compactados: 1234567 -> "1,2 millones". Para KPIs, no para
 * tablas (ahí el valor exacto importa más que el espacio). */
export function formatCompact(value: number | null | undefined, lang: Lang = "es"): string {
  if (value === null || value === undefined) return "—";
  return getCompactFormatter(LOCALE_BY_LANG[lang]).format(value);
}

export function formatPercent(value: number | null | undefined, lang: Lang = "es"): string {
  if (value === null || value === undefined) return "—";
  return `${getNumberFormatter(LOCALE_BY_LANG[lang]).format(value)}%`;
}

/** "2021-03-15" (formato OWID) -> "15 mar 2021" (es) / "Mar 15, 2021" (en).
 * Evita el corrimiento de timezone de `new Date("2021-03-15")` (se
 * interpretaría en UTC medianoche y podría mostrar el día anterior en huso
 * horario negativo) parseando a mano. */
export function formatDate(isoDate: string | null | undefined, lang: Lang = "es"): string {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-").map(Number);
  const monthName = month ? MONTHS[lang][month - 1] : undefined;
  if (!year || !day || !monthName) return isoDate;
  return lang === "en" ? `${monthName} ${day}, ${year}` : `${day} ${monthName} ${year}`;
}
