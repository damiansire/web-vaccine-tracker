import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useTranslation();
  const [location] = useLocation();

  const links = [
    { href: "/", label: t("nav.worldSituation") },
    { href: "/ranking", label: t("nav.ranking") },
    { href: "/comparar", label: t("nav.compare") },
    { href: "/evolucion", label: t("nav.evolution") },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-display text-lg font-semibold text-foreground">
            {t("appName")}
          </Link>
          <span className="tabular hidden rounded-full border border-hairline px-2.5 py-1 text-[10px] tracking-widest text-ink-muted uppercase sm:inline-block">
            {t("stamp")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const active = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-surface-2 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
