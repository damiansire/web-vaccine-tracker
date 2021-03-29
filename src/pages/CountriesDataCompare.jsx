import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  TextField,
  FormHelperText,
} from "@material-ui/core";

import Grid from "@material-ui/core/Grid";

//Components
import CountriesGraphs from "../components/CountriesGraphs.jsx";
import CompareCountriesTable from "../components/CompareCountriesTable.jsx";

const { sortDateAsc } = require("../utils/sorts");

const useStyles = makeStyles((theme) => ({
  selectionOption: {
    marginTop: 30,
  },
  columnLayout: {
    height: "100%",
  },
}));

const CountriesData = () => {
  const classes = useStyles();

  const [loadCountryData, setLoadCountryData] = useState(false);
  const [selectedCountriesData, setCountriesDataState] = useState({});
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
        data: countryVaccinesData,
        countryName: countryId,
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
              `http://localhost:3005/api/v1/countries/${country}`
            );
            return countryResponse.json();
          })
        );

        contriesData.forEach((countryData) => {
          countryData["data"] = countryData["data"].sort((a, b) =>
            sortDateAsc(a, b)
          );

          saveCountryDataInCached(
            countryData["countryName"],
            countryData["data"]
          );
        });
      }
      return selectedCountries.map((countryName) => {
        return {
          name: countriesDataCached[countryName]["countryName"],
          data: countriesDataCached[countryName]["data"],
        };
      });
    };

    const setSelectedCountriesData = async () => {
      let selectedCountryData = await getSelectedCountriesDataForGraph();
      //TODO: Controlar caso en el que no hay paises seleccionados
      if (selectedCountryData.length === 0) {
        return;
      }
      setCountriesDataState(selectedCountryData);
      setLoadCountryData(true);
    };

    setSelectedCountriesData();
  }, [selectedCountries]);

  const handleSelectGraphType = (event) => {
    setGraphType(event.target.value);
  };

  const renderSelect = (option, { selected }) => {
    return (
      <React.Fragment>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
          value={option.countryId}
        />
        {option.countryId}
      </React.Fragment>
    );
  };

  const selectDataAttribute = (event) => {
    console.log(event.target.value);
  };

  return (
    <div className="app">
      {loadCountryData && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              ListboxProps={{ style: { maxHeight: "150px" } }}
              fullWidth={true}
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
              renderOption={renderSelect}
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

          <Grid
            container
            xs={12}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={10}>
              <CountriesGraphs
                optionsSelectedData="daily_vaccinations"
                countriesData={selectedCountriesData}
                graphType={graphType}
              />
            </Grid>

            <Grid item xs={2} className={classes.columnLayout}>
              <Grid
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
                className={classes.columnLayout}
              >
                <Grid>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Tipo de grafica
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={graphType}
                      onChange={handleSelectGraphType}
                    >
                      <MenuItem value={"line"}>Graficos de Lineas</MenuItem>
                      <MenuItem value={"bar"}>Graficos de Barra</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControl>
                    <InputLabel htmlFor="age-native-simple">
                      Dato a ver
                    </InputLabel>
                    <Select
                      variant="outlined"
                      native
                      onChange={selectDataAttribute}
                    >
                      {[
                        "Vacunados por dia",
                        "Dosis dadas",
                        "Marca de vacunas",
                      ].map((dataOption) => (
                        <option value={dataOption} key={dataOption}>
                          {dataOption}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={10}>
            <CompareCountriesTable countriesData={selectedCountriesData} />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default CountriesData;
