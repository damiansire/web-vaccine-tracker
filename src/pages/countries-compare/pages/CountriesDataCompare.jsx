import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import OptionsSelected from '../components/SelectCountryComponent/OptionsSelected';

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Checkbox,
} from '@material-ui/core';

import {
  getAvailablesCountries,
  getCountryData,
} from '../../../adapters/countries.js';

//Components
import CountriesGraphs from '../components/CountriesGraphs';
import CompareCountriesTable from '../components/CompareCountriesTable';
import DoubleButton from '../components/DoubleButton';
import SelectCountry from '../components/SelectCountryComponent/SelectCountry';
import TodayDataTable from '../components/TodayDataTable';
const { sortDateAsc } = require('../../../utils/sorts');
const { normalizeCountries } = require('../../../utils/missingDate');

const StyledHomePageContainer = styled.div`
  margin: 2rem;
  .header {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0;
  }
  h1 {
    font-size: 35px;
    font-family: 'Roboto';
    font-weight: bold;
  }
  h2 {
    color: grey;
  }
  .select-data-container,
  .option-selected-countries-container,
  .graph-container {
    background: white;
    border-radius: 15px;
    box-shadow: 0 0 15px #8e8e8e79;
    padding: 1rem;
  }
  .select-data-container p {
    color: grey;
  }
  .countries-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .selected-countries-container,
  .graph-and-title-container {
    margin-top: 2rem;
  }
  .selected-countries-container p,
  .graph-and-title-container p {
    color: grey;
    margin-bottom: 0.5rem;
  }
  #available-countries {
    border: none;
    border-bottom: 1px solid black;
  }
  .search-input-container {
    position: relative;
  }
  .search-input-container svg {
    position: absolute;
    left: 0;
    bottom: 15px;
  }
  .search-input-container input {
    padding-left: 40px;
  }
`;

