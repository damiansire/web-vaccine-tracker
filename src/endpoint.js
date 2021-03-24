const vaccineApiEndpoint = "http://localhost:3005/api/v1/countries/"

const getVaccineApiEndpointForCountry = (country) => {
    return vaccineApiEndpoint + country
}

export default getVaccineApiEndpointForCountry;