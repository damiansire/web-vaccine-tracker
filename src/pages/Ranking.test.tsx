import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import { lastData } from "@/data/loader";
import { rankCountries } from "@/lib/stats";
import { Ranking } from "./Ranking";

afterEach(() => {
  window.history.replaceState(null, "", "/");
});

async function firstDataRow() {
  // rows[0] es el header — la primera fila de datos es rows[1].
  const rows = await screen.findAllByRole("row");
  return rows[1] as HTMLElement;
}

test("orden por defecto: primera fila es el país #1 en people_fully_vaccinated_per_hundred", async () => {
  render(<Ranking />);
  const expectedTop = rankCountries(lastData, "people_fully_vaccinated_per_hundred")[0];
  expect(expectedTop).toBeDefined();
  expect(within(await firstDataRow()).getByText(expectedTop!.countryId)).toBeInTheDocument();
});

test("cambiar la métrica reordena la tabla según la nueva métrica", async () => {
  const user = userEvent.setup();
  render(<Ranking />);

  await user.click(screen.getByRole("combobox"));
  await user.click(await screen.findByRole("option", { name: "Dosis totales aplicadas" }));

  const expectedTop = rankCountries(lastData, "total_vaccinations")[0];
  expect(expectedTop).toBeDefined();
  expect(within(await firstDataRow()).getByText(expectedTop!.countryId)).toBeInTheDocument();
});

test("métrica de velocidad (días a 50%) ordena ASCENDENTE: el país más rápido va primero", async () => {
  const user = userEvent.setup();
  render(<Ranking />);

  await user.click(screen.getByRole("combobox"));
  await user.click(
    await screen.findByRole("option", { name: "Velocidad: días hasta 50% con esquema completo" }),
  );

  const expectedFastest = rankCountries(lastData, "daysToFully50", "asc")[0];
  expect(expectedFastest).toBeDefined();
  expect(within(await firstDataRow()).getByText(expectedFastest!.countryId)).toBeInTheDocument();
});

test("click en una fila navega a /pais/:slug del país de esa fila", async () => {
  const user = userEvent.setup();
  render(<Ranking />);

  const expectedTop = rankCountries(lastData, "people_fully_vaccinated_per_hundred")[0];
  const row = await screen.findByText(expectedTop!.countryId);
  await user.click(row);

  expect(window.location.pathname.startsWith("/pais/")).toBe(true);
});
