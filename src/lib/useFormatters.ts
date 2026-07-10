import { useTranslation } from "react-i18next";
import { DEFAULT_LANG, isLang } from "@/i18n/lang";
import { formatCompact, formatDate, formatNumber, formatPercent } from "./format";

/** Las páginas usan esto en vez de importar format.ts directo — evita que
 * cada call site tenga que acordarse de pasar `i18n.language` a mano. */
export function useFormatters() {
  const { i18n } = useTranslation();
  const lang = isLang(i18n.language) ? i18n.language : DEFAULT_LANG;

  return {
    lang,
    formatNumber: (value: number | null | undefined) => formatNumber(value, lang),
    formatCompact: (value: number | null | undefined) => formatCompact(value, lang),
    formatPercent: (value: number | null | undefined) => formatPercent(value, lang),
    formatDate: (value: string | null | undefined) => formatDate(value, lang),
  };
}
