// Carga perezosa y cacheada del dataset estático modular (reemplazo de la API
// caída). Cada país/recurso vive en su propio JSON: con import() dinámico,
// webpack los emite como chunks separados y una pantalla solo descarga el JSON
// que realmente usa -> lazy load real, no un único blob gigante.

// Cache de promesas: la descarga de cada recurso ocurre una sola vez por sesión.
const cache = new Map();

const once = (key, loader) => {
  if (!cache.has(key)) cache.set(key, loader());
  return cache.get(key);
};

// import() puede resolver a módulo ({ default }) o al JSON directo según loader.
const unwrap = (mod) => (mod && mod.default !== undefined ? mod.default : mod);

// slug determinista, idéntico al de scripts/generate-dataset.mjs.
// "United States" -> "united-states", "Côte d'Ivoire" -> "cote-d-ivoire".
export const slugify = (name) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Rehidrata el formato columnar { fields, rows } a array de objetos.
// Es O(filas * columnas) y solo corre sobre el país pedido.
export const decodeColumnar = ({ fields, rows }) =>
  rows.map((row) => {
    const point = {};
    for (let i = 0; i < fields.length; i++) point[fields[i]] = row[i];
    return point;
  });

export const loadManifest = () =>
  once("manifest", () => import("./manifest.json").then(unwrap));

export const loadLastData = () =>
  once("last-data", () => import("./last-data.json").then(unwrap));

export const loadIsoCodes = () =>
  once("iso-codes", () => import("./iso-codes.json").then(unwrap));

// Serie temporal de un país: chunk propio + rehidratado a la forma que esperan
// las tablas ({ countryName, data: [{ date, ... }] }).
export const loadCountry = (name) =>
  once(`country:${name}`, () =>
    import(`./countries/${slugify(name)}.json`)
      .then(unwrap)
      .then((file) => ({
        countryName: file.countryName,
        data: decodeColumnar(file),
      }))
  );

// Fuentes de un país: chunk propio; país sin archivo -> lista vacía.
export const loadSources = (name) =>
  once(`sources:${name}`, () =>
    import(`./sources/${slugify(name)}.json`)
      .then(unwrap)
      .then((file) => file.sources)
      .catch(() => [])
  );
