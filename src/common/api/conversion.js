import { getEnvs } from 'common/functions';
import { useUserStore } from '../store/user.store';
import { useConversionStore } from '../store/conversion.store';

const apiVersion = '2.0';
const previewApiVersion = '2023-03-01-preview';
const dataFormat = 'dwgzippackage';
const conversionDwgPackageVersion = '2.0';
const conversionOutputOntology = 'facility-2.0';

export const uploadConversion = (file) => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${getEnvs()[geography].URL}/mapData?dataFormat=${dataFormat}&api-version=${apiVersion}&subscription-key=${subscriptionKey}`;
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
  const url = `${getEnvs()[geography].URL}/conversions?udid=${udid}&outputOntology=${conversionOutputOntology}&api-version=${previewApiVersion}&subscription-key=${subscriptionKey}&dwgPackageVersion=${conversionDwgPackageVersion}`;
  return fetch(url, {
    method: 'POST',
  });
};

export const startDataset = (conversionId) => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${getEnvs()[geography].URL}/datasets?api-version=${apiVersion}&conversionId=${conversionId}&subscription-key=${subscriptionKey}`;
  return fetch(url, {
    method: 'POST',
  });
};

export const startTileset = (datasetId) => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${getEnvs()[geography].URL}/tilesets?api-version=${previewApiVersion}&datasetId=${datasetId}&subscription-key=${subscriptionKey}`;
  return fetch(url, {
    method: 'POST',
  });
};

export const deleteCreatedData = () => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const { uploadUdId, conversionId, datasetId, tilesetId } = useConversionStore.getState();

  if (tilesetId !== null) {
    return;
  }
  if (uploadUdId !== null) {
    fetch(`${getEnvs()[geography].URL}/mapData/${uploadUdId}?api-version=2.0&subscription-key=${subscriptionKey}`, {
      method: 'DELETE',
    });
  }
  if (conversionId !== null) {
    fetch(`${getEnvs()[geography].URL}/conversions/${conversionId}?api-version=2.0&subscription-key=${subscriptionKey}`, {
      method: 'DELETE',
    });
  }
  if (datasetId !== null) {
    fetch(`${getEnvs()[geography].URL}/datasets/${datasetId}?api-version=2.0&subscription-key=${subscriptionKey}`, {
      method: 'DELETE',
    });
  }
};