import { CONSTANTS } from 'common';

export const HTTP_STATUS_CODE = {
  ACCEPTED: 202,
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOO_MANY_REQUESTS: 429,
};

const API_VERSION = '1.0';

export const uploadFile = (file, geography, subscriptionKey) => {
  const url = `${CONSTANTS.GEO[geography].URL}/manifest?api-version=${API_VERSION}&subscription-key=${subscriptionKey}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/zip',
    },
    body: file,
  });
};

export const fetchStatus = (operationLocation, subscriptionKey) => {
  operationLocation += `&subscription-key=${subscriptionKey}`;
  return fetch(operationLocation, {
    method: 'GET',
  });
};

export const fetchAddress = (address, geography, subscriptionKey) => (
  fetch(`${CONSTANTS.GEO[geography].URL}/search/address/json?subscription-key=${subscriptionKey}&api-version=${API_VERSION}&query=${address}&limit=1`)
    .then((res) => res.json())
);