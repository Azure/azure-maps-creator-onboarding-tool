import { getEnvs } from 'common/functions';
import { useReviewManifestStore } from '../store/review-manifest.store';
import { useUserStore } from '../store/user.store';

const defaultOptions = {
  apiVersion: '2.0',
  previewApiVersion: '2023-03-01-preview',
  dataFormat: 'dwgzippackage',
  dwgPackageVersion: '2.0',
  outputOntology: 'facility-2.0',
};

export const uploadConversion = (file, options = {}) => {
  const { apiVersion, dataFormat } = {
    ...defaultOptions,
    ...options,
  };
  const { geography, subscriptionKey } = useUserStore.getState();
  const { getOriginalPackageName } = useReviewManifestStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/mapData?dataFormat=${dataFormat}&api-version=${apiVersion}&subscription-key=${subscriptionKey}&description=${getOriginalPackageName()}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });
};

export const startConversion = (udid, options = {}) => {
  const { previewApiVersion, dwgPackageVersion, outputOntology } = {
    ...defaultOptions,
    ...options,
  };
  const { geography, subscriptionKey } = useUserStore.getState();
  const { getOriginalPackageName } = useReviewManifestStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/conversions?udid=${udid}&outputOntology=${outputOntology}&api-version=${previewApiVersion}&subscription-key=${subscriptionKey}&dwgPackageVersion=${dwgPackageVersion}&description=${getOriginalPackageName()}`;
  return fetch(url, {
    method: 'POST',
  });
};

export const startDataset = (conversionId, options = {}) => {
  const { apiVersion } = {
    ...defaultOptions,
    ...options,
  };
  const { geography, subscriptionKey } = useUserStore.getState();
  const { getOriginalPackageName } = useReviewManifestStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/datasets?api-version=${apiVersion}&conversionId=${conversionId}&subscription-key=${subscriptionKey}&description=${getOriginalPackageName()}`;
  return fetch(url, {
    method: 'POST',
  });
};

export const startTileset = (datasetId, options = {}) => {
  const { previewApiVersion } = {
    ...defaultOptions,
    ...options,
  };
  const { geography, subscriptionKey } = useUserStore.getState();
  const { getOriginalPackageName } = useReviewManifestStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/tilesets?api-version=${previewApiVersion}&datasetId=${datasetId}&subscription-key=${subscriptionKey}&description=${getOriginalPackageName()}`;
  return fetch(url, {
    method: 'POST',
  });
};

export const generateIMDFLink = (conversionId, options = {}) => {
  const { apiVersion } = {
    ...defaultOptions,
    ...options,
  };
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/mapData/${conversionId}?api-version=${apiVersion}&subscription-key=${subscriptionKey}`;
  return url;
};
