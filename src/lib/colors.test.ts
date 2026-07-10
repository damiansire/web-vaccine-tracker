import { describe, expect, test } from "vitest";
import { COLORS, amberSequential } from "./colors";

describe("amberSequential", () => {
  test("ratio 0 -> extremo oscuro (recede hacia el fondo)", () => {
    expect(amberSequential(0)).toBe(COLORS.amberDark);
  });

  test("ratio 1 -> extremo claro", () => {
    expect(amberSequential(1)).toBe(COLORS.amberLight);
  });

  test("es monótona: valores más altos no oscurecen", () => {
    const steps = [0, 0.25, 0.5, 0.75, 1].map(amberSequential);
    const luminance = (hex: string) => Number.parseInt(hex.slice(1), 16);
    for (let i = 1; i < steps.length; i++) {
      expect(luminance(steps[i]!)).toBeGreaterThanOrEqual(luminance(steps[i - 1]!));
    }
  });

  test("valores fuera de [0,1] se clampean, no explotan", () => {
    expect(amberSequential(-1)).toBe(COLORS.amberDark);
    expect(amberSequential(2)).toBe(COLORS.amberLight);
  });
});
