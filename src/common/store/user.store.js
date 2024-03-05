import { getEnvs } from 'common/functions';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useUserStore = createWithEqualityFn(
  set => ({
    subscriptionKey: '',
    setSubscriptionKey: key => set(() => ({ subscriptionKey: key })),
    geography: localStorage.getItem('geography') || Object.keys(getEnvs())[0],
    setGeography: geo => set(() => ({ geography: geo })),
  }),
  shallow
);

export const getDomain = geography => {
  return getEnvs()[geography].URL.replace('https://', '');
};
