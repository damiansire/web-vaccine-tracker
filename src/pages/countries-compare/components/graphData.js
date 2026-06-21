// Construcción de las opciones de echarts a partir de los datos de países.
// Vive aparte de CountriesGraphs.jsx (que importa echarts, ESM no transformado
// por jest) para poder testear la alineación por fecha de forma aislada.

const countryAttributeNames = {
  daily_vaccinations: "Vacunación diaria",
  daily_vaccinations_per_million: "Vacunación diaria por millón",
  people_fully_vaccinated: "Personas full vacunas",
  people_fully_vaccinated_per_hundred: "% Población Inmunizada",
  people_vaccinated: "Vacunadas",
  people_vaccinated_per_hundred: "% Población vacunada",
  total_dose_vaccinations: "Total de dosis aplicadas",
};

export const getGraphObj = (countriesData, optionSelected) => {
  // Eje X = unión ordenada de todas las fechas. Con sameOrigin cada país tiene
  // su propio set de fechas; tomar las de countriesData[0] y graficar data[i]
  // por posición desalineaba cada serie. Mapeamos cada serie por fecha real.
  let dates = Array.from(
    new Set(
      countriesData.flatMap((country) =>
        country.data.map((dataPoint) => dataPoint.date)
      )
    )
  ).sort((a, b) => new Date(a) - new Date(b));

  const countriesNames = countriesData.map((country) => country.name);

  const countriesSeriesData = countriesData.map((countryData) => {
    const valueByDate = new Map(
      countryData.data.map((dataPoint) => [
        dataPoint.date,
        dataPoint[optionSelected],
      ])
    );
    return {
      name: countryData.name,
      smooth: true,
      lineStyle: {
        width: 2,
      },
      type: "line",
      // Un valor por cada fecha del eje; null donde el país no tiene dato
      // (echarts deja un hueco en la línea, no lo corre de lugar).
      data: dates.map((date) =>
        valueByDate.has(date) ? valueByDate.get(date) : null
      ),
    };
  });

  return {
    title: {
      text: countryAttributeNames[optionSelected],
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: countriesNames,
    },

    toolbox: {
      feature: {
        magicType: { show: true, type: ["stack", "tiled"] },
        saveAsImage: {},
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: dates,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: countriesSeriesData,
  };
};
