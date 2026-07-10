import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

function Bomb({ shouldThrow, onRender }: { shouldThrow: boolean; onRender?: () => void }) {
  onRender?.();
  if (shouldThrow) throw new Error("boom");
  return <p>contenido sano</p>;
}

test("un hijo que lanza muestra el fallback, no tumba la app", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  render(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>,
  );
  expect(screen.getByText(/esta sección no pudo mostrarse/i)).toBeInTheDocument();
  errorSpy.mockRestore();
});

test("componentDidCatch loguea el error (no se traga en silencio)", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  render(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>,
  );
  const loggedByBoundary = errorSpy.mock.calls.some((call) => call[0] === "[ErrorBoundary]");
  expect(loggedByBoundary).toBe(true);
  errorSpy.mockRestore();
});

test("reintentar limpia el estado de error y vuelve a intentar renderizar", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const user = userEvent.setup();
  const renderAttempts = vi.fn();

  render(
    <ErrorBoundary>
      <Bomb shouldThrow onRender={renderAttempts} />
    </ErrorBoundary>,
  );
  expect(screen.getByText(/esta sección no pudo mostrarse/i)).toBeInTheDocument();
  const attemptsBeforeRetry = renderAttempts.mock.calls.length;

  await user.click(screen.getByRole("button", { name: /reintentar/i }));

  // El hijo sigue roto (tira siempre), pero "reintentar" de verdad volvió a
  // INTENTAR renderizarlo -- no se quedó pegado mostrando el fallback viejo
  // sin reaccionar al click (que es lo que "limpia el estado" prueba).
  expect(renderAttempts.mock.calls.length).toBeGreaterThan(attemptsBeforeRetry);
  expect(screen.getByText(/esta sección no pudo mostrarse/i)).toBeInTheDocument();
  errorSpy.mockRestore();
});
