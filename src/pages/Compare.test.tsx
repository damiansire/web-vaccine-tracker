import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect } from "vitest";
import { Compare } from "./Compare";

test("renderiza sin explotar con países default", async () => {
  render(<Compare />);
  expect(await screen.findByRole("heading", { name: /comparar países/i })).toBeInTheDocument();
});

test("agregar un país lo suma a la tabla de comparación", async () => {
  const user = userEvent.setup();
  render(<Compare />);
  await screen.findByRole("heading", { name: /comparar países/i });

  await user.type(screen.getByPlaceholderText("Buscar país…"), "Brazil");
  await user.click(await screen.findByRole("button", { name: "Brazil" }));

  expect(screen.getByRole("button", { name: "Quitar Brazil" })).toBeInTheDocument();
  const table = screen.getByRole("table");
  expect(await within(table).findByText("Brazil")).toBeInTheDocument();
});

test("quitar un país lo saca de la tabla de comparación", async () => {
  const user = userEvent.setup();
  render(<Compare />);
  await screen.findByRole("heading", { name: /comparar países/i });

  const table = screen.getByRole("table");
  expect(within(table).getByText("Chile")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Quitar Chile" }));

  expect(screen.queryByRole("button", { name: "Quitar Chile" })).not.toBeInTheDocument();
  expect(within(table).queryByText("Chile")).not.toBeInTheDocument();
});

test("alternar a 'Días desde el inicio' marca el botón activo, sin explotar", async () => {
  const user = userEvent.setup();
  render(<Compare />);
  await screen.findByRole("heading", { name: /comparar países/i });

  const calendarBtn = screen.getByRole("button", { name: "Fecha calendario" });
  const daysBtn = screen.getByRole("button", { name: "Días desde el inicio" });
  expect(calendarBtn).toHaveAttribute("aria-pressed", "true");
  expect(daysBtn).toHaveAttribute("aria-pressed", "false");

  await user.click(daysBtn);

  expect(daysBtn).toHaveAttribute("aria-pressed", "true");
  expect(calendarBtn).toHaveAttribute("aria-pressed", "false");
  // el chart sigue montado (no revienta al cambiar de eje de tiempo a numérico)
  expect(screen.getByRole("table")).toBeInTheDocument();
});

test("el selector de métrica de Compare no ofrece 'Velocidad' (no es graficable como serie)", async () => {
  const user = userEvent.setup();
  render(<Compare />);
  await screen.findByRole("heading", { name: /comparar países/i });

  await user.click(screen.getByRole("combobox"));

  expect(
    screen.queryByRole("option", { name: "Velocidad: días hasta 50% con esquema completo" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Esquema completo" })).toBeInTheDocument();
});
