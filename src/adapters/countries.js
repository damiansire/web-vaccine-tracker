import { loadManifest, loadCountry } from "../data/loader";

// La API (api.thecovidvaccines.com) está caída: por defecto servimos el dataset
// estático modular. Para volver a la API, setear REACT_APP_DATA_SOURCE=api.
const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;
const useApi = process.env.REACT_APP_DATA_SOURCE === "api";

export const getAvailablesCountries = async () => {
  if (useApi) {
    let response = await fetch(`${apiEndpoint}/availables-countries`);
    let data = await response.json();
    return data;
  }
  let manifest = await loadManifest();
  return manifest.countries;
};

export const getCountryData = async (countryId) => {
  if (useApi) {
    let response = await fetch(`${apiEndpoint}/countries/${countryId}`);
    let data = await response.json();
    return data;
  }
  return loadCountry(countryId);
};
