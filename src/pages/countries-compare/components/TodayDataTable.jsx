import React from "react";

const TodayDataTable = (props) => {
  const latestNonNull = (countryData, atr) => {
    const series = countryData.data;
    if (series.length && series[series.length - 1][atr] != null) {
      return series[series.length - 1][atr];
    }
    const data = series.filter((x) => x[atr] != null);
    if (!data.length) {
      return "—";
    }
    return data[data.length - 1][atr];
  };
  const latestDataDate = (series) => {
    const withDate = series.filter((x) => x.date != null);
    if (!withDate.length) {
      return "—";
    }
    return withDate[withDate.length - 1].date;
  };
  return (
    <>
      <table className="table-fill country-compare-evolution">
        <thead>
          <tr>
            <th className="bg-blue-100 border text-center p-2">País</th>
            <th className="bg-blue-100 border text-center p-2">
              Personas vacunadas
            </th>
            <th className="bg-blue-100 border text-center p-2">
              % de la población vacunada
            </th>
            <th className="bg-blue-100 border text-center p-2">
              Personas con todas las dosis
            </th>
            <th className="bg-blue-100 border text-center p-2">
              % Población con todas las dosis
            </th>
            <th className="bg-blue-100 border text-center p-2">
              Total de dosis aplicadas
            </th>
            <th className="bg-blue-100 border text-center p-2">
              Fecha último dato
            </th>
          </tr>
        </thead>
        <tbody className="table-hover">
          {props.countriesData.map((countryData) => {
            return (
              <tr key={countryData.name}>
                <td className="border text-center p-2">{countryData.name}</td>
                <td className="border text-center p-2">
                  {latestNonNull(
                    countryData,
                    "people_vaccinated"
                  )}
                </td>
                <td className="border text-center p-2">
                  {latestNonNull(
                    countryData,
                    "people_vaccinated_per_hundred"
                  ) + "%"}
                </td>
                <td className="border text-center p-2">
                  {latestNonNull(
                    countryData,
                    "people_fully_vaccinated"
                  )}
                </td>
                <td className="border text-center p-2">
                  {`${latestNonNull(
                    countryData,
                    "people_fully_vaccinated_per_hundred"
                  )} %`}
                </td>
                <td className="border text-center p-2">
                  {latestNonNull(
                    countryData,
                    "total_dose_vaccinations"
                  )}
                </td>
                <td className="border text-center p-2">
                  {latestDataDate(countryData.data)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TodayDataTable;
