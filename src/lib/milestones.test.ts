import { describe, expect, test } from "vitest";
import { FIELDS } from "@/data/types";
import { dateAtThreshold, daysToThreshold } from "./milestones";

function row(date: string, values: Partial<Record<(typeof FIELDS)[number], number>>) {
  return FIELDS.map((f) => (f === "date" ? date : (values[f] ?? null)));
}

describe("dateAtThreshold", () => {
  test("devuelve la primera fecha en la que el campo llega al umbral", () => {
    const rows = [
      row("2021-01-01", { people_fully_vaccinated_per_hundred: 10 }),
      row("2021-02-01", { people_fully_vaccinated_per_hundred: 40 }),
      row("2021-03-01", { people_fully_vaccinated_per_hundred: 55 }),
      row("2021-04-01", { people_fully_vaccinated_per_hundred: 70 }),
    ];
    expect(dateAtThreshold(rows, FIELDS, "people_fully_vaccinated_per_hundred", 50)).toBe(
      "2021-03-01",
    );
  });

  test("null si nunca llega al umbral", () => {
    const rows = [row("2021-01-01", { people_fully_vaccinated_per_hundred: 10 })];
    expect(dateAtThreshold(rows, FIELDS, "people_fully_vaccinated_per_hundred", 50)).toBeNull();
  });

  test("dataset vacío da null, no explota", () => {
    expect(dateAtThreshold([], FIELDS, "people_fully_vaccinated_per_hundred", 50)).toBeNull();
  });
});

describe("daysToThreshold", () => {
  test("cuenta días calendario desde el primer dato hasta el hito", () => {
    const rows = [
      row("2021-01-01", { people_fully_vaccinated_per_hundred: 5 }),
      row("2021-01-31", { people_fully_vaccinated_per_hundred: 50 }),
    ];
    expect(daysToThreshold(rows, FIELDS, "people_fully_vaccinated_per_hundred", 50)).toBe(30);
  });

  test("el umbral en la primera fila da 0 días", () => {
    const rows = [row("2021-01-01", { people_fully_vaccinated_per_hundred: 50 })];
    expect(daysToThreshold(rows, FIELDS, "people_fully_vaccinated_per_hundred", 50)).toBe(0);
  });

  test("null si el país nunca llega al umbral", () => {
    const rows = [
      row("2021-01-01", { people_fully_vaccinated_per_hundred: 5 }),
      row("2021-06-01", { people_fully_vaccinated_per_hundred: 20 }),
    ];
    expect(daysToThreshold(rows, FIELDS, "people_fully_vaccinated_per_hundred", 50)).toBeNull();
  });

  test("dataset vacío da null, no explota", () => {
    expect(daysToThreshold([], FIELDS, "people_fully_vaccinated_per_hundred", 50)).toBeNull();
  });
});
