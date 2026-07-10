import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-ink text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-ink-muted sm:px-6">
        {t("footer.dataPrefix")}{" "}
        <a
          href="https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-hairline underline-offset-2 hover:text-foreground"
        >
          {t("footer.dataSource")}
        </a>{" "}
        · {t("footer.domainClosed")} · {t("footer.noLiveApi")}
      </footer>
    </div>
  );
}
