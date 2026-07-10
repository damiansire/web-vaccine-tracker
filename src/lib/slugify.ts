/** "United Kingdom" -> "united-kingdom". Usado como nombre de archivo del dataset
 * (scripts/generate-dataset.ts) y para resolverlo en runtime (src/data/loader.ts) —
 * debe ser el mismo algoritmo en ambos lados o el loader no encuentra el archivo. */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
