const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;

export const getLastDataCountries = async () => {
  let response = await fetch(`${apiEndpoint}/statistics/last-data`);
  let data = await response.json();
  return data.payload;
};
