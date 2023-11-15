import { getEnvs } from 'common/functions';
import { useUserStore } from '../store/user.store';

const uploadApiVersion = '2.0';
const creatorApiVersion = '2023-03-01-preview';

const getUploads = () => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${getEnvs()[geography].URL}/mapData?api-version=${uploadApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url);
};

const getConversions = () => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${
    getEnvs()[geography].URL
  }/conversions?api-version=${creatorApiVersion}&subscription-key=${subscriptionKey}`;
  return fetch(url);
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

export const getAllData = () =>
  Promise.all([getUploads(), getConversions(), getDatasets(), getTilesets()])
    .then(re => Promise.all([re[0].json(), re[1].json(), re[2].json(), re[3].json()]))
    .then(([uploads, conversions, datasets, tilesets]) => ({
      ...uploads,
      ...conversions,
      ...datasets,
      ...tilesets,
    }));
