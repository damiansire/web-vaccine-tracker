import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import { Col, Row, Container } from "react-bootstrap";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  TextField,
} from "@material-ui/core";
//Components
import CountriesGraphs from "../components/CountriesGraphs.jsx";
import CompareCountriesTable from "../components/CompareCountriesTable.jsx";

const { sortDateAsc } = require("../utils/sorts");

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const CountriesData = () => {
  const classes = useStyles();

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
          data: country.data.map((dataPoint) =>
            dataPoint["daily_vaccinations"]
              ? dataPoint["daily_vaccinations"]
              : 0
          ),
        };
      });
      let newData = getGraphObj(dateForGraph, vaccineCountries);
      setGraphState(newData);
      setLoadCountryData(true);
    };

    setSelectedCountriesData();
  }, [selectedCountries]);

  const handleSelectGraphType = (event) => {
    setGraphType(event.target.value);
  };
  return (
    <div className="app">
      {loadCountryData && (
        <>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
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
          </div>

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

          <div className="row">
            <CountriesGraphs
              options={state.options}
              series={state.series}
              type={graphType}
            />
            <CompareCountriesTable
              options={state.options}
              series={state.series}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CountriesData;
