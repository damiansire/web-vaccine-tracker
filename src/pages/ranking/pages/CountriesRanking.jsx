import React, { useState, useEffect } from "react";

import { getLastDataCountries } from "../../../adapters/rankings.js";

import TableRanking from "../components/TableRanking";

import Grid from "@material-ui/core/Grid";
import RankingTypesButtons from "../dummy-components/RankingTypesButtons.jsx";

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
    {
      title: "Vacunas aplicadas hoy",
      usedOnlyTodayData: false,
      attribute: "daily_vaccinations",
    },
    {
      title: "Vacunas aplicadas hoy por millon",
      usedOnlyTodayData: false,
      attribute: "daily_vaccinations_per_million",
    },
    {
      title: "Inmunisadas",
      usedOnlyTodayData: false,
      attribute: "people_fully_vaccinated",
    },

    {
      title: "Inmunisadas por 100/K",
      usedOnlyTodayData: false,
      attribute: "people_fully_vaccinated_per_hundred",
    },
    {
      title: "Vacunas que aplica",
      usedOnlyTodayData: false,
      attribute: "vaccine_type",
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        {!!lastDataCountries.length && (
          <TableRanking
            title={rankingTablesOptions[0].title}
            data={
              rankingTablesOptions[0].usedOnlyTodayData
                ? lastDataCountries
                : lastDataCountries
            }
            attribute={rankingTablesOptions[0].attribute}
          />
        )}
      </Grid>
      <Grid item xs={4}>
        <RankingTypesButtons
          rankingTablesOptions={rankingTablesOptions}
        ></RankingTypesButtons>
      </Grid>
    </Grid>
  );
};

export default CountriesRanking;
