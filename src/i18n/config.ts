import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { APP_BASE, DEFAULT_LANG, SUPPORTED_LANGS, getLangFromPath, stripAppBase } from "./lang";

export const NAMESPACES = [
  "common",
  "worldSituation",
  "ranking",
  "compare",
  "countryDetail",
  "evolution",
] as const;

// Detectado UNA vez al bootear (no en un effect): el idioma es parte de la
// URL con la que se sirvió la página, no un estado que cambie sin
// navegación — evita el flash de contenido en el idioma default antes de
// que un effect corrija. `stripAppBase` es la misma corrección que en
// App.tsx: bajo GitHub Pages (`/web-vaccine-tracker/en/...`) el segmento de
// idioma no es el primero del pathname — sin esto, este módulo (que corre
// independiente de App.tsx, importado primero en main.tsx) inicializaba
// i18next en español mientras el Router de App.tsx enrutaba en inglés.
const initialLang = getLangFromPath(stripAppBase(window.location.pathname, APP_BASE));

void i18next
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(initReactI18next)
  .init({
    lng: initialLang,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS,
    ns: NAMESPACES,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    // false, no true: con Suspense cada componente que llama useTranslation
    // necesitaría su propio <Suspense> (o uno global cubriendo TODO antes
    // de renderizar nada), y en tests renderizar una página sin envolverla
    // revienta con "suspended without a Suspense boundary". Sin Suspense,
    // t() devuelve la key mientras carga y re-renderiza solo cuando el
    // namespace llega — ventana imperceptible (JSON chicos, mismo origen).
    react: { useSuspense: false },
  });

export default i18next;
