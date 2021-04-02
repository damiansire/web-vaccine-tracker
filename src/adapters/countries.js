const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;

export const getAvailablesCountries = async () => {
  let response = await fetch(
    `${apiEndpoint}/availables-countries`
  );
  let data = await response.json();
  return data;
};

export const getCountryData = async (countryId) => {
  let response = await fetch(
    `${apiEndpoint}/countries/${countryId}`
  );
  let data = await response.json();
  return data;
};
