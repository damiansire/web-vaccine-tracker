import { buildTableRows } from "./tableData";

describe("buildTableRows (alineación por fecha)", () => {
  test("alinea cada valor bajo su fecha real, no por posición", () => {
    // Series de distinta longitud y fechas no coincidentes (caso sameOrigin).
    const countriesData = [
      {
        name: "A",
        data: [
          { date: "2021-01-15", people_vaccinated: 10 },
          { date: "2021-03-15", people_vaccinated: 30 },
        ],
      },
      {
        name: "B",
        data: [
          { date: "2021-02-15", people_vaccinated: 200 },
          { date: "2021-03-15", people_vaccinated: 300 },
        ],
      },
    ];

    const rows = buildTableRows(countriesData, "people_vaccinated");

    expect(rows.map((r) => r.date)).toEqual([
      "2021-01-15",
      "2021-02-15",
      "2021-03-15",
    ]);

    // En 2021-03-15 ambos coinciden; en las otras fechas, el país sin dato
    // queda undefined (no toma el valor de otra fila).
    const byDate = Object.fromEntries(rows.map((r) => [r.date, r]));
    expect(byDate["2021-01-15"].A).toBe(10);
    expect(byDate["2021-01-15"].B).toBeUndefined();
    expect(byDate["2021-02-15"].A).toBeUndefined();
    expect(byDate["2021-02-15"].B).toBe(200);
    expect(byDate["2021-03-15"].A).toBe(30);
    expect(byDate["2021-03-15"].B).toBe(300);
  });

  test("cada fila tiene un id único y estable", () => {
    const countriesData = [
      {
        name: "A",
        data: [
          { date: "2021-02-15", v: 2 },
          { date: "2021-01-15", v: 1 },
        ],
      },
    ];
    const rows = buildTableRows(countriesData, "v");
    expect(rows.map((r) => r.id)).toEqual([0, 1]);
    // Ordenadas por fecha aunque vinieran desordenadas.
    expect(rows.map((r) => r.date)).toEqual(["2021-01-15", "2021-02-15"]);
  });
});
