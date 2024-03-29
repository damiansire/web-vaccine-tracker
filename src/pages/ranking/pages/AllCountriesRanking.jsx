import React, { useState, useEffect } from "react";

import { getLastDataCountries } from "../../../adapters/rankings.js";

import TableRanking from "../components/TableRanking";
import RankingTypesButtons from "../dummy-components/RankingTypesButtons.jsx";

const AllCountriesRanking = () => {
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

  /*
,
    {
      title: "Vacunas que aplica",
      buttonText: "Vacunas que aplica",
      usedOnlyTodayData: false,
      attribute: "vaccine_type",
    },
  */
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
    <div className="grid grid-rows-12">
      <div className="row-span-2">
        <div>
          <RankingTypesButtons
            isRanking={true}
            rankingTablesOptions={rankingTablesOptions}
            selectOption={setOptionHandle}
          ></RankingTypesButtons>
        </div>
      </div>
      <div className="row-span-10">
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
      </div>
    </div>
  );
};

export default AllCountriesRanking;
