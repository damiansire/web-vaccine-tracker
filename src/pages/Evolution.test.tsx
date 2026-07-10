import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Evolution } from "./Evolution";

test("renderiza sin explotar con países default, arranca pausada", async () => {
  render(<Evolution />);
  expect(await screen.findByRole("heading", { name: /evolución animada/i })).toBeInTheDocument();
  // Arranca pausada a propósito (a11y: nada de motion automático al cargar
  // la página) — el botón debe ofrecer "Reproducir", no "Pausar".
  expect(screen.getByRole("button", { name: /reproducir/i })).toBeInTheDocument();
});

test("el selector de métrica no ofrece 'Velocidad' (no es graficable como serie)", async () => {
  const user = userEvent.setup();
  render(<Evolution />);
  await screen.findByRole("heading", { name: /evolución animada/i });

  await user.click(screen.getByRole("combobox"));

  expect(
    screen.queryByRole("option", { name: "Velocidad: días hasta 50% con esquema completo" }),
  ).not.toBeInTheDocument();
});

test("mover el scrubber a mano pausa la animación", async () => {
  const user = userEvent.setup();
  render(<Evolution />);
  await screen.findByRole("heading", { name: /evolución animada/i });

  await user.click(screen.getByRole("button", { name: /reproducir/i }));
  expect(screen.getByRole("button", { name: /pausar/i })).toBeInTheDocument();

  const slider = screen.getByRole("slider", { name: /fecha de la animación/i });
  fireEvent.change(slider, { target: { value: "10" } });

  expect(screen.getByRole("button", { name: /reproducir/i })).toBeInTheDocument();
});

test("reproducir avanza el cursor de la animación con el tiempo", async () => {
  render(<Evolution />);
  await screen.findByRole("heading", { name: /evolución animada/i });

  vi.useFakeTimers();
  try {
    const slider = screen.getByRole("slider", { name: /fecha de la animación/i });
    expect(slider).toHaveValue("0");

    fireEvent.click(screen.getByRole("button", { name: /reproducir/i }));
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(Number(slider.getAttribute("value"))).toBeGreaterThan(0);
  } finally {
    vi.useRealTimers();
  }
});
