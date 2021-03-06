const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;

export const getIsoCodes = async () => {
  let response = await fetch(`${apiEndpoint}/iso-codes`);
  let data = await response.json();
  return data.payload;
};
