import { describe, expect, test } from "vitest";
import type { LastDataRow } from "@/data/types";
import { computeGlobalStats, rankCountries } from "./stats";

function row(overrides: Partial<LastDataRow> & { countryId: string }): LastDataRow {
  return {
    date: "2024-01-01",
    total_vaccinations: null,
    people_vaccinated: null,
    people_fully_vaccinated: null,
    total_boosters: null,
    daily_vaccinations: null,
    daily_vaccinations_per_million: null,
    people_vaccinated_per_hundred: null,
    people_fully_vaccinated_per_hundred: null,
    daysToFully50: null,
    ...overrides,
  };
}

describe("computeGlobalStats", () => {
  test("promedia solo los países con dato, ignora los sin dato", () => {
    const stats = computeGlobalStats([
      row({ countryId: "A", people_fully_vaccinated_per_hundred: 80 }),
      row({ countryId: "B", people_fully_vaccinated_per_hundred: 40 }),
      row({ countryId: "C", people_fully_vaccinated_per_hundred: null }),
    ]);
    expect(stats.avgFullyVaccinatedPct).toBe(60);
    expect(stats.countryCount).toBe(3);
  });

  test("dataset vacío no explota, promedio es null", () => {
    expect(computeGlobalStats([]).avgFullyVaccinatedPct).toBeNull();
    expect(computeGlobalStats([]).topCountry).toBeNull();
  });

  test("topCountry es el de mayor % completo", () => {
    const stats = computeGlobalStats([
      row({ countryId: "A", people_fully_vaccinated_per_hundred: 80 }),
      row({ countryId: "B", people_fully_vaccinated_per_hundred: 95 }),
    ]);
    expect(stats.topCountry).toEqual({ name: "B", pct: 95 });
  });

  test("suma dosis totales, trata null como 0", () => {
    const stats = computeGlobalStats([
      row({ countryId: "A", total_vaccinations: 100 }),
      row({ countryId: "B", total_vaccinations: null }),
    ]);
    expect(stats.totalDoses).toBe(100);
  });
});

describe("rankCountries", () => {
  test("ordena descendente por la métrica pedida", () => {
    const ranked = rankCountries(
      [
        row({ countryId: "A", people_fully_vaccinated_per_hundred: 40 }),
        row({ countryId: "B", people_fully_vaccinated_per_hundred: 90 }),
        row({ countryId: "C", people_fully_vaccinated_per_hundred: 60 }),
      ],
      "people_fully_vaccinated_per_hundred",
    );
    expect(ranked.map((r) => r.countryId)).toEqual(["B", "C", "A"]);
  });

  test("descarta países sin dato para esa métrica en vez de mostrarlos como 0", () => {
    const ranked = rankCountries(
      [
        row({ countryId: "A", total_boosters: 500 }),
        row({ countryId: "B", total_boosters: null }),
      ],
      "total_boosters",
    );
    expect(ranked.map((r) => r.countryId)).toEqual(["A"]);
  });

  test("direction 'asc' pone primero el valor MÁS BAJO (ej. país más rápido)", () => {
    const ranked = rankCountries(
      [
        row({ countryId: "lento", daysToFully50: 400 }),
        row({ countryId: "rapido", daysToFully50: 90 }),
        row({ countryId: "medio", daysToFully50: 200 }),
      ],
      "daysToFully50",
      "asc",
    );
    expect(ranked.map((r) => r.countryId)).toEqual(["rapido", "medio", "lento"]);
  });
});
