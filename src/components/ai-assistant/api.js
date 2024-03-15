import { AiConfig } from './config';

export const fetchSuggestionsFromAPI = async (dwgDrawings, userRequirements = []) => {
  const url = AiConfig.backendURL;

  const body = {
    dwgDrawings,
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
