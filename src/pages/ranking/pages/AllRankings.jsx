import React, { useState, useEffect } from "react";

import { getLastDataCountries } from "../../../adapters/rankings.js";

import TableRanking from "../components/TableRanking";
import SquareGraph from "../../../shared/graphs/Square-Graph"


function AllRankings() {
  const rankingTablesOptions = [
    {
      title: "Total de vacunas dadas hasta el momento",
      buttonText: "Total de vacunas",
      usedOnlyTodayData: false,
      attribute: "total_dose_vaccinations",
    },
    {
      title: "Vacunas aplicadas hoy",
      buttonText: "Vacunas aplicadas hoy",
      usedOnlyTodayData: false,
      attribute: "daily_vaccinations",
    },
    {
      title: "Vacunas aplicadas hoy por millón",
      buttonText: "Vacunas aplicadas hoy por millón",
      usedOnlyTodayData: false,
      attribute: "daily_vaccinations_per_million",
    },
    {
      title: "Inmunizadas",
      buttonText: "Inmunizadas",
      usedOnlyTodayData: false,
      attribute: "people_fully_vaccinated",
    },

    {
      title: "Inmunizadas por 100/K",
      buttonText: "Inmunizadas por 100/K",
      usedOnlyTodayData: false,
      attribute: "people_fully_vaccinated_per_hundred",
    },
  ];

  const [lastDataCountries, setLastDataCountries] = useState([]);

  useEffect(() => {
    getLastDataCountries().then((data) => {
      setLastDataCountries(data);
      console.log(data);
    });
  }, []);

  return (
    <div className="grid grid-rows-12 grid-cols-6 px-4">
      {!!lastDataCountries.length &&
        rankingTablesOptions.map((option) => {
          return (
            <div className="col-span-2 px-4">
              <TableRanking
                title={option.title}
                data={lastDataCountries}
                attribute={option.attribute}
                small={true}
              />
              <SquareGraph />
            </div>
          );
        })}
    </div>
  );
}

export default AllRankings;
