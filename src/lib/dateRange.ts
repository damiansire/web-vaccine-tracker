const MS_PER_DAY = 86_400_000;

/** Array de fechas ISO día-a-día entre `from` y `to` (ambos incluidos) —
 * el "timeline" que recorre la animación de Evolución (un frame = un día
 * calendario). `from`/`to` vienen de `manifest.dateRange`, no se recalculan
 * por país: todos los países animan sobre el MISMO calendario para que la
 * comparación sea real (a diferencia de Compare "días desde el inicio",
 * que alinea por país). */
export function buildDailyRange(from: string, to: string): string[] {
  const start = Date.parse(from);
  const end = Date.parse(to);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return [];
  const days = Math.round((end - start) / MS_PER_DAY);
  return Array.from({ length: days + 1 }, (_, i) => new Date(start + i * MS_PER_DAY).toISOString().slice(0, 10));
}
