import { describe, expect, test, vi } from "vitest";
import { isoCodes, lastData, loadCountries, loadCountry, loadCountrySources, manifest } from "./loader";

describe("manifest / iso-codes / last-data (import estático)", () => {
  test("el manifest lista países reales, no está vacío", () => {
    expect(manifest.synthetic).toBe(false);
    expect(manifest.countries.length).toBeGreaterThan(100);
    expect(manifest.countries).toContain("Argentina");
  });

  test("iso-codes y last-data tienen una entrada por país del manifest", () => {
    expect(isoCodes.length).toBe(manifest.countries.length);
    expect(lastData.length).toBe(manifest.countries.length);
  });
});

describe("loadCountry", () => {
  test("carga la serie de un país real", async () => {
    const data = await loadCountry("Argentina");
    expect(data?.countryName).toBe("Argentina");
    expect(data?.rows.length).toBeGreaterThan(0);
  });

  test("un país que no existe en el dataset devuelve null, no explota", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const data = await loadCountry("Narnia");
    expect(data).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe("loadCountrySources", () => {
  test("país inexistente degrada a sources vacío en vez de tirar", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const sources = await loadCountrySources("Narnia");
    expect(sources).toEqual({ sources: [] });
    errorSpy.mockRestore();
  });
});

describe("loadCountries", () => {
  test("un país faltante no tumba el batch — devuelve solo los que cargaron", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const results = await loadCountries(["Argentina", "Narnia", "Chile"]);
    expect(results.map((c) => c.countryName).sort()).toEqual(["Argentina", "Chile"]);
    errorSpy.mockRestore();
  });
});
