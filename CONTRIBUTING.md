# Contribuir

Este repo tiene un alcance chico y deliberado (ver "Alcance" en el
README): un explorador de solo-lectura del histórico de vacunación COVID
de OWID, no un tracker en vivo ni un panel analítico multi-fuente. Esa
elección de alcance es a propósito — bajarla no es en sí un bug.

## Se aceptan

- Correcciones de bugs reales (algo que el propio dominio de la app
  promete y no cumple: un país que no carga, un cálculo mal hecho, un
  problema de accesibilidad o responsive).
- Correcciones de datos/atribución (algo mal citado sobre OWID, un link
  roto).
- Mejoras de documentación (README, `CLAUDE.md`, `src/data/README.md`).
- Traducciones adicionales si el repo llegara a soportar más de
  español/inglés (hoy es un cambio de alcance, discutilo en un issue
  primero).

## Probablemente no se acepta sin discutirlo antes

- Features que amplíen el alcance (nueva fuente de datos, ponderación por
  población, drill-down subnacional, series embebibles): son reales, pero
  quedan fuera del recorte actual — abrí un issue para discutir el alcance
  antes de invertir tiempo en el PR.
- Una segunda librería de UI/estilos o de gráficos — ver `AGENTS.md`.

## Antes de abrir el PR

Corré `npm run verify` (lint + test + build) — es el mismo gate que corre
CI. Ver [`AGENTS.md`](AGENTS.md) para el checklist completo.
