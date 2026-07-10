import { describe, expect, test } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  test("pasa a minúsculas y reemplaza espacios por guiones", () => {
    expect(slugify("United Kingdom")).toBe("united-kingdom");
  });

  test("quita acentos", () => {
    expect(slugify("México")).toBe("mexico");
  });

  test("colapsa símbolos consecutivos en un solo guion", () => {
    expect(slugify("Bonaire, Sint Eustatius and Saba")).toBe(
      "bonaire-sint-eustatius-and-saba",
    );
  });

  test("no deja guiones al principio ni al final", () => {
    expect(slugify("  Chile  ")).toBe("chile");
  });
});
