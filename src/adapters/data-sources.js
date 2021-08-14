const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;

export const getSourcesForCountry = async (countryId) => {
    debugger;
    let response = await fetch(`${apiEndpoint}/sources-data/countries/${countryId}`);
    let data = await response.json();
    return data.sources;
};
