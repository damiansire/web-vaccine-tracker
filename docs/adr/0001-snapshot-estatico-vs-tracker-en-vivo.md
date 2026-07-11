# 0001. Snapshot estático vs tracker en vivo

## Contexto

El repo nació en 2021 como tracker en vivo de vacunación COVID-19, con datos
actualizados en runtime contra una API. La pandemia terminó: OWID dejó de
recibir actualizaciones diarias de la mayoría de los países y el dominio del
proyecto pasó de "seguimiento activo" a "consulta de un evento histórico
cerrado".

## Decisión

El dataset se hornea a build-time desde el CSV público de OWID
(`npm run generate:data`) y se versiona junto al código. No hay backend, no
hay fetch en runtime, no hay API en vivo. El panel muestra el histórico
completo (217 países, desde el primer dato hasta el último) como un archivo
navegable, no como un tablero que cambia.

## Alternativas consideradas

- **Mantener el tracker en vivo**: requeriría un backend/cron que siga
  consultando la fuente de datos, pero OWID ya no publica actualizaciones
  diarias para la mayoría de los países — un "tracker en vivo" de un evento
  que terminó es lenguaje engañoso, no una funcionalidad real.
- **API en runtime contra un dataset estático hosteado aparte**: agrega una
  capa de red (latencia, posibilidad de fallo) sin ninguna ganancia, porque
  el dato no cambia entre una visita y la siguiente.

## Consecuencias

- Deploy simple (GitHub Pages, sin backend que mantener vivo).
- Cero riesgo de "pantalla en blanco por API caída" — el dato ya está en el
  bundle.
- Costo: si OWID corrige datos retroactivamente o amplía el histórico, hay
  que re-correr `npm run generate:data` y republicar (no se refleja solo).
- El README y el copy de la app deben evitar lenguaje de "en vivo" / "en
  tiempo real" heredado de la versión COVID-era (ya corregido, ver README.md).
