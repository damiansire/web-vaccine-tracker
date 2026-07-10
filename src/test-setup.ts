import "@testing-library/jest-dom/vitest";
// Efecto de módulo: corre i18next.init() antes de que cualquier test
// renderice un componente con useTranslation(). Sin esto, cada test de
// página necesitaría inicializar i18next a mano.
import "@/i18n/config";

// jsdom no implementa ResizeObserver — lo usan los componentes con tamaño
// "responsive" (mapa mundial). Stub mínimo, solo para que no reviente en tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

// jsdom tampoco implementa un 2D context real (requeriría el paquete nativo
// `canvas`, con node-gyp — evitado a propósito). ECharts (gráficos de
// Compare/CountryDetail) llama a decenas de métodos de canvas; un Proxy
// catch-all que no-opea cualquier llamada y devuelve 0 para cualquier
// propiedad numérica alcanza para que renderice sin explotar, sin tener que
// enumerar la API de canvas a mano.
function createNoopContext(): CanvasRenderingContext2D {
  const target: Record<string, unknown> = {};
  return new Proxy(target, {
    get(_t, prop) {
      if (prop === "canvas") return undefined;
      if (prop === "measureText") return () => ({ width: 0 });
      if (prop === "getContextAttributes") return () => ({});
      if (prop === "createLinearGradient" || prop === "createRadialGradient") {
        return () => ({ addColorStop: () => {} });
      }
      return () => {};
    },
  }) as unknown as CanvasRenderingContext2D;
}
HTMLCanvasElement.prototype.getContext = (() =>
  createNoopContext()) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// jsdom no implementa Pointer Events ni scrollIntoView — el popup de
// @base-ui/react (usado por <Select>, MetricSelect) los llama al abrir/mover
// el mouse sobre las opciones. Sin estos stubs, un click de user-event sobre
// el trigger nunca termina de abrir el popup en los tests.
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.scrollIntoView ??= () => {};
