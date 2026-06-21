import { loadLastData } from "../data/loader";

const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;
const useApi = process.env.REACT_APP_DATA_SOURCE === "api";

export const getLastDataCountries = async () => {
  if (useApi) {
    let response = await fetch(`${apiEndpoint}/statistics/last-data`);
    let data = await response.json();
    return data.payload;
  }
  return loadLastData();
};
