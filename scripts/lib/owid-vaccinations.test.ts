import { describe, expect, test } from "vitest";
import { parseCsv } from "./csv.ts";
import { sourcesFor, transformVaccinations } from "./owid-vaccinations.ts";

// Header a propósito en OTRO orden que FIELDS, para probar que la búsqueda
// es por nombre de columna, no por posición.
const FIXTURE_CSV = [
  "location,iso_code,date,people_vaccinated,total_vaccinations,people_fully_vaccinated,total_boosters,daily_vaccinations,daily_vaccinations_per_million,people_vaccinated_per_hundred,people_fully_vaccinated_per_hundred",
  "Argentina,ARG,2021-01-01,0,0,,,,,0.0,",
  "Argentina,ARG,2021-01-02,1000,1000,,,1000,22,0.01,",
  "World,OWID_WRL,2021-01-01,999999,999999,,,999999,999,10.0,",
  "Africa,OWID_AFR,2021-01-01,1,1,,,1,1,0.0,",
].join("\n");

describe("transformVaccinations", () => {
  const table = parseCsv(FIXTURE_CSV);
  const result = transformVaccinations(table);

  test("excluye agregados OWID_ (continentes, World, grupos de ingreso)", () => {
    expect(result.countries.has("World")).toBe(false);
    expect(result.countries.has("Africa")).toBe(false);
    expect(result.countries.size).toBe(1);
  });

  test("agrupa las filas de un país en orden, formato columnar", () => {
    const argentina = result.countries.get("Argentina");
    expect(argentina?.fields).toEqual([
      "date",
      "total_vaccinations",
      "people_vaccinated",
      "people_fully_vaccinated",
      "total_boosters",
      "daily_vaccinations",
      "daily_vaccinations_per_million",
      "people_vaccinated_per_hundred",
      "people_fully_vaccinated_per_hundred",
    ]);
    expect(argentina?.rows).toHaveLength(2);
    expect(argentina?.rows[1]).toEqual([
      "2021-01-02",
      1000,
      1000,
      null,
      null,
      1000,
      22,
      0.01,
      null,
    ]);
  });

  test("celdas vacías se parsean a null, no a string vacío ni NaN", () => {
    const argentina = result.countries.get("Argentina");
    const [, , , peopleFullyVaccinated] = argentina!.rows[0]!;
    expect(peopleFullyVaccinated).toBeNull();
  });

  test("guarda el iso_code alpha-3 tal cual, sin inventar alpha-2", () => {
    expect(result.isoCodes).toEqual([{ countryId: "Argentina", isoAlpha3: "ARG" }]);
  });

  test("calcula el rango de fechas real sobre TODAS las filas, no solo la última", () => {
    expect(result.dateRange).toEqual({ from: "2021-01-01", to: "2021-01-02" });
  });

  test("lastData toma la ÚLTIMA fila de cada país, no la primera", () => {
    expect(result.lastData).toEqual([
      {
        countryId: "Argentina",
        date: "2021-01-02",
        total_vaccinations: 1000,
        people_vaccinated: 1000,
        people_fully_vaccinated: null,
        total_boosters: null,
        daily_vaccinations: 1000,
        daily_vaccinations_per_million: 22,
        people_vaccinated_per_hundred: 0.01,
        people_fully_vaccinated_per_hundred: null,
        daysToFully50: null,
      },
    ]);
  });
});

describe("transformVaccinations — velocidad de vacunación (daysToFully50)", () => {
  test("calcula días desde el primer dato hasta 50% de esquema completo", () => {
    const csv = [
      "location,iso_code,date,people_vaccinated,total_vaccinations,people_fully_vaccinated,total_boosters,daily_vaccinations,daily_vaccinations_per_million,people_vaccinated_per_hundred,people_fully_vaccinated_per_hundred",
      "Israel,ISR,2021-01-01,0,0,0,,,,0.0,0.0",
      "Israel,ISR,2021-01-31,0,0,0,,,,0.0,50.0",
    ].join("\n");
    const result = transformVaccinations(parseCsv(csv));
    expect(result.lastData[0]?.daysToFully50).toBe(30);
  });

  test("null si el país nunca llega a 50%", () => {
    const csv = [
      "location,iso_code,date,people_vaccinated,total_vaccinations,people_fully_vaccinated,total_boosters,daily_vaccinations,daily_vaccinations_per_million,people_vaccinated_per_hundred,people_fully_vaccinated_per_hundred",
      "Chad,TCD,2021-01-01,0,0,0,,,,0.0,5.0",
    ].join("\n");
    const result = transformVaccinations(parseCsv(csv));
    expect(result.lastData[0]?.daysToFully50).toBeNull();
  });
});

describe("transformVaccinations — guard de schema-drift", () => {
  // requireIndex() es el ÚNICO fail-loud del pipeline: si OWID renombra o
  // quita una columna, esto es lo que evita que el dataset se genere
  // corrupto en silencio. Sin este test, un refactor que rompiera el guard
  // (ej. devolver -1 en vez de lanzar) pasaría desapercibido.
  test("lanza si al header le falta una columna de FIELDS", () => {
    const missingColumn = [
      "location,iso_code,date,people_vaccinated",
      "Argentina,ARG,2021-01-01,0",
    ].join("\n");
    expect(() => transformVaccinations(parseCsv(missingColumn))).toThrow(
      /Columna esperada ausente/,
    );
  });

  test("lanza si falta 'location' o 'iso_code', no solo un campo de FIELDS", () => {
    const missingIso = ["location,date,people_vaccinated", "Argentina,2021-01-01,0"].join("\n");
    expect(() => transformVaccinations(parseCsv(missingIso))).toThrow(/Columna esperada ausente/);
  });
});

describe("sourcesFor", () => {
  test("arma el link de OWID a partir del slug del país", () => {
    expect(sourcesFor("United Kingdom").sources[0]).toBe(
      "https://ourworldindata.org/coronavirus/country/united-kingdom",
    );
  });
});
