import React from "react";

const CountryDataTable = (props) => {
  let data = props.countryData.data;
  return (
    <table class="shadow-lg bg-white">
      <tr>
        <th rowspan="2" class="bg-blue-100 border text-center p-2">
          Fecha
        </th>
        <th rowspan={data.length + 2}></th>
        <th colspan="2" class="bg-blue-100 border text-center p-2">
          Vacunas ese dia
        </th>
        <th rowspan={data.length + 2}> </th>
        <th colspan="2" class="bg-blue-100 border text-center p-2">
          Acumulado Personas
        </th>
        <th rowspan={data.length + 2}></th>
        <th colspan="2" class="bg-blue-100 border text-center p-2">
          Inmunizadas
        </th>
        <th rowspan={data.length + 2}></th>
        <th rowspan="2" class="bg-blue-100 border text-center p-2">
          Total de dosis
        </th>
      </tr>
      <tr>
        <th class="bg-blue-100 border text-center p-2">Cantidad</th>
        <th class="bg-blue-100 border text-center p-2">Millon/Hab</th>
        <th class="bg-blue-100 border text-center p-2">Vacunadas</th>
        <th class="bg-blue-100 border text-center p-2">100.000/Hab</th>
        <th class="bg-blue-100 border text-center p-2">Cantidad</th>
        <th class="bg-blue-100 border text-center p-2">100.000/Hab</th>
      </tr>

      {data.map((row) => {
        return (
          <>
            <tr>
              <td class="border text-center p-2">{row.date}</td>
              <td class="border text-center p-2">{row.daily_vaccinations}</td>
              <td class="border text-center p-2">
                {row.daily_vaccinations_per_million}
              </td>
              <td class="border text-center p-2">{row.people_vaccinated}</td>
              <td class="border text-center p-2">
                {row.people_vaccinated_per_hundred}
              </td>
              <td class="border text-center p-2">
                {row.people_fully_vaccinated}
              </td>
              <td class="border text-center p-2">
                {row.people_fully_vaccinated_per_hundred}
              </td>
              <td class="border text-center p-2">
                {row.total_dose_vaccinations}
              </td>
            </tr>
          </>
        );
      })}
    </table>
  );
};

export default CountryDataTable;
