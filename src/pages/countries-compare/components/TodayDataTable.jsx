import React from "react";

const TodayDataTable = (props) => {
  const metodoHardcodeEliminarPlease = (countryData, atr) => {
    if (countryData.data[countryData.data.length - 1][atr]) {
      return countryData.data[countryData.data.length - 1][atr];
    }
    const data = countryData.data.filter((x) => x[atr] != null);
    return data[data.length - 1][atr];
  };
  const metodoHardcodeFECHAEliminarPlease = (countryData) => {
    let data = countryData.filter((x) => !Object.values(x).includes(null));
    return data[data.length - 1].date;
  };
  return (
    <>
      <table class="table-fill country-compare-evolution">
        <thead>
          <tr>
            <th class="bg-blue-100 border text-center p-2">Pais</th>
            <th class="bg-blue-100 border text-center p-2">
              Personas vacunadas
            </th>
            <th class="bg-blue-100 border text-center p-2">
              % de la población vacunada
            </th>
            <th class="bg-blue-100 border text-center p-2">
              Personas con todas las dosis
            </th>
            <th class="bg-blue-100 border text-center p-2">
              % Población con todas las dosis
            </th>
            <th class="bg-blue-100 border text-center p-2">
              Total de dosis aplicadas
            </th>
            <th class="bg-blue-100 border text-center p-2">
              Fecha ultimo dato
            </th>
          </tr>
        </thead>
        <tbody class="table-hover">
          {props.countriesData.map((countryData) => {
            return (
              <tr key={countryData.name}>
                <td class="border text-center p-2">{countryData.name}</td>
                <td class="border text-center p-2">
                  {metodoHardcodeEliminarPlease(
                    countryData,
                    "people_vaccinated"
                  )}
                </td>
                <td class="border text-center p-2">
                  {metodoHardcodeEliminarPlease(
                    countryData,
                    "people_vaccinated_per_hundred"
                  ) + "%"}
                </td>
                <td class="border text-center p-2">
                  {metodoHardcodeEliminarPlease(
                    countryData,
                    "people_fully_vaccinated"
                  )}
                </td>
                <td class="border text-center p-2">
                  {`${metodoHardcodeEliminarPlease(
                    countryData,
                    "people_fully_vaccinated_per_hundred"
                  )} %`}
                </td>
                <td class="border text-center p-2">
                  {metodoHardcodeEliminarPlease(
                    countryData,
                    "total_dose_vaccinations"
                  )}
                </td>
                <td class="border text-center p-2">
                  {metodoHardcodeFECHAEliminarPlease(countryData.data)}
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
