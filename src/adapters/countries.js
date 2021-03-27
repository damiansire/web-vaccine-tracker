export const getAvailablesCountries = async () => {
  let response = await fetch(
    "http://localhost:3005/api/v1/availables-countries"
  );
  let data = await response.json();
  return data;
};

export const getCountryData = async (countryId) => {
  let response = await fetch(
    `http://localhost:3005/api/v1/countries/${countryId}`
  );
  let data = await response.json();
  return data;
};
