import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "./App";

test(
  "la ruta / renderiza la página de situación mundial",
  async () => {
    render(<App />);
    // Timeout explícito: la ruta es lazy (React.lazy + Suspense), el default
    // de 1000ms de testing-library resultó flaky bajo carga (import dinámico
    // + primer render del mapa mundial con 217 países). 5000ms seguía siendo
    // flaky corriendo la suite completa (20 archivos en paralelo compiten por
    // CPU) aunque pasa siempre en aislamiento. Subimos DOS timeouts: el de
    // `findByRole` (espera de la aserción) y el del test en sí (tercer
    // argumento de `test()`, default 5000ms de vitest) — el que cortó esta
    // corrida fue el segundo, no el primero.
    expect(
      await screen.findByRole("heading", { name: /así vacunó al mundo/i }, { timeout: 15000 }),
    ).toBeInTheDocument();
  },
  15000,
);
