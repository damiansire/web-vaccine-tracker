import React, { useState, useEffect } from "react";

import { getLastDataCountries } from "../adapters/rankings.js";

import TableRanking from "../components/TableRanking";

const CountriesRanking = () => {
  const [lastDataCountries, setLastDataCountries] = useState([]);

  useEffect(() => {
    getLastDataCountries().then((data) => {
      setLastDataCountries(data.payload);
    });
  }, []);

  const rankingTablesOptions = [
    {
      title: "Total de vacunas dadas hasta el momento",
      usedOnlyTodayData: false,
      attribute: "total_dose_vaccinations",
    },
  ];

  return (
    <>
      <div>Estadisticas hoy</div>
      <div>
        {!!lastDataCountries.length &&
          rankingTablesOptions.map((options) => (
            <TableRanking
              title={options.title}
              data={
                options.usedOnlyTodayData
                  ? lastDataCountries
                  : lastDataCountries
              }
              attribute={options.attribute}
            />
          ))}
      </div>
    </>
  );
};

export default CountriesRanking;
