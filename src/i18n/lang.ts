/** Español sin prefijo (`/ranking`) = default, no rompe URLs existentes.
 * Inglés con prefijo `/en` (`/en/ranking`). Wouter prefija automáticamente
 * `<Link>`/`navigate()` con el `base` del Router — el resto del código de
 * rutas no necesita saber que existen dos idiomas. */
export const SUPPORTED_LANGS = ["es", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "es";

export function getLangFromPath(pathname: string): Lang {
  const first = pathname.split("/")[1];
  return first === "en" ? "en" : DEFAULT_LANG;
}

/** Type guard para `i18n.language` (string en runtime — puede ser
 * cualquier locale del navegador, no solo `es`/`en`). Único lugar: antes
 * había dos `as Lang` sin guard duplicados (LanguageSwitcher.tsx,
 * useFormatters.ts) — regla d/e del CLAUDE.md del repo. */
export function isLang(value: string): value is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

/** Base real del deploy (Vite `base`, ej. `/web-vaccine-tracker` en GitHub
 * Pages, `""` en local/preview raíz) — SIN barra final, para poder
 * concatenarla directo delante de las rutas de `baseForLang`/`withLang`. */
export const APP_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Saca el prefijo de deploy de un pathname real del navegador ANTES de
 * detectar idioma — sin esto, bajo GitHub Pages `getLangFromPath` leería
 * "web-vaccine-tracker" como si fuera el segmento de idioma. Recibe
 * `appBase` como parámetro (no lee `import.meta.env` acá) para poder
 * testearla con cualquier base sin mockear Vite. */
export function stripAppBase(pathname: string, appBase: string): string {
  if (appBase && pathname.startsWith(appBase)) {
    const rest = pathname.slice(appBase.length);
    return rest === "" ? "/" : rest;
  }
  return pathname;
}

export function baseForLang(lang: Lang): string {
  return lang === "en" ? "/en" : "";
}

/** Quita el prefijo `/en` si está, para poder reconstruir la misma ruta bajo
 * otro idioma (usado por el selector de idioma). */
export function stripLangPrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

export function withLang(pathname: string, lang: Lang): string {
  const bare = stripLangPrefix(pathname);
  if (lang === "es") return bare;
  return bare === "/" ? "/en" : `/en${bare}`;
}
