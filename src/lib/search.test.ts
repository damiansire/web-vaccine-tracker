import { describe, expect, test } from "vitest";
import { matchesQuery } from "./search";

describe("matchesQuery", () => {
  test("busca sin distinguir mayúsculas", () => {
    expect(matchesQuery("Argentina", "arg")).toBe(true);
  });

  test("busca ignorando acentos", () => {
    expect(matchesQuery("México", "mexico")).toBe(true);
    expect(matchesQuery("México", "méxico")).toBe(true);
  });

  test("query vacío matchea todo", () => {
    expect(matchesQuery("Chile", "")).toBe(true);
    expect(matchesQuery("Chile", "   ")).toBe(true);
  });

  test("no matchea si la subcadena no está", () => {
    expect(matchesQuery("Chile", "brasil")).toBe(false);
  });
});
