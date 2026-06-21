import { getGraphObj } from "./graphData";

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

describe("getGraphObj (alineación por fecha)", () => {
  test("usa la unión ordenada de fechas como eje X", () => {
    const obj = getGraphObj(countriesData, "people_vaccinated");
    expect(obj.xAxis[0].data).toEqual([
      "2021-01-15",
      "2021-02-15",
      "2021-03-15",
    ]);
  });

  test("cada valor cae bajo su fecha real, con null donde el país no tiene dato", () => {
    // Series de distinta longitud y fechas no coincidentes (caso sameOrigin):
    // el bug viejo alineaba por posición y mostraba el valor de B bajo la fecha de A.
    const obj = getGraphObj(countriesData, "people_vaccinated");
    const seriesA = obj.series.find((s) => s.name === "A");
    const seriesB = obj.series.find((s) => s.name === "B");

    // Eje: [01-15, 02-15, 03-15]
    expect(seriesA.data).toEqual([10, null, 30]);
    expect(seriesB.data).toEqual([null, 200, 300]);
  });
});
