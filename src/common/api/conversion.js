import { getEnvs } from 'common/functions';
import { useUserStore } from '../store/user.store';

const uploadApiVersion = '2.0';
const dataFormat = 'dwgzippackage';
const conversionApiVersion = '2023-03-01-preview';
const conversionDwgPackageVersion = '2.0';
const conversionOutputOntology = 'facility-2.0';

export const uploadConversion = (file) => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${getEnvs()[geography].URL}/mapData?dataFormat=${dataFormat}&api-version=${uploadApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });
};

export const startConversion = (udid) => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${getEnvs()[geography].URL}/conversions?udid=${udid}&outputOntology=${conversionOutputOntology}&api-version=${conversionApiVersion}&subscription-key=${subscriptionKey}&dwgPackageVersion=${conversionDwgPackageVersion}`;
  return fetch(url, {
    method: 'POST',
  });
};