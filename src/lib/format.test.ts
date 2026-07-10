import { describe, expect, test } from "vitest";
import { formatCompact, formatDate, formatNumber, formatPercent } from "./format";

describe("formatNumber", () => {
  test("agrupa miles en español (punto)", () => {
    expect(formatNumber(1234567)).toBe("1.234.567");
  });

  test("agrupa miles en inglés (coma)", () => {
    expect(formatNumber(1234567, "en")).toBe("1,234,567");
  });

  test("null/undefined -> guion, nunca NaN", () => {
    expect(formatNumber(null)).toBe("—");
    expect(formatNumber(undefined)).toBe("—");
  });

  test("cero se muestra como 0, no como guion", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatCompact", () => {
  test("compacta millones en español, no símbolos ambiguos", () => {
    expect(formatCompact(1_200_000)).toBe("1,2 millones");
  });

  test("miles de millones se leen como tales, no como 'mil M'", () => {
    expect(formatCompact(12_459_043_149)).toBe("12,5 mil millones");
  });

  test("compacta en inglés", () => {
    expect(formatCompact(1_200_000, "en")).toBe("1.2 million");
  });
});

describe("formatPercent", () => {
  test("agrega el símbolo (español)", () => {
    expect(formatPercent(76.69)).toBe("76,69%");
  });

  test("agrega el símbolo (inglés)", () => {
    expect(formatPercent(76.69, "en")).toBe("76.69%");
  });

  test("null -> guion", () => {
    expect(formatPercent(null)).toBe("—");
  });
});

describe("formatDate", () => {
  test("parsea fecha OWID sin corrimiento de timezone (español)", () => {
    expect(formatDate("2021-03-15")).toBe("15 mar 2021");
  });

  test("mismo parseo en inglés, con su propio orden", () => {
    expect(formatDate("2021-03-15", "en")).toBe("Mar 15, 2021");
  });

  test("día de un solo dígito no lleva cero adelante espurio", () => {
    expect(formatDate("2021-01-05")).toBe("5 ene 2021");
  });

  test("null/undefined -> guion", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });
});
