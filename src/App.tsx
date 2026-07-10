import { Suspense, lazy } from "react";
import { Route, Router, Switch } from "wouter";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout";
import { APP_BASE, baseForLang, getLangFromPath, stripAppBase } from "@/i18n/lang";

// Code-split por ruta: World Situation carga el mapa (react-svg-worldmap),
// Compare/CountryDetail cargan ECharts — ninguna ruta paga el peso de la
// librería que no usa en su carga inicial.
const WorldSituation = lazy(() =>
  import("@/pages/WorldSituation").then((m) => ({ default: m.WorldSituation })),
);
const Ranking = lazy(() => import("@/pages/Ranking").then((m) => ({ default: m.Ranking })));
const Compare = lazy(() => import("@/pages/Compare").then((m) => ({ default: m.Compare })));
const Evolution = lazy(() => import("@/pages/Evolution").then((m) => ({ default: m.Evolution })));
const CountryDetail = lazy(() =>
  import("@/pages/CountryDetail").then((m) => ({ default: m.CountryDetail })),
);

// Español sin prefijo (default, no rompe URLs existentes), inglés bajo
// `/en` — wouter prefija automáticamente todo <Link>/navigate() con este
// `base`, así que el resto del árbol de rutas no sabe que hay dos idiomas.
// Detectado de la URL una sola vez al bootear (ver src/i18n/lang.ts).
// `APP_BASE` se saca ANTES de detectar el idioma: bajo GitHub Pages
// (`/web-vaccine-tracker/en/...`) el segmento de idioma no es el primero.
const lang = getLangFromPath(stripAppBase(window.location.pathname, APP_BASE));

function App() {
  return (
    <Router base={APP_BASE + baseForLang(lang)}>
      {/* Solo cubre el import() perezoso de cada página (react-svg-worldmap /
          ECharts) — i18next no usa Suspense (ver src/i18n/config.ts). */}
      <Suspense fallback={<div className="min-h-screen bg-ink" />}>
        <Layout>
          <ErrorBoundary>
            <Switch>
              <Route path="/" component={WorldSituation} />
              <Route path="/ranking" component={Ranking} />
              <Route path="/comparar" component={Compare} />
              <Route path="/evolucion" component={Evolution} />
              <Route path="/pais/:slug" component={CountryDetail} />
            </Switch>
          </ErrorBoundary>
        </Layout>
      </Suspense>
    </Router>
  );
}

export default App;
