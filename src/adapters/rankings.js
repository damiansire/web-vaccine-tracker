const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;

export const getLastDataCountries = async () => {
  let response = await fetch(`${apiEndpoint}/statistics/last-data`);
  if (!response.ok) {
    throw new Error(`Failed to fetch rankings: ${response.statusText}`);
  }
  let data = await response.json();
  return data.payload;
};
