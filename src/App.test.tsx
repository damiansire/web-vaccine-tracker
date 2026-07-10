import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "./App";

test("la ruta / renderiza la página de situación mundial", async () => {
  render(<App />);
  // Timeout explícito: la ruta es lazy (React.lazy + Suspense), el default
  // de 1000ms de testing-library resultó flaky bajo carga (import dinámico
  // + primer render del mapa mundial con 217 países).
  expect(
    await screen.findByRole("heading", { name: /así vacunó al mundo/i }, { timeout: 5000 }),
  ).toBeInTheDocument();
});
