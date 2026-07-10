import { describe, expect, test } from "vitest";
import { FIELDS } from "@/data/types";
import { sliceSeriesUpTo, toIndexedSeries, toTimeSeries } from "./timeSeries";

// Fila columnar con el mismo orden que FIELDS real.
function row(date: string, values: Partial<Record<(typeof FIELDS)[number], number>>) {
  return FIELDS.map((f) => (f === "date" ? date : (values[f] ?? null)));
}

describe("toTimeSeries", () => {
  test("arma pares [fecha, valor] para el campo pedido", () => {
    const rows = [
      row("2021-01-01", { people_fully_vaccinated_per_hundred: 10 }),
      row("2021-01-02", { people_fully_vaccinated_per_hundred: 20 }),
    ];
    expect(toTimeSeries(rows, FIELDS, "people_fully_vaccinated_per_hundred")).toEqual([
      ["2021-01-01", 10],
      ["2021-01-02", 20],
    ]);
  });

  test("descarta filas con hueco (null) en esa métrica, no las manda como 0", () => {
    const rows = [
      row("2021-01-01", { total_boosters: 5 }),
      row("2021-01-02", {}), // total_boosters null
      row("2021-01-03", { total_boosters: 15 }),
    ];
    expect(toTimeSeries(rows, FIELDS, "total_boosters")).toEqual([
      ["2021-01-01", 5],
      ["2021-01-03", 15],
    ]);
  });

  test("dataset vacío da serie vacía, no explota", () => {
    expect(toTimeSeries([], FIELDS, "total_vaccinations")).toEqual([]);
  });
});

describe("toIndexedSeries", () => {
  test("indexa por días desde el primer dato de la serie, no por fecha calendario", () => {
    const rows = [
      row("2021-03-01", { people_fully_vaccinated_per_hundred: 10 }),
      row("2021-03-11", { people_fully_vaccinated_per_hundred: 20 }),
      row("2021-04-10", { people_fully_vaccinated_per_hundred: 30 }),
    ];
    expect(toIndexedSeries(rows, FIELDS, "people_fully_vaccinated_per_hundred")).toEqual([
      [0, 10],
      [10, 20],
      [40, 30],
    ]);
  });

  test("descarta huecos (null) igual que toTimeSeries", () => {
    const rows = [
      row("2021-01-01", { total_boosters: 5 }),
      row("2021-01-02", {}),
      row("2021-01-03", { total_boosters: 15 }),
    ];
    expect(toIndexedSeries(rows, FIELDS, "total_boosters")).toEqual([
      [0, 5],
      [2, 15],
    ]);
  });

  test("dataset vacío da serie vacía, no explota", () => {
    expect(toIndexedSeries([], FIELDS, "total_vaccinations")).toEqual([]);
  });
});

describe("sliceSeriesUpTo", () => {
  const series: [string, number][] = [
    ["2021-01-01", 10],
    ["2021-01-15", 20],
    ["2021-02-01", 30],
  ];

  test("deja solo los puntos con fecha <= asOfDate", () => {
    expect(sliceSeriesUpTo(series, "2021-01-15")).toEqual([
      ["2021-01-01", 10],
      ["2021-01-15", 20],
    ]);
  });

  test("asOfDate antes del primer punto da serie vacía", () => {
    expect(sliceSeriesUpTo(series, "2020-12-31")).toEqual([]);
  });

  test("asOfDate después del último punto devuelve la serie completa", () => {
    expect(sliceSeriesUpTo(series, "2099-01-01")).toEqual(series);
  });
});
