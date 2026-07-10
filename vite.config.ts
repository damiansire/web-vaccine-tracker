import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `base` NO se fija acá a "/web-vaccine-tracker/": GitHub Pages de un repo
// (no *.github.io de usuario) sirve el sitio bajo `/<repo>/`, pero fijarlo
// en el config rompería el dev server y cualquier otro build. El workflow
// de deploy (`.github/workflows/deploy-pages.yml`) pasa `--base` por CLI
// (`npm run build:pages`, ver package.json) — cross-platform, sin depender
// de sintaxis de env var de shell (Windows vs POSIX). Local/CI normal
// sigue sirviendo desde la raíz con el default de Vite.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test-setup.ts",
  },
});
