import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import getVaccineApiEndpointForCountry from "../endpoint";
import Button from "@material-ui/core/Button";

import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Grid from "@material-ui/core/Grid";

const CountryData = () => {
  const [loadCountryData, setLoadCountryData] = useState(false);
  const [state, setGraphState] = useState({});
  const [graphType, setGraphType] = useState("line");
  const [selectedCountries, setSelectedCountries] = useState(["Argentina"]);

  const allCountries = [
    { countryId: "Uruguay" },
    { countryId: "Argentina" },
    { countryId: "Chile" },
    { countryId: "Bolivia" },
    { countryId: "Colombia" },
    { countryId: "Venezuela" },
  ];
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    //Create a cache
    const countriesDataCached = {};

    const saveCountryDataInCached = (countryId, countryVaccinesData) => {
      countriesDataCached[countryId] = {
        total_vaccines: countryVaccinesData,
        countryId: countryId,
      };
    };

    const getSelectedCountriesDataForGraph = async () => {
      //Get not cached element
      let notCachedCountries = selectedCountries.filter(
        (country) => !countriesDataCached.hasOwnProperty(country)
      );
      if (notCachedCountries.length > 0) {
        //Get countries data not cached and cached it
        let contriesData = await Promise.all(
          notCachedCountries.map(async (country) => {
            let countryResponse = await fetch(
              getVaccineApiEndpointForCountry(country)
            );
            return countryResponse.json();
          })
        );

        contriesData.forEach((countryData) => {
          saveCountryDataInCached(
            countryData["countryId"],
            countryData["vaccine"]
          );
        });
      }
      return selectedCountries.map((countryName) => {
        return {
          name: countriesDataCached[countryName]["countryId"],
          data: countriesDataCached[countryName]["total_vaccines"],
        };
      });
    };

    const getGraphObj = (dates, countriesDataArray) => {
      //Dates es un array de fechas en formato string
      //CountriesDataArray es de la forma [ { name: countryId, data: vaccineCountry } ]
      return {
        options: {
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: dates,
          },
        },
        series: countriesDataArray,
      };
    };

    const setSelectedCountriesData = async () => {
      let selectedCountryData = await getSelectedCountriesDataForGraph();
      //TODO: Controlar caso en el que no hay paises seleccionados
      if (selectedCountryData.length === 0) {
        return;
      }
      let dateForGraph = selectedCountryData[0]["data"].map(
        (country) => country["date"]
      );

      let vaccineCountries = selectedCountryData.map((country) => {
        return {
          name: country.name,
          data: country.data.map((dataPoint) => dataPoint["total_vaccines"]),
        };
      });
      let newData = getGraphObj(dateForGraph, vaccineCountries);
      setGraphState(newData);
      setLoadCountryData(true);
    };

    setSelectedCountriesData();
  }, [selectedCountries]);

  return (
    <div className="app">
      {loadCountryData && (
        <>
          <Grid container style={{ padding: 20 }}>
            <Grid
              container
              direction="row"
              item
              xs={8}
              justify="space-evenly"
              alignItems="center"
            >
              <div>
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  onClick={() => {
                    setGraphType("line");
                  }}
                >
                  Graficos de Lineas
                </Button>
              </div>
              <div>
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  onClick={() => {
                    setGraphType("bar");
                  }}
                >
                  Graficos de Barra
                </Button>
              </div>
            </Grid>
            <Grid xs={4} container alignItems="center" justify="space-evenly">
              <Grid item>
                <Autocomplete
                  onChange={(event, newInputValue) => {
                    setSelectedCountries(
                      newInputValue.map((element) => element["countryId"])
                    );
                  }}
                  multiple
                  id="checkboxes-tags-demo"
                  options={allCountries}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.countryId}
                  renderOption={(option, { selected }) => (
                    <>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.countryId}
                    </>
                  )}
                  style={{ width: 400 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select countries"
                      placeholder="Favorites"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <div className="row">
                {graphType === "bar" && (
                  <div className="mixed-chart">
                    <Chart
                      options={state.options}
                      series={state.series}
                      type={graphType}
                      width="1000"
                    />
                  </div>
                )}
                {graphType === "line" && (
                  <div className="mixed-chart">
                    <Chart
                      options={state.options}
                      series={state.series}
                      type={graphType}
                      width="1000"
                    />
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default CountryData;
