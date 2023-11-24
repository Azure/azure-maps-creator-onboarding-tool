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
