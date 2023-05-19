import { getEnvs } from 'common/functions';

const API_VERSION = '2.0';
const dataFormat = 'dwgzippackage';

export const uploadConversion = (file, geography, subscriptionKey) => {
  const url = `${getEnvs()[geography].URL}/mapData?dataFormat=${dataFormat}&api-version=${API_VERSION}&subscription-key=${subscriptionKey}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });
};

export const fetchUploadStatus = (operationLocation, subscriptionKey) => (
  fetch(`${operationLocation}&subscription-key=${subscriptionKey}`, {
    method: 'GET',
  })
);

export const fetchMetaData = (resourceLocation, subscriptionKey) => (
  fetch(`${resourceLocation}&subscription-key=${subscriptionKey}`, {
    method: 'GET',
  })
);