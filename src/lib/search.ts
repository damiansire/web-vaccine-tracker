/** "México" ~ "mexico": para que buscar sin acentos encuentre el país. */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function matchesQuery(candidate: string, query: string): boolean {
  const q = normalize(query.trim());
  if (!q) return true;
  return normalize(candidate).includes(q);
}
