const apiEndpoint = process.env.REACT_APP_VACCINATION_API_ENDPOINT;

export const getIsoCodes = async () => {
  let response = await fetch(`${apiEndpoint}/iso-codes`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ISO codes: ${response.statusText}`);
  }
  let data = await response.json();
  return data.payload;
};
