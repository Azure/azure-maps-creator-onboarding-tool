// The following API is designed to be used only by the onboarding tool and is not supported for any other use.
import { getEnvs } from 'common/functions';
import { useUserStore } from '../store/user.store';

export const uploadFile = (file) => {
  const { geography, subscriptionKey } = useUserStore.getState();
  const url = `${getEnvs()[geography].URL}/manifest?api-version=2.0&subscription-key=${subscriptionKey}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/zip',
    },
    body: file,
  });
};

export const fetchFromLocation = (location) => {
  const { subscriptionKey } = useUserStore.getState();
  return fetch(`${location}&subscription-key=${subscriptionKey}`, {
    method: 'GET',
  });
};

export const deleteFromLocation = (fetchUrl) => {
  const { subscriptionKey } = useUserStore.getState();
  fetch(`${fetchUrl}&subscription-key=${subscriptionKey}`, {
    method: 'DELETE',
  });
};

export const fetchAddress = (address) => {
  const { geography, subscriptionKey } = useUserStore.getState();
  return fetch(`${getEnvs()[geography].URL}/search/address/json?subscription-key=${subscriptionKey}&api-version=1.0&query=${address}&limit=1`)
    .then((res) => res.json());
};