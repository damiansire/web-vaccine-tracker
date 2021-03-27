const urlBase = "api.thecovidvaccines.com/";

const vaccineApiEndpoint = `${urlBase}/api/v1/`;

const getVaccineApiEndpointForCountry = (country) => {
  return `${vaccineApiEndpoint}/countries/${country}`;
};

export default getVaccineApiEndpointForCountry;
