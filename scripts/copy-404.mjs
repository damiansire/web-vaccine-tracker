import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// GitHub Pages no sabe de rutas cliente: una recarga/deep-link a
// /pais/argentina pega contra el servidor estático, que no tiene ese
// archivo y sirve 404.html. Copiar el mismo index.html construido (no un
// stub aparte) funciona porque sus referencias a assets ya son absolutas
// bajo el base del repo (`/web-vaccine-tracker/assets/...`) — resuelven
// igual sin importar la profundidad de la URL que pidió el 404. wouter
// lee `window.location.pathname` en el boot normal de App.tsx, así que la
// ruta pedida se renderiza correcta sin un redirect intermedio.
const dist = fileURLToPath(new URL("../dist", import.meta.url));
copyFileSync(`${dist}/index.html`, `${dist}/404.html`);
