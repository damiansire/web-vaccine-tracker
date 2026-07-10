import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

// Presupuesto sobre el chunk de ENTRADA (index-*.js), no sobre dist/ entero:
// los ~217 chunks por país (react-svg-worldmap/ECharts los cargan lazy, uno
// por país visitado) crecen con el dataset, no con el código — no son la
// señal que este gate quiere vigilar. El import modular de echarts (ver
// src/lib/echartsCore.ts) es justamente lo que mantiene este número bajo;
// sin un gate, una regresión (ej. volver a `echarts-for-react` completo)
// pasaría desapercibida hasta que alguien lo notara a ojo.
const BUDGET_GZIP_BYTES = 100 * 1024;

const distAssets = join(process.cwd(), "dist", "assets");
const entryFile = readdirSync(distAssets).find((f) => /^index-.*\.js$/.test(f));

if (!entryFile) {
  console.error(`check-bundle-size: no se encontró index-*.js en ${distAssets} (¿corriste "vite build" antes?)`);
  process.exit(1);
}

const gzipBytes = gzipSync(readFileSync(join(distAssets, entryFile))).length;
const gzipKb = (gzipBytes / 1024).toFixed(1);
const budgetKb = (BUDGET_GZIP_BYTES / 1024).toFixed(0);

if (gzipBytes > BUDGET_GZIP_BYTES) {
  console.error(`check-bundle-size: ${entryFile} pesa ${gzipKb}KB gzip, supera el presupuesto de ${budgetKb}KB`);
  process.exit(1);
}

console.log(`check-bundle-size: ${entryFile} = ${gzipKb}KB gzip (presupuesto ${budgetKb}KB) OK`);
