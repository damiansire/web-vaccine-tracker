import React, { useState, useEffect } from "react";

import OptionsSelected from "../components/SelectCountryComponent/OptionsSelected";

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Checkbox,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import {
  getAvailablesCountries,
  getCountryData,
} from "../../../adapters/countries.js";

//Components
import CountriesGraphs from "../components/CountriesGraphs";
import CompareCountriesTable from "../components/CompareCountriesTable";
import DoubleButton from "../components/DoubleButton";
import SelectCountry from "../components/SelectCountryComponent/SelectCountry";
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
  const [showCountriesList, setShowCountriesList] = useState(false);
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

  const _setSearchTerm = (term) => {
    setSearchTerm(term);
    if (term.length > 0) {
      setShowCountriesList(true);
    } else {
      setShowCountriesList(false);
    }
  };

  return (
    <>
      {loadCountryData && (
        <div className="page">
          {/* ========= content ========== */}
          <div className="page__data__content">
            <div className="page__data__header">
              <h1>Comparar evolución en Países</h1>
              <DoubleButton
                buttonsHandle={selectViewData}
                button1Text="Grafico"
                valueButton1="Graph"
                button2Text="Tabla"
                valueButton2="Table"
                selectedOption={viewInfo}
              />
            </div>

            {/* ===== toolbar ===== */}
            <div className="mt-1 subtitle-section">
              <h4>{countryAttributeDescripcion[selectedProperty]}</h4>
            </div>
            <div className="toolbar box">
              {/* item */}
              <div className="toolbar__item">
                <FormControl>
                  <InputLabel htmlFor="age-native-simple">
                    Dato a ver
                  </InputLabel>
                  <Select
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
              {/* /item */}

              {/* item */}
              <div className="toolbar__item">
                <div className="col-span-12 sm:col-span-2 ">
                  <div className="relative my-2">
                    <TextField
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      label="Buscar país..."
                      onChange={(event) => {
                        _setSearchTerm(event.target.value);
                      }}
                    />
                  </div>
                  {showCountriesList && (
                    <div className="country__list">
                      <SelectCountry
                        availablesCountries={availablesCountries}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries}
                        searchTerm={searchTerm}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* /item */}

              {/* item */}
              <div className="toolbar__item">
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
              {/* /item */}
            </div>
            {/* ===== /toolbar ===== */}

            {/* ==== paises seleccionados ===== */}
            <div className="mt-1 subtitle-section">
              <h4>Países seleccionados</h4>
            </div>
            <div className="box box--paises">
              <OptionsSelected
                selectedCountries={selectedCountries}
                setSelectedCountries={setSelectedCountries}
              />
            </div>
            {/* ==== paises seleccionados ===== */}

            {/* ===== gráfica ===== */}
            {viewInfo === "Graph" && (
              <div className="mt-1 subtitle-section">
                <h4>Comparación de la situación de paises</h4>
              </div>
            )}
            <div
              className="box"
              style={{ marginTop: viewInfo === "Graph" ? "0" : "1rem" }}
            >
              {/* Add key={selectedCountriesData} beucase the graph have a problem with refersh when remove country */}
              {viewInfo === "Graph" && (
                <CountriesGraphs
                  key={selectedCountriesData}
                  optionsSelectedData={selectedProperty}
                  countriesData={selectedCountriesData}
                />
              )}

              <div className="mt-1">
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
            {/* ===== /gráfica ===== */}
          </div>

          {/* ========= /content ========== */}
        </div>
      )}
    </>
  );
};

export default CountriesData;
