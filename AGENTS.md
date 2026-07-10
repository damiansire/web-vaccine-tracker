# AGENTS.md

Guía para cualquier agente (o humano) que abra este repo. La barra de
calidad completa vive en [`CLAUDE.md`](CLAUDE.md) — no la dupliques acá,
léela antes de tocar código. Esto es el checklist operativo.

## Checklist pre-PR (numerado, en orden)

1. `npm run verify` en verde (lint + test + build) — es literalmente el
   mismo comando que corre CI.
2. Si tocaste dominio/lógica (no solo estilos/copy), agregá o actualizá un
   test que lo cubra.
3. Si tomaste una decisión no obvia (elegiste A sobre B, descartaste un
   hallazgo, te desviaste del patrón existente), dejá una línea en
   [`_audits/DECISIONES.md`](_audits/DECISIONES.md) con el porqué.
4. Si agregaste una regla nueva de arquitectura/stack, reflejala en
   `CLAUDE.md` — no dejes la barra desactualizada respecto al código real.
5. Verificá visualmente en el navegador cualquier cambio de UI antes de
   darlo por terminado (no alcanza con "compila y los tests pasan").

## STOP-signs (parar y preguntar, no improvisar)

- **Nunca** `git push` ni ninguna operación de escritura a GitHub sin
  pedido explícito — el dueño del repo lo hace a mano.
- **Nunca** agregar una segunda librería de UI/estilos (el repo anterior
  tenía cuatro sistemas de estilo compitiendo — ver `CLAUDE.md`).
- **Nunca** volver a `echarts-for-react`; el wrapper propio
  (`src/components/EChart.tsx`) existe porque ese paquete tiene un bug real
  de interop con Vite (ver `_audits/DECISIONES.md`).
- **Nunca** hacer fetch en runtime al dataset de OWID — el dominio está
  cerrado, el dataset se hornea a build-time (`npm run generate:data`) y se
  versiona junto al código.
- Si un cambio requiere instalar una dependencia nueva, pará y justificá
  por qué el problema no se resuelve con lo que ya está — el patrón de este
  repo es preferir código chico propio sobre una dependencia (ver el
  wrapper de EChart, o `assertLastDataRows` en vez de Zod).
