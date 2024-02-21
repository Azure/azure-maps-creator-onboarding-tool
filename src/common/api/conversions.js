import { PLACES_PREVIEW } from 'common/constants';
import { getEnvs } from 'common/functions';
import dayjs from 'dayjs';
import { useUserStore } from '../store/user.store';

const uploadApiVersion = '2.0';
const creatorApiVersion = '2023-03-01-preview';

const getUploads = () => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${getEnvs()[geography].URL}/mapData?api-version=${uploadApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url);
};

export const deleteUploads = id => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/mapData/${id}?api-version=${uploadApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url, {
    method: 'DELETE',
  });
};

const getConversions = () => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/conversions?api-version=${creatorApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url);
};

export const deleteConversion = id => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/conversions/${id}?api-version=${uploadApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url, {
    method: 'DELETE',
  });
};

const getDatasets = () => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/datasets?api-version=${creatorApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url);
};

const getTilesets = () => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/tilesets?api-version=${creatorApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url);
};

export const getExistingConversions = async () => {
  const responses = await Promise.all([getUploads(), getConversions(), getDatasets(), getTilesets()]);

  if (responses.some(res => res.status !== 200)) {
    return { error: true };
  }

  const [uploads, conversions, datasets, tilesets] = await Promise.all(responses.map(res => res.json()));

  return {
    error: false,
    ...uploads,
    ...conversions,
    ...datasets,
    ...tilesets,
  };
};

export const clearCloudStorageData = async () => {
  try {
    const responses = await Promise.all([getUploads(), getConversions()]);

    const [uploads, conversions] = await Promise.all(responses.map(res => res.json()));

    const uploadIDs = uploads.mapDataList
      .filter(upload => {
        const updatedAt = dayjs(upload.updated);
        const isOldEnough = dayjs().diff(updatedAt, PLACES_PREVIEW.STORAGE_RETENTION, true) > 1;
        return upload.description === PLACES_PREVIEW.DESCRIPTION && isOldEnough;
      })
      .map(upload => upload.udid);

    const conversionIDs = conversions.conversions
      .filter(conversion => uploadIDs.includes(conversion.udid))
      .map(conversion => conversion.conversionId);

    await Promise.all([...uploadIDs.map(deleteUploads), ...conversionIDs.map(deleteConversion)]);
  } catch (e) {
    console.log('Error running automatic storage cleanup');
    console.log(e);
  }
};
