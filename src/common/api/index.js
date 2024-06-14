// The following API is designed to be used only by the onboarding tool and is not supported for any other use.
import { getEnvs } from 'common/functions';
import { getFeatureFlags } from 'utils';
import { HTTP_STATUS_CODE, PLACES_PREVIEW } from '../constants';
import { useUserStore } from '../store/user.store';

export const uploadPackage = file => {
  const { geography, subscriptionKey } = useUserStore.getState();

  const { isPlacesPreview } = getFeatureFlags();

  const params = {
    'api-version': '2.0',
    'subscription-key': subscriptionKey,
  };

  if (isPlacesPreview) {
    params[PLACES_PREVIEW.SEARCH_PARAMETER] = true;
  }

  const queryParams = new URLSearchParams(params);

  const url = `${getEnvs()[geography].URL}/manifest?${queryParams.toString()}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/zip',
    },
    body: file,
  });
};

export const deletePackage = () => {
  const { geography, subscriptionKey } = useUserStore.getState();
  fetch(`${getEnvs()[geography].URL}/manifest?api-version=2.0&subscription-key=${subscriptionKey}`, {
    method: 'DELETE',
  });
};

export const fetchFromLocation = location => {
  const { subscriptionKey } = useUserStore.getState();
  return fetch(`${location}&subscription-key=${subscriptionKey}`, {
    method: 'GET',
  });
};

export const fetchWithRetries = (location, retries = 10) => {
  const { subscriptionKey } = useUserStore.getState();
  return fetch(`${location}&subscription-key=${subscriptionKey}`).then(async res => {
    const data = await res.json();
    if (res.status === HTTP_STATUS_CODE.OK) {
      return data;
    }

    if (retries > 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(fetchWithRetries(location, retries - 1));
        }, 10000);
      });
    }
    throw new Error(data?.error?.message);
  });
};

export const deleteFromLocation = fetchUrl => {
  const { subscriptionKey } = useUserStore.getState();
  fetch(`${fetchUrl}&subscription-key=${subscriptionKey}`, {
    method: 'DELETE',
  });
};

export const fetchAddress = address => {
  const { geography, subscriptionKey } = useUserStore.getState();
  return fetch(
    `${
      getEnvs()[geography].URL
    }/search/address/json?subscription-key=${subscriptionKey}&api-version=1.0&query=${address}&limit=1`
  ).then(res => res.json());
};
