const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;

export const getAvailablesCountries = async () => {
  let response = await fetch(`${apiEndpoint}/availables-countries`);
  if (!response.ok) {
    throw new Error(`Failed to fetch available countries: ${response.statusText}`);
  }
  let data = await response.json();
  return data;
};

export const getCountryData = async (countryId) => {
  let response = await fetch(`${apiEndpoint}/countries/${countryId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch country data: ${response.statusText}`);
  }
  let data = await response.json();
  return data;
};
