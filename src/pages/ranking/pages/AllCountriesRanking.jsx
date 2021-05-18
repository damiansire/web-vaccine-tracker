import React, { useState, useEffect } from "react";

import { getLastDataCountries } from "../../../adapters/rankings.js";

import TableRanking from "../components/TableRanking";
import Grid from "@material-ui/core/Grid";
import RankingTypesButtons from "../dummy-components/RankingTypesButtons.jsx";

const AllCountriesRanking = () => {
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

  const [lastDataCountries, setLastDataCountries] = useState([]);
  const [selectedOption, selectOption] = useState(rankingTablesOptions[0]);

  useEffect(() => {
    getLastDataCountries().then((data) => {
      setLastDataCountries(data);
    });
  }, []);

  const setOptionHandle = (option) => {
    selectOption(option);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        {!!lastDataCountries.length && (
          <TableRanking
            title={selectedOption.title}
            data={
              selectedOption.usedOnlyTodayData
                ? lastDataCountries
                : lastDataCountries
            }
            attribute={selectedOption.attribute}
          />
        )}
      </Grid>
      <Grid item xs={4}>
        <div>
          <RankingTypesButtons
            rankingTablesOptions={rankingTablesOptions}
            selectOption={setOptionHandle}
          ></RankingTypesButtons>
        </div>
      </Grid>
    </Grid>
  );
};

export default AllCountriesRanking;
