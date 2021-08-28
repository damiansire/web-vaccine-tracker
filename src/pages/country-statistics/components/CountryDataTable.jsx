import React from "react";

const CountryDataTable = (props) => {
  let data = props.countryData.data;
  return (
    <table className="shadow-lg bg-white">
      <thead>
        <tr>
          <th rowSpan="2" className="bg-blue-100 border text-center sm:p-2">
            Fecha
          </th>
          <th rowSpan={data.length + 2}></th>
          <th colSpan="2" className="bg-blue-100 border text-center sm:p-2">
            Vacunas ese dia
          </th>
          <th rowSpan={data.length + 2}> </th>
          <th colSpan="2" className="bg-blue-100 border text-center sm:p-2">
            Acumulado Personas
          </th>
          <th rowSpan={data.length + 2}></th>
          <th colSpan="2" className="bg-blue-100 border text-center sm:p-2">
            Inmunizadas
          </th>
          <th rowSpan={data.length + 2}></th>
          <th rowSpan="2" className="bg-blue-100 border text-center sm:p-2">
            Total de dosis
          </th>
        </tr>
        <tr>
          <th className="bg-blue-100 border text-center sm:p-2">Cantidad</th>
          <th className="bg-blue-100 border text-center sm:p-2">Millon/Hab</th>
          <th className="bg-blue-100 border text-center sm:p-2">Vacunadas</th>
          <th className="bg-blue-100 border text-center sm:p-2">% Poblacion</th>
          <th className="bg-blue-100 border text-center sm:p-2">Cantidad</th>
          <th className="bg-blue-100 border text-center sm:p-2">% Poblacion</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          return (
            <tr key={row.date}>
              <td className="border text-center sm:p-2">{row.date}</td>
              <td></td>
              <td className="border text-center sm:p-2">{row.daily_vaccinations}</td>
              <td className="border text-center sm:p-2">
                {row.daily_vaccinations_per_million}
              </td>
              <td></td>
              <td className="border text-center sm:p-2">{row.people_vaccinated}</td>
              <td className="border text-center sm:p-2">
                {row.people_vaccinated_per_hundred}%
              </td>
              <td></td>
              <td className="border text-center sm:p-2">
                {row.people_fully_vaccinated}
              </td>
              <td className="border text-center sm:p-2">
                {row.people_fully_vaccinated_per_hundred}%
              </td>
              <td></td>
              <td className="border text-center sm:p-2">
                {row.total_dose_vaccinations}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CountryDataTable;
