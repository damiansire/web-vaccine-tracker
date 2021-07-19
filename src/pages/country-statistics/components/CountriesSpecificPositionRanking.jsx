import React, { useState, useEffect } from "react";
import { getLastDataCountries } from "../../../adapters/rankings.js";

function CountriesSpecificPositionRanking(props) {
  const [actualCountryRankingData, setActualCountryRankingData] = useState([]);

  const countryId = props.countryName;
  useEffect(() => {
    getLastDataCountries().then((data) => {
      const fieldsToMakeRanking = [
        "daily_vaccinations",
        "daily_vaccinations_per_million",
        "people_fully_vaccinated",
        "people_fully_vaccinated_per_hundred",
        "people_vaccinated",
        "people_vaccinated_per_hundred",
        "total_dose_vaccinations",
      ];
      let actualCountryRanking = {};
      actualCountryRanking.date = data.find(
        (country) => country.countryId === countryId
      )?.date;
      for (let field of fieldsToMakeRanking) {
        let clearData = data.filter((country) => country[field] !== "");
        let orderRanking = clearData.sort(function (a, b) {
          return b[field] - a[field];
        });
        let countryPosition = orderRanking.findIndex(
          (country) => country.countryId === countryId
        );
        actualCountryRanking[field] = countryPosition;
      }
      setActualCountryRankingData(actualCountryRanking);
    });
  }, [countryId]);

  return (
    <div>
      <table>
        <caption>Ranking de paises:</caption>
        <caption>
          Ejemplo: {countryId} ocupa el puesto
          {actualCountryRankingData.daily_vaccinations} que mas vacuno el
          {actualCountryRankingData.date}
        </caption>
        <tbody>
          <tr>
            <th className="bg-blue-100 border text-center p-2">Vacunacion diaria</th>
            <td className="border text-center p-2">
              {actualCountryRankingData.daily_vaccinations}
            </td>
            <th className="bg-blue-100 border text-center p-2">
              Vacunacion hoy millon/habitantes
            </th>
            <td className="border text-center p-2">
              {actualCountryRankingData.daily_vaccinations_per_million}
            </td>
          </tr>

          <tr>
            <th className="bg-blue-100 border text-center p-2">
              Total de inmunizadas
            </th>
            <td className="border text-center p-2">
              {actualCountryRankingData.people_fully_vaccinated}
            </td>
            <th className="bg-blue-100 border text-center p-2">
              Total inmunizadas % Poblacion
            </th>
            <td className="border text-center p-2">
              {actualCountryRankingData.people_fully_vaccinated_per_hundred}
            </td>
          </tr>

          <tr>
            <th className="bg-blue-100 border text-center p-2">Personas vacunadas</th>
            <td className="border text-center p-2">
              {actualCountryRankingData.people_vaccinated}
            </td>
            <th className="bg-blue-100 border text-center p-2">
              Personas vacunadas % Poblacion
            </th>
            <td className="border text-center p-2">
              {actualCountryRankingData.people_vaccinated_per_hundred}
            </td>
          </tr>

          <tr>
            <th className="bg-blue-100 border text-center p-2">
              Total de dosis dadas
            </th>
            <td className="border text-center p-2">
              {actualCountryRankingData.total_dose_vaccinations}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CountriesSpecificPositionRanking;
