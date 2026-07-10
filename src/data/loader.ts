import { slugify } from "../lib/slugify";
import manifestJson from "./manifest.json";
import isoCodesJson from "./iso-codes.json";
import lastDataJson from "./last-data.json";
import type { CountryFile, IsoCodeEntry, LastDataRow, Manifest, SourcesFile } from "./types";
import { assertLastDataRows } from "./validate";

export const manifest: Manifest = manifestJson;
export const isoCodes: IsoCodeEntry[] = isoCodesJson;

assertLastDataRows(lastDataJson);
export const lastData: LastDataRow[] = lastDataJson;

/** Un país sin archivo (nombre no está en manifest.json, JSON corrupto, chunk
 * que no descarga) es un boundary, no un caso a tragar en silencio — regla h
 * del CLAUDE.md de este repo. El bug del repo anterior (home en blanco) fue
 * exactamente un import() sin manejar tumbando el Promise.all completo. */
export async function loadCountry(countryName: string): Promise<CountryFile | null> {
  const slug = slugify(countryName);
  try {
    const mod = (await import(`./countries/${slug}.json`)) as { default: CountryFile };
    return mod.default;
  } catch (error) {
    console.error(`[data/loader] no se pudo cargar el país "${countryName}" (slug "${slug}"):`, error);
    return null;
  }
}

export async function loadCountrySources(countryName: string): Promise<SourcesFile> {
  const slug = slugify(countryName);
  try {
    const mod = (await import(`./sources/${slug}.json`)) as { default: SourcesFile };
    return mod.default;
  } catch (error) {
    console.error(`[data/loader] no se pudieron cargar las fuentes de "${countryName}" (slug "${slug}"):`, error);
    return { sources: [] };
  }
}

/** Carga varios países a la vez sin que uno faltante tumbe a los demás
 * (Promise.allSettled, no Promise.all) — devuelve solo los que sí cargaron. */
export async function loadCountries(countryNames: string[]): Promise<CountryFile[]> {
  const results = await Promise.allSettled(countryNames.map(loadCountry));
  return results
    .filter((r): r is PromiseFulfilledResult<CountryFile | null> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((data): data is CountryFile => data !== null);
}
