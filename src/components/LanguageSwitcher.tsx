import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { APP_BASE, DEFAULT_LANG, SUPPORTED_LANGS, isLang, withLang } from "@/i18n/lang";
import { cn } from "@/lib/utils";

/** `<a>` normal, no `<Link>` de wouter: cambiar de idioma cambia el `base`
 * del Router (ver App.tsx), así que necesita una navegación real de
 * página, no una transición cliente. */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [relativePath] = useLocation();
  const currentLang = isLang(i18n.language) ? i18n.language : DEFAULT_LANG;

  return (
    <div className="flex items-center gap-1 text-xs">
      {SUPPORTED_LANGS.map((lang) => (
        <a
          key={lang}
          href={APP_BASE + withLang(relativePath, lang)}
          aria-current={lang === currentLang}
          title={t(`languageSwitcher.${lang}`)}
          className={cn(
            "tabular rounded px-1.5 py-0.5 uppercase tracking-wide transition-colors",
            lang === currentLang
              ? "bg-surface-2 text-foreground"
              : "text-ink-muted hover:text-foreground",
          )}
        >
          {lang}
        </a>
      ))}
    </div>
  );
}
