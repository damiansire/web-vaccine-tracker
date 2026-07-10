import { describe, expect, test } from "vitest";
import { baseForLang, getLangFromPath, stripAppBase, stripLangPrefix, withLang } from "./lang";

describe("getLangFromPath", () => {
  test("sin prefijo -> español (default)", () => {
    expect(getLangFromPath("/")).toBe("es");
    expect(getLangFromPath("/ranking")).toBe("es");
  });

  test("prefijo /en -> inglés", () => {
    expect(getLangFromPath("/en")).toBe("en");
    expect(getLangFromPath("/en/ranking")).toBe("en");
  });

  test("un país que empieza con 'en' no se confunde con el prefijo", () => {
    expect(getLangFromPath("/pais/england")).toBe("es");
  });
});

describe("baseForLang", () => {
  test("es -> sin base, en -> /en", () => {
    expect(baseForLang("es")).toBe("");
    expect(baseForLang("en")).toBe("/en");
  });
});

describe("stripLangPrefix", () => {
  test("quita /en manteniendo el resto de la ruta", () => {
    expect(stripLangPrefix("/en/ranking")).toBe("/ranking");
    expect(stripLangPrefix("/en")).toBe("/");
  });

  test("ruta sin prefijo queda igual", () => {
    expect(stripLangPrefix("/ranking")).toBe("/ranking");
  });
});

describe("stripAppBase", () => {
  test("appBase vacío (deploy en raíz): no toca el pathname", () => {
    expect(stripAppBase("/en/ranking", "")).toBe("/en/ranking");
    expect(stripAppBase("/", "")).toBe("/");
  });

  test("appBase presente (ej. GitHub Pages): saca el prefijo antes de detectar idioma", () => {
    expect(stripAppBase("/web-vaccine-tracker/en/ranking", "/web-vaccine-tracker")).toBe("/en/ranking");
    expect(stripAppBase("/web-vaccine-tracker", "/web-vaccine-tracker")).toBe("/");
    expect(stripAppBase("/web-vaccine-tracker/", "/web-vaccine-tracker")).toBe("/");
  });

  test("pathname que no empieza con appBase queda igual (no debería pasar en runtime real, pero no debe romper)", () => {
    expect(stripAppBase("/otra-cosa", "/web-vaccine-tracker")).toBe("/otra-cosa");
  });
});

describe("withLang", () => {
  test("reconstruye la misma ruta bajo el otro idioma", () => {
    expect(withLang("/ranking", "en")).toBe("/en/ranking");
    expect(withLang("/en/ranking", "es")).toBe("/ranking");
  });

  test("raíz bajo inglés es /en, no /en/", () => {
    expect(withLang("/", "en")).toBe("/en");
  });

  test("es idempotente ante el idioma que ya tiene", () => {
    expect(withLang("/ranking", "es")).toBe("/ranking");
    expect(withLang("/en/ranking", "en")).toBe("/en/ranking");
  });
});
