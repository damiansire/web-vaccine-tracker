export interface CsvTable {
  header: string[];
  rows: string[][];
}

/** Parser mínimo: el CSV de OWID no tiene campos entre comillas ni comas
 * escapadas (verificado contra la fuente real) — un split(",") por línea
 * alcanza. Si la fuente cambiara de formato, esto rompe fuerte y visible
 * (columnas desalineadas), no en silencio. */
export function parseCsv(text: string): CsvTable {
  const lines = text.split("\n").filter((line) => line.length > 0);
  const header = lines[0];
  if (!header) {
    return { header: [], rows: [] };
  }
  const rows = lines.slice(1).map((line) => line.split(","));
  return { header: header.split(","), rows };
}
