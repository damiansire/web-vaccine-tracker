import { slugify, decodeColumnar, loadCountry } from "./loader";

describe("slugify", () => {
  test("pasa nombres con espacios a kebab-case", () => {
    expect(slugify("United States")).toBe("united-states");
    expect(slugify("South Korea")).toBe("south-korea");
  });

  test("quita acentos, apostrofes y bordes", () => {
    expect(slugify("Côte d'Ivoire")).toBe("cote-d-ivoire");
    expect(slugify("  Brazil  ")).toBe("brazil");
  });
});

describe("decodeColumnar", () => {
  test("rehidrata { fields, rows } a array de objetos respetando el orden", () => {
    const columnar = {
      fields: ["date", "daily_vaccinations", "total_dose_vaccinations"],
      rows: [
        ["2021-01-15", 100, 200],
        ["2021-02-15", 150, 350],
      ],
    };

    expect(decodeColumnar(columnar)).toEqual([
      { date: "2021-01-15", daily_vaccinations: 100, total_dose_vaccinations: 200 },
      { date: "2021-02-15", daily_vaccinations: 150, total_dose_vaccinations: 350 },
    ]);
  });

  test("serie vacia produce array vacio", () => {
    expect(decodeColumnar({ fields: ["date"], rows: [] })).toEqual([]);
  });
});

describe("loadCountry", () => {
  test("país sin archivo degrada a serie vacía en vez de rechazar", async () => {
    // No existe src/data/countries/pais-inexistente-xyz.json -> el import()
    // rechaza, pero loadCountry tiene .catch y resuelve a una serie neutra.
    // Esto evita que un país faltante tumbe el Promise.all del comparador.
    const result = await loadCountry("Pais Inexistente XYZ");
    expect(result).toEqual({ countryName: "Pais Inexistente XYZ", data: [] });
  });
});
