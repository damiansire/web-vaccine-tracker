import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Checkbox,
  TextField,
} from "@material-ui/core";

import {
  getAvailablesCountries,
  getCountryData,
} from "../../../adapters/countries.js";

//Components
import CountriesGraphs from "../components/CountriesGraphs";
import CompareCountriesTable from "../components/CompareCountriesTable";
import DoubleButton from "../components/DoubleButton";
import SelectCountry from "../components/SelectCountryComponent/SelectCountry";
const { sortDateAsc } = require("../../../utils/sorts");
const { normalizeCountries } = require("../../../utils/missingDate");

const CountriesData = () => {
  const [loadCountryData, setLoadCountryData] = useState(false);
  const [selectedCountriesData, setCountriesDataState] = useState({});
  const [graphType, setGraphType] = useState("line");
  const [viewInfo, setViewInfo] = useState("Graph");
  const [availablesCountries, setAvailablesCountries] = useState([]);
  const [sameOrigin, setSameOrigin] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState("daily_vaccinations");
  const [selectedCountries, setSelectedCountries] = useState([
    "Argentina",
    "Uruguay",
    "Chile",
    "Colombia",
  ]);

  const countryAttributeNames = [
    {
      key: "daily_vaccinations",
      text: "Vacunacion diaria",
    },
    {
      key: "daily_vaccinations_per_million",
      text: "Vacunacion diaria por millon",
    },
    {
      key: "people_fully_vaccinated",
      text: "Personas full vacunas",
    },
    {
      key: "people_fully_vaccinated_per_hundred",
      text: "Full vacunadas por 100K",
    },
    { key: "people_vaccinated", text: "Vacunadas" },
    {
      key: "people_vaccinated_per_hundred",
      text: "Vacunadas por 100k",
    },
    {
      key: "total_dose_vaccinations",
      text: "Total de dosis aplicadas",
    },
    { key: "vaccine_type", text: "Tipo de vacuna" },
  ];

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
            return getCountryData(country);
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

  const selectViewData = (event) => {
    if (event.target.parentElement.value) {
      setViewInfo(event.target.parentElement.value);
    } else if (event.target.value) {
      setViewInfo(event.target.value);
    }
  };

  return (
    <>
      {loadCountryData && (
        <div className="grid grid-cols-12 justify-items-center gap-4 min-h-full">
          <div className="col-span-2 grid grid-cols-1 justify-items-center gap-4 align-middle">
            <div className="col-span-1">
              <FormControl>
                <InputLabel htmlFor="age-native-simple">Dato a ver</InputLabel>
                <Select
                  variant="outlined"
                  native
                  onChange={(event) => {
                    setSelectedProperty(event.target.value);
                  }}
                >
                  {countryAttributeNames.map((dataOption) => (
                    <option value={dataOption.key} key={dataOption.key}>
                      {dataOption.text}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="col-span-1">
              <DoubleButton
                buttonsHandle={selectViewData}
                button1Text="Grafico"
                valueButton1="Graph"
                button2Text="Tabla"
                valueButton2="Table"
                selectedOption={viewInfo}
              />
            </div>

            <div className="col-span-1">
              {viewInfo === "Graph" && (
                <DoubleButton
                  buttonsHandle={handleSelectGraphType}
                  button1Text="Lineas"
                  valueButton1="line"
                  button2Text="Barra"
                  valueButton2="bar"
                  selectedOption={graphType}
                />
              )}
            </div>

            <div className="col-span-1">
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
            </div>
          </div>

          <div className="col-span-8 w-full justify-items-center gap-4 align-middle">
            {viewInfo === "Graph" && (
              <CountriesGraphs
                optionsSelectedData={selectedProperty}
                countriesData={selectedCountriesData}
                graphType={graphType}
              />
            )}
            {viewInfo === "Table" && (
              <CompareCountriesTable
                countriesData={selectedCountriesData}
                optionsSelectedData={selectedProperty}
              />
            )}
          </div>

          <div className="col-span-2 max-h-screen h-screen">
            <SelectCountry
              availablesCountries={availablesCountries}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CountriesData;
