import { describe, expect, test } from "vitest";
import { isoCodes, manifest } from "@/data/loader";
import { slugify } from "@/lib/slugify";
import { buildCountryIdByAlpha2, toAlpha2 } from "./iso";

describe("toAlpha2", () => {
  test("convierte alpha-3 a alpha-2", () => {
    expect(toAlpha2("ARG")).toBe("AR");
    expect(toAlpha2("USA")).toBe("US");
    expect(toAlpha2("GBR")).toBe("GB");
  });

  test("código inexistente devuelve null, no explota", () => {
    expect(toAlpha2("ZZZ")).toBeNull();
  });
});

describe("buildCountryIdByAlpha2", () => {
  test("resuelve alpha-2 al countryId de OWID correcto", () => {
    const map = buildCountryIdByAlpha2([
      { countryId: "Argentina", isoAlpha3: "ARG" },
      { countryId: "United States", isoAlpha3: "USA" },
    ]);
    expect(map.get("AR")).toBe("Argentina");
    expect(map.get("US")).toBe("United States");
  });

  // Regresión del bug real: el click del mapa navegaba con el nombre que da
  // react-svg-worldmap (su propia lista interna), no con el countryId de
  // OWID — divergían para ~10 países (ej. "Czech Republic" vs "Czechia") y
  // el usuario caía en "país no encontrado". Este test prueba con el
  // dataset REAL (217 países) que el camino alpha-2 -> countryId siempre
  // resuelve a un país que existe en el manifest.
  test("todo país del dataset real resuelve, vía alpha-2, a un slug del manifest", () => {
    const countryIdByAlpha2 = buildCountryIdByAlpha2(isoCodes);
    const manifestSlugs = new Set(manifest.countries.map(slugify));

    let resolvedCount = 0;
    for (const { isoAlpha3 } of isoCodes) {
      const alpha2 = toAlpha2(isoAlpha3);
      if (!alpha2) continue; // países sin equivalente ISO estándar, esperado
      const countryId = countryIdByAlpha2.get(alpha2);
      expect(countryId).toBeDefined();
      expect(manifestSlugs.has(slugify(countryId!))).toBe(true);
      resolvedCount++;
    }
    // No es un test vacío: confirma que efectivamente ejercitó el dataset real.
    expect(resolvedCount).toBeGreaterThan(200);
  });
});
