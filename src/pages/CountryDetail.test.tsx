import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import { CountryDetail } from "./CountryDetail";

test("país real: aparecen el título y los KPIs", async () => {
  render(<CountryDetail params={{ slug: "argentina" }} />);
  expect(await screen.findByRole("heading", { name: "Argentina" })).toBeInTheDocument();
  expect(screen.getByText("Esquema completo")).toBeInTheDocument();
  expect(screen.getByText("Dosis totales")).toBeInTheDocument();
});

test("muestra el hito de 50% de esquema completo, calculado de la serie real del país", async () => {
  const { loadCountry } = await import("@/data/loader");
  const { dateAtThreshold, FULLY_VACCINATED_MILESTONE_PCT } = await import("@/lib/milestones");
  const { FIELDS } = await import("@/data/types");
  const country = await loadCountry("Argentina");
  const expectedDate = dateAtThreshold(
    country!.rows,
    FIELDS,
    "people_fully_vaccinated_per_hundred",
    FULLY_VACCINATED_MILESTONE_PCT,
  );

  render(<CountryDetail params={{ slug: "argentina" }} />);
  await screen.findByRole("heading", { name: "Argentina" });

  if (expectedDate) {
    expect(screen.getByText(/Alcanzó el 50% con esquema completo/)).toBeInTheDocument();
  } else {
    expect(screen.getByText(/Todavía no alcanzó el 50%/)).toBeInTheDocument();
  }
});

test("slug que no existe en el dataset: muestra notFound, no 'Cargando' infinito", async () => {
  render(<CountryDetail params={{ slug: "narnia" }} />);
  expect(await screen.findByText(/no encontramos ese país/i)).toBeInTheDocument();
});

test("país en el manifest pero cuyo JSON falla al cargar: muestra error, no loading infinito", async () => {
  const loader = await import("@/data/loader");
  const spy = vi.spyOn(loader, "loadCountry").mockResolvedValue(null);
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  render(<CountryDetail params={{ slug: "argentina" }} />);

  expect(await screen.findByText(/no pudimos cargar/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /reintentar/i })).toBeInTheDocument();

  spy.mockRestore();
  errorSpy.mockRestore();
});
