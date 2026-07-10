import { describe, expect, test } from "vitest";
import { parseCsv } from "./csv.ts";

describe("parseCsv", () => {
  test("separa header y filas por coma", () => {
    const csv = "a,b,c\n1,2,3\n4,5,6";
    expect(parseCsv(csv)).toEqual({
      header: ["a", "b", "c"],
      rows: [
        ["1", "2", "3"],
        ["4", "5", "6"],
      ],
    });
  });

  test("ignora líneas vacías", () => {
    const csv = "a,b\n1,2\n\n3,4\n";
    expect(parseCsv(csv).rows).toEqual([
      ["1", "2"],
      ["3", "4"],
    ]);
  });

  test("texto vacío da tabla vacía", () => {
    expect(parseCsv("")).toEqual({ header: [], rows: [] });
  });
});
