import { describe, expect, test } from "vitest";
import { assertLastDataRows } from "./validate";

describe("assertLastDataRows", () => {
  test("acepta un array de filas con countryId string", () => {
    expect(() => assertLastDataRows([{ countryId: "Argentina" }, { countryId: "Chile" }])).not.toThrow();
  });

  test("rechaza algo que no es un array", () => {
    expect(() => assertLastDataRows({ countryId: "Argentina" })).toThrow(/se esperaba un array/);
  });

  test("rechaza una fila sin countryId", () => {
    expect(() => assertLastDataRows([{ total_vaccinations: 100 }])).toThrow(/fila 0/);
  });

  test("rechaza una fila con countryId no-string", () => {
    expect(() => assertLastDataRows([{ countryId: 42 }])).toThrow(/fila 0/);
  });

  test("array vacío es válido (dataset sin países no es un shape roto)", () => {
    expect(() => assertLastDataRows([])).not.toThrow();
  });
});
