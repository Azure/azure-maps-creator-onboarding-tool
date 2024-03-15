import { AiConfig } from './config';

export const fetchSuggestionsFromAPI = async (geojson, userRequirements = []) => {
  const url = AiConfig.backendURL;

  const body = {
    geojson,
    userRequirements,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res;
};
