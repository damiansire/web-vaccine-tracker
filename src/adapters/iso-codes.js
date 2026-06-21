import { loadIsoCodes } from "../data/loader";

const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;
const useApi = process.env.REACT_APP_DATA_SOURCE === "api";

export const getIsoCodes = async () => {
  if (useApi) {
    let response = await fetch(`${apiEndpoint}/iso-codes`);
    let data = await response.json();
    return data.payload;
  }
  return loadIsoCodes();
};
