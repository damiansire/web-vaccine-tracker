// Construye las filas de la tabla comparativa alineadas POR FECHA.
// Con sameOrigin cada país conserva su propio set de fechas/longitud; indexar
// por posición mostraba para una fecha el valor de otra. Un Map<fecha, fila>
// garantiza que cada valor cae bajo su fecha real.
export const buildTableRows = (countriesData, selectedProp) => {
  let rowsByDate = new Map();
  const getRowForDate = (date) => {
    if (!rowsByDate.has(date)) {
      rowsByDate.set(date, { date });
    }
    return rowsByDate.get(date);
  };

  for (let selectedCountry of countriesData) {
    let countryName = selectedCountry.name;
    selectedCountry.data.forEach((dataPoint) => {
      getRowForDate(dataPoint.date)[countryName] = dataPoint[selectedProp];
    });
  }

  // Ordena por fecha y asigna un id estable (DataGrid lo exige).
  return Array.from(rowsByDate.values())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((row, index) => ({ id: index, ...row }));
};
