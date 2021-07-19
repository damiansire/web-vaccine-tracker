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
import SquareGraph from "../../../components/graphs/Square-Graph";
import TodayDataTable from "../components/TodayDataTable";
const { sortDateAsc } = require("../../../utils/sorts");
const { normalizeCountries } = require("../../../utils/missingDate");

const CountriesData = () => {
  const [loadCountryData, setLoadCountryData] = useState(false);
  const [selectedCountriesData, setCountriesDataState] = useState({});
  const [viewInfo, setViewInfo] = useState("Graph");
  const [availablesCountries, setAvailablesCountries] = useState([]);
  const [sameOrigin, setSameOrigin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(
    "people_vaccinated_per_hundred"
  );
  const [selectedCountries, setSelectedCountries] = useState([
    "Argentina",
    "Uruguay",
    "Chile",
    "Colombia",
  ]);

  const countryAttributeNames = [
    {
      key: "people_vaccinated_per_hundred",
      text: "% Poblacion vacunada",
    },
    {
      key: "people_fully_vaccinated_per_hundred",
      text: "% Poblacion Inmunizada",
    },
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
    { key: "people_vaccinated", text: "Vacunadas" },
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

  const countryAttributeDescripcion = {
    people_fully_vaccinated_per_hundred:
      "Porcentaje de la población que ha recibido todas las dosis de las vacunas.",
    people_vaccinated_per_hundred:
      "Porcentaje de la poblacion con al menos una dosis",
    daily_vaccinations: "Cantidad total de dosis administradas el día de hoy.",
    daily_vaccinations_per_million:
      "Cantidad total de dosis aplicadas el dia de hoy por millon de habitantes",
    people_fully_vaccinated:
      "Cantidad de personas que han recibido todas las dosis de las vacunas.",
    people_vaccinated: "Cantidad de personas vacunadas con al menos una dosis.",
    total_dose_vaccinations:
      "Total de dosis aplicadas. Si una persona se da 2 dosis, se cuenta dos veces.",
    vaccine_type: "Tipo de vacuna",
  };

  const countryAttributeNamesTranslate = {
    people_vaccinated_per_hundred: "% Poblacion vacunada",
    people_fully_vaccinated_per_hundred: "% Poblacion Inmunizada",
    daily_vaccinations: "Vacunacion diaria",
    daily_vaccinations_per_million: "Vacunacion diaria por millon",
    people_fully_vaccinated: "Personas full vacunas",
    people_vaccinated: "Vacunadas",
    total_dose_vaccinations: "Total de dosis aplicadas",
    vaccine_type: "Tipo de vacuna",
  };

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
            <div className="grid grid-cols-12 m-2">
              <div className="col-start-4 col-span-7 text-center text-3xl self-center">
                GRAFICO DE EVOLUCIÓN
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
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-2 flex flex-col justify-items-center gap-4 align-middle p-4">
                <div className="col-start-2 col-span-1 my-1">
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

                <div className="col-span-1 bg-gray-200  justify-center items-center">
                  <div className="max-w-sm bg-white border-2 border-gray-300 p-6 rounded-md tracking-wide shadow-lg">
                    <div
                      id="header"
                      className="flex items-center place-content-center mb-4"
                    >
                      <div id="header-text" className="leading-5  sm">
                        <h4 id="name" className="text-lg font-semibold text-center">
                          {countryAttributeNamesTranslate[selectedProperty]}
                        </h4>
                      </div>
                    </div>
                    <div id="quote">
                      <p className="italic text-gray-600">
                        {countryAttributeDescripcion[selectedProperty]}
                      </p>
                    </div>
                  </div>
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
                    label="Mover graficas al 0"
                  />
                </div>
                <span className="text-center font-medium">
                  Paises seleccionados
                </span>
                <OptionsSelected
                  selectedCountries={selectedCountries}
                  setSelectedCountries={setSelectedCountries}
                />
              </div>
              <div className="col-span-10">
                {viewInfo === "Graph" && (
                  <CountriesGraphs
                    optionsSelectedData={selectedProperty}
                    countriesData={selectedCountriesData}
                  />
                )}
                {viewInfo === "Graph" && (
                  <div className="text-center font-medium my-3">
                    Comparación de la situación de paises
                  </div>
                )}
                {viewInfo === "Graph" && (
                  <TodayDataTable countriesData={selectedCountriesData} />
                )}
                {viewInfo === "Table" && (
                  <CompareCountriesTable
                    countriesData={selectedCountriesData}
                    optionsSelectedData={selectedProperty}
                  />
                )}
              </div>
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
