import React, { useState, useEffect } from "react";

import { getLastDataCountries } from "../adapters/rankings.js";

import TableRanking from "../components/TableRanking";

import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";

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
        <h5>Elige el tipo de ranking</h5>
        <Button variant="contained" color="primary">
          Ranking por 100k
        </Button>
      </Grid>
    </Grid>
  );
};

export default CountriesRanking;
