// The following API is designed to be used only by the onboarding tool and is not supported for any other use.
import { getEnvs } from 'common/functions';

export const HTTP_STATUS_CODE = {
  ACCEPTED: 202,
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOO_MANY_REQUESTS: 429,
};

const API_VERSION = '2.0';

export const uploadFile = (file, geography, subscriptionKey) => {
  const url = `${getEnvs()[geography].URL}/manifest?api-version=${API_VERSION}&subscription-key=${subscriptionKey}`;

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

export const fetchManifestData = (fetchUrl, subscriptionKey) => {
  return fetch(`${fetchUrl}&subscription-key=${subscriptionKey}`, {
    method: 'GET',
  }).then((re) => re.json());
};

export const deleteManifestData = (fetchUrl, subscriptionKey) => {
  return fetch(`${fetchUrl}&subscription-key=${subscriptionKey}`, {
    method: 'DELETE',
  });
};

export const fetchAddress = (address, geography, subscriptionKey) => (
  fetch(`${getEnvs()[geography].URL}/search/address/json?subscription-key=${subscriptionKey}&api-version=1.0&query=${address}&limit=1`)
    .then((res) => res.json())
);