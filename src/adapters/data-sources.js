import { loadSources } from "../data/loader";

const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;
const useApi = process.env.REACT_APP_DATA_SOURCE === "api";

export const getSourcesForCountry = async (countryId) => {
  if (useApi) {
    let response = await fetch(`${apiEndpoint}/sources-data/countries/${countryId}`);
    let data = await response.json();
    return data.sources;
  }
  return loadSources(countryId);
};