const CountriesData = () => {
  const [loadCountryData, setLoadCountryData] = useState(false);
  const [selectedCountriesData, setCountriesDataState] = useState({});
  const [viewInfo, setViewInfo] = useState('Graph');
  const [availablesCountries, setAvailablesCountries] = useState([]);
  const [sameOrigin, setSameOrigin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(
    'people_vaccinated_per_hundred'
  );
  const [selectedCountries, setSelectedCountries] = useState([
    'Argentina',
    'Uruguay',
    'Chile',
    'Colombia',
  ]);

  const countryAttributeNames = [
    {
      key: "people_vaccinated_per_hundred",
      text: "% Población vacunada",
    },
    {
      key: "people_fully_vaccinated_per_hundred",
      text: "% Población Inmunizada",
    },
    {
      key: "daily_vaccinations",
      text: "Vacunación diaria",
    },
    {
      key: "daily_vaccinations_per_million",
      text: "Vacunación diaria por millón",
    },
    {
      key: 'people_fully_vaccinated',
      text: 'Personas full vacunas',
    },
    { key: 'people_vaccinated', text: 'Vacunadas' },
    {
      key: 'total_dose_vaccinations',
      text: 'Total de dosis aplicadas',
    },
    { key: 'vaccine_type', text: 'Tipo de vacuna' },
  ];

  useEffect(() => {
    getAvailablesCountries().then((data) => {
      setAvailablesCountries(data);
    });
  }, []);

  const countryAttributeDescripcion = {
    people_fully_vaccinated_per_hundred:
      'Porcentaje de la población que ha recibido todas las dosis de las vacunas.',
    people_vaccinated_per_hundred:
      "Porcentaje de la población con al menos una dosis",
    daily_vaccinations: "Cantidad total de dosis administradas el día de hoy.",
    daily_vaccinations_per_million:
      "Cantidad total de dosis aplicadas el día de hoy por millón de habitantes",
    people_fully_vaccinated:
      'Cantidad de personas que han recibido todas las dosis de las vacunas.',
    people_vaccinated: 'Cantidad de personas vacunadas con al menos una dosis.',
    total_dose_vaccinations:
      'Total de dosis aplicadas. Si una persona se da 2 dosis, se cuenta dos veces.',
    vaccine_type: 'Tipo de vacuna',
  };

  const countryAttributeNamesTranslate = {
    people_vaccinated_per_hundred: "% Población vacunada",
    people_fully_vaccinated_per_hundred: "% Población Inmunizada",
    daily_vaccinations: "Vacunación diaria",
    daily_vaccinations_per_million: "Vacunación diaria por millón",
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
          countryData['data'] = countryData['data'].sort((a, b) =>
            sortDateAsc(a, b)
          );

          saveCountryDataInCached(
            countryData['countryName'],
            countryData['data']
          );
        });
      }

      let countriesDataFromCached = selectedCountries.map((countryName) => {
        return {
          name: countriesDataCached[countryName]['countryName'],
          data: countriesDataCached[countryName]['data'],
        };
      });

      //Agrega las fechas que faltan en los datos, para que todos los paises
      //Tengan la misma cantidad de elementos
      if (!sameOrigin) {
        countriesDataFromCached = normalizeCountries(countriesDataFromCached);
      }

      //Ordena los países
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
      //TODO: Controlar caso en el que no hay países seleccionados
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
    <StyledHomePageContainer>
      {loadCountryData && (
        <div className="grid grid-cols-12 justify-items-center gap-4">
          <div className="col-span-12 sm:col-span-10 w-full justify-items-center gap-4 align-middle">
            <div className="grid grid-cols-12 m-2">
              <div className="col-start-4 col-span-7 text-center text-3xl self-center">
                GRÁFICO DE EVOLUCIÓN
              </div>
              <div className="text-center col-span-12 sm:col-span-1">
                <DoubleButton
                  buttonsHandle={selectViewData}
                  button1Text="Gráfico"
                  valueButton1="Graph"
                  button2Text="Tabla"
                  valueButton2="Table"
                  selectedOption={viewInfo}
                />
              </div>
            </div>
            <DoubleButton
              buttonsHandle={selectViewData}
              button1Text='Grafico'
              valueButton1='Graph'
              button2Text='Tabla'
              valueButton2='Table'
              selectedOption={viewInfo}
            />
          </div>
          <div className='select-data-container'>
            <div className='countries-container'>
              <div>
                <p>Dato a ver</p>
                <Select
                  variant='outlined'
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
              </div>
              <div className='search-input-container'>
                <p>Buscar pais...</p>

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
                    label="Mover gráficas al 0"
                  />
                </div>
                <span className="text-center font-medium">
                  Países seleccionados
                </span>
                <OptionsSelected
                  selectedCountries={selectedCountries}
                  setSelectedCountries={setSelectedCountries}
                />
                <datalist id='availables-countries'>
                  <option value='Chrome' />
                  {availablesCountries.map((countryName) => (
                    <option key={countryName} value={countryName} />
                  ))}
                </datalist>
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sameOrigin}
                    onChange={() => {
                      setSameOrigin(!sameOrigin);
                    }}
                    name='checkedB'
                    color='primary'
                  />
                )}
                {viewInfo === "Graph" && (
                  <div className="text-center font-medium my-3">
                    Comparación de la situación de países
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

          <div className="col-span-12 sm:col-span-2 ">
            <div className="relative my-2">
              <input
                type="search"
                className="bg-purple-white shadow rounded border-1 p-3 focus:bg-white focus:border-blue-400"
                placeholder="Buscar país..."
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </div>
          </div>

          <div className='graph-and-title-container'>
            <p>Comparación de la situación de los paises</p>
            <div className='graph-container'>
              {/* Add key={selectedCountriesData} beucase the graph have a problem with refersh when remove country */}
              {viewInfo === 'Graph' && (
                <CountriesGraphs
                  key={selectedCountriesData}
                  optionsSelectedData={selectedProperty}
                  countriesData={selectedCountriesData}
                />
              )}
              {viewInfo === 'Graph' && (
                <div className=''>Comparación de la situación de paises</div>
              )}
              {viewInfo === 'Graph' && (
                <TodayDataTable countriesData={selectedCountriesData} />
              )}
              {viewInfo === 'Table' && (
                <CompareCountriesTable
                  countriesData={selectedCountriesData}
                  optionsSelectedData={selectedProperty}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </StyledHomePageContainer>
  );
};

export default CountriesData;
