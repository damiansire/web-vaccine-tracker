import { alpha3ToAlpha2 } from "i18n-iso-countries";
import type { IsoCodeEntry } from "@/data/types";

/** OWID (y por lo tanto nuestro dataset) da alpha-3; react-svg-worldmap
 * necesita alpha-2. Países sin equivalente ISO estándar (Kosovo, Chipre del
 * Norte — OWID les da un código `OWID_*`, ya excluidos en la generación) no
 * llegan acá. Un alpha-3 real sin mapeo (rarísimo, dato desactualizado de la
 * librería) devuelve `null` en vez de reventar — el caller decide si lo
 * omite del mapa. */
export function toAlpha2(isoAlpha3: string): string | null {
  return alpha3ToAlpha2(isoAlpha3) ?? null;
}

/** Reverse-map alpha2 -> countryId de OWID. Fuente única para "¿a qué país
 * del dataset corresponde este código?" — usado tanto para armar el mapa
 * como para resolver el click, así que ambos caminos no pueden divergir (el
 * bug que corrige: react-svg-worldmap expone su PROPIO nombre de país en el
 * click, que no siempre coincide con el `location` de OWID — countryCode
 * (alpha-2) sí es una clave estable). */
export function buildCountryIdByAlpha2(isoCodes: IsoCodeEntry[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const { countryId, isoAlpha3 } of isoCodes) {
    const alpha2 = toAlpha2(isoAlpha3);
    if (alpha2) map.set(alpha2, countryId);
  }
  return map;
}
