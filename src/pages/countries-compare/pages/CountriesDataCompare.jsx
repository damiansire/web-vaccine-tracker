import React, { useState, useEffect } from "react";

import OptionsSelected from "../components/SelectCountryComponent/OptionsSelected";

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Checkbox,
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
  const [searchTerm, setSearchTerm] = useState("");
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
        <div className="grid grid-cols-12 justify-items-center gap-4">
          <div className="col-span-10 w-full justify-items-center gap-4 align-middle">
            <div className="">
              <OptionsSelected
                selectedCountries={selectedCountries}
                setSelectedCountries={setSelectedCountries}
              />
            </div>

            <div className="grid grid-cols-4 flex flex-col justify-items-center gap-4 align-middle p-4">
              <div className="col-span-1 my-1">
                <FormControl>
                  <InputLabel htmlFor="age-native-simple">
                    Dato a ver
                  </InputLabel>
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

              <div className="col-span-1 my-1">
                <DoubleButton
                  buttonsHandle={selectViewData}
                  button1Text="Grafico"
                  valueButton1="Graph"
                  button2Text="Tabla"
                  valueButton2="Table"
                  selectedOption={viewInfo}
                />
              </div>

              <div className="col-span-1 my-1">
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

              <div className="col-span-1 my-1 text-center">
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

            <div>
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
          </div>

          <div className="col-span-2 ">
            <div className="relative my-2">
              <input
                type="search"
                className="bg-purple-white shadow rounded border-1 p-3 focus:bg-white focus:border-blue-400"
                placeholder="Buscar pais..."
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
              <svg
                version="1.1"
                space-x-1
                className="h-4 text-dark inline ml-2"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 52.966 52.966"
              >
                <path
                  d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21
        c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279
        C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19
        S32.459,40,21.983,40z"
                />
              </svg>
            </div>

            <SelectCountry
              availablesCountries={availablesCountries}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CountriesData;
