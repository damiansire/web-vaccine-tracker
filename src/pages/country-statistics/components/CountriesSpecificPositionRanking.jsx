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
      <table className="mx-auto">
        <caption className="text-3xl">Ranking de países:</caption>
        <caption className="text-xl my-3">
          Por ejemplo: <b>{countryId}</b> ocupa el puesto <b>{actualCountryRankingData.daily_vaccinations}</b> que más vacunó el <b>{actualCountryRankingData.date}</b>
        </caption>
        <tbody>
          <tr>
            <th className="bg-blue-100 border text-center p-2">Vacunación diaria</th>
            <td className="border text-center p-2">
              {actualCountryRankingData.daily_vaccinations}
            </td>
            <th className="bg-blue-100 border text-center p-2">
              Vacunación hoy millón/habitantes
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
              Total inmunizadas % Población
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
              Personas vacunadas % Población
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
