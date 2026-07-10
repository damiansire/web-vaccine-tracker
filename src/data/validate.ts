import type { LastDataRow } from "./types";

/** Guard runtime en el boundary del JSON generado a build-time — sin esto,
 * `lastDataJson as LastDataRow[]` confía ciegamente en que el generador
 * nunca produjo un shape roto; si algún día lo hace, el error aparecería
 * silenciosamente aguas abajo (un `row.countryId` undefined en medio del
 * render) en vez de acá, en el punto exacto de entrada. No usa una librería
 * de schema (Zod/Valibot): el shape es chico y fijo, un chequeo estructural
 * alcanza sin sumar una dependencia nueva. */
export function assertLastDataRows(data: unknown): asserts data is LastDataRow[] {
  if (!Array.isArray(data)) {
    throw new Error(`last-data.json: se esperaba un array, se recibió ${typeof data}`);
  }
  data.forEach((row, i) => {
    if (typeof row !== "object" || row === null || typeof (row as Record<string, unknown>).countryId !== "string") {
      throw new Error(`last-data.json: fila ${i} sin "countryId" de tipo string`);
    }
  });
}
