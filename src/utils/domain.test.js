import { formatNumberWithPoint } from "./numberFormat";
import { sortDateAsc } from "./sorts";
import { normalizeCountries } from "./missingDate";

describe("formatNumberWithPoint", () => {
  test("agrega separador de miles", () => {
    expect(formatNumberWithPoint(1000)).toBe("1.000");
    expect(formatNumberWithPoint(1234567)).toBe("1.234.567");
  });

  test("no toca numeros de menos de 4 digitos", () => {
    expect(formatNumberWithPoint(0)).toBe("0");
    expect(formatNumberWithPoint(999)).toBe("999");
  });

  test("devuelve guion ante null/undefined sin lanzar", () => {
    expect(formatNumberWithPoint(null)).toBe("—");
    expect(formatNumberWithPoint(undefined)).toBe("—");
  });
});

describe("sortDateAsc", () => {
  test("ordena puntos por fecha ascendente", () => {
    const data = [
      { date: "2021-03-10" },
      { date: "2021-01-05" },
      { date: "2021-02-01" },
    ];
    const sorted = [...data].sort(sortDateAsc);
    expect(sorted.map((d) => d.date)).toEqual([
      "2021-01-05",
      "2021-02-01",
      "2021-03-10",
    ]);
  });

  test("devuelve 0 cuando las fechas son iguales (contrato de sort)", () => {
    expect(sortDateAsc({ date: "2021-05-01" }, { date: "2021-05-01" })).toBe(0);
  });
});

describe("normalizeCountries", () => {
  test("rellena las fechas faltantes en cada pais y produce fechas validas", () => {
    const input = [
      {
        name: "A",
        data: [{ date: "2021-09-30" }, { date: "2021-10-03" }],
      },
      {
        name: "B",
        data: [{ date: "2021-09-30" }],
      },
    ];

    const result = normalizeCountries(input);

    // El rango va de 2021-09-30 a 2021-10-03 => 4 fechas.
    const expectedDates = [
      "2021-09-30",
      "2021-10-01",
      "2021-10-02",
      "2021-10-03",
    ];

    // No debe mutar el input recibido.
    expect(input[0].data).toHaveLength(2);
    expect(input[1].data).toHaveLength(1);

    result.forEach((country) => {
      const dates = country.data.map((p) => p.date).sort();
      expect(dates).toEqual(expectedDates);
      // Ninguna fecha generada debe ser invalida (regresion del bug de octubre).
      dates.forEach((d) => {
        expect(Number.isNaN(new Date(d).getTime())).toBe(false);
        expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });
});
