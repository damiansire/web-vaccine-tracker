import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  TextField,
} from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import { getAvailablesCountries } from "../adapters/countries.js";

//Components
import CountriesGraphs from "../components/CountriesGraphs";
import CompareCountriesTable from "../components/CompareCountriesTable";
import DoubleButton from "../components/DoubleButton";

const { sortDateAsc } = require("../utils/sorts");
const { normalizeCountries } = require("../utils/missingDate");

const useStyles = makeStyles((theme) => ({
  selectionOption: {
    marginTop: 30,
  },
  columnLayout: {
    height: "100%",
  },
  optionElement: {
    marginBottom: 10,
    textAlign: "center",
  },
}));

const CountriesData = () => {
  const classes = useStyles();

  const [loadCountryData, setLoadCountryData] = useState(false);
  const [selectedCountriesData, setCountriesDataState] = useState({});
  const [graphType, setGraphType] = useState("line");
  const [selectedCountries, setSelectedCountries] = useState([
    "Argentina",
    "Uruguay",
    "Chile",
    "Colombia",
  ]);
  const [viewInfo, setViewInfo] = useState("Graph");

  const [availablesCountries, setAvailablesCountries] = useState([]);

  const [sameOrigin, setSameOrigin] = useState(false);

  useEffect(() => {
    getAvailablesCountries().then((data) => {
      setAvailablesCountries(data);
    });
  }, []);

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

      let countriesDataFromCached = selectedCountries.map((countryName) => {
        return {
          name: countriesDataCached[countryName]["countryName"],
          data: countriesDataCached[countryName]["data"],
        };
      });

      //Agrega las fechas que faltan en los datos, para que todos los paises
      //Tengan la misma cantidad de elementos
      debugger;
      if (!sameOrigin) {
        countriesDataFromCached = normalizeCountries(countriesDataFromCached);
      }

      //Ordena los paises
      countriesDataFromCached = countriesDataFromCached.map((country) => {
        return {
          name: country.name,
          data: country.data.sort((a, b) => sortDateAsc(a, b)),
        };
      });
      return countriesDataFromCached;
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
  }, [selectedCountries, sameOrigin]);

  const handleSelectGraphType = (event) => {
    //Arreglar esto en un futuro xD
    if (event.target.parentElement.value) {
      setGraphType(event.target.parentElement.value);
    } else if (event.target.value) {
      setGraphType(event.target.value);
    }
  };

  const renderSelect = (option, { selected }) => {
    return (
      <React.Fragment>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
          value={option}
        />
        {option}
      </React.Fragment>
    );
  };

  const selectDataAttribute = (event) => {
    console.log(event.target.value);
  };

  const selectViewData = (event) => {
    //Arreglar esto en un futuro xD
    if (event.target.parentElement.value) {
      setViewInfo(event.target.parentElement.value);
    } else if (event.target.value) {
      setViewInfo(event.target.value);
    }
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
                setSelectedCountries(newInputValue.map((element) => element));
              }}
              multiple
              id="checkboxes-tags-demo"
              options={availablesCountries}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              renderOption={renderSelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Elije un pais"
                  placeholder="Haz click y elige un pais :) "
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
              {viewInfo === "Graph" && (
                <CountriesGraphs
                  optionsSelectedData="daily_vaccinations"
                  countriesData={selectedCountriesData}
                  graphType={graphType}
                />
              )}
              {viewInfo === "Table" && (
                <CompareCountriesTable countriesData={selectedCountriesData} />
              )}
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
                  <DoubleButton
                    buttonsHandle={selectViewData}
                    buttonsDescription="Como ver la informacion:"
                    button1Text="Grafico"
                    valueButton1="Graph"
                    button2Text="Tabla"
                    valueButton2="Table"
                    selectedOption={viewInfo}
                  />
                </Grid>

                <Grid>
                  <DoubleButton
                    buttonsDescription="Selecciona tipo de grafica:"
                    buttonsHandle={handleSelectGraphType}
                    button1Text="Lineas"
                    valueButton1="line"
                    button2Text="Barra"
                    valueButton2="bar"
                    selectedOption={graphType}
                  />
                </Grid>

                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sameOrigin}
                        onChange={() => {
                          setSameOrigin(!sameOrigin);
                        }}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label="Mover al inicio"
                  />
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
        </Grid>
      )}
    </div>
  );
};

export default CountriesData;
