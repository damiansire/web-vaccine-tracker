const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;

export const getSourcesForCountry = async (countryId) => {
    let response = await fetch(`${apiEndpoint}/sources-data/countries/${countryId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch sources: ${response.statusText}`);
    }
    let data = await response.json();
    return data.sources;
};
