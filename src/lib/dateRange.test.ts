import { describe, expect, test } from "vitest";
import { buildDailyRange } from "./dateRange";

describe("buildDailyRange", () => {
  test("arma un array día-a-día, ambos extremos incluidos", () => {
    expect(buildDailyRange("2021-01-01", "2021-01-04")).toEqual([
      "2021-01-01",
      "2021-01-02",
      "2021-01-03",
      "2021-01-04",
    ]);
  });

  test("from === to da un array de un solo día", () => {
    expect(buildDailyRange("2021-01-01", "2021-01-01")).toEqual(["2021-01-01"]);
  });

  test("to antes que from da array vacío, no explota", () => {
    expect(buildDailyRange("2021-02-01", "2021-01-01")).toEqual([]);
  });

  test("cruza un cambio de mes correctamente", () => {
    expect(buildDailyRange("2021-01-30", "2021-02-02")).toEqual([
      "2021-01-30",
      "2021-01-31",
      "2021-02-01",
      "2021-02-02",
    ]);
  });
});
