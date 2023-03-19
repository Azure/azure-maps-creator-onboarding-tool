import { create } from 'zustand';

import { getEnvs } from 'common/functions';

export const useUserStore = create((set) => ({
  subscriptionKey: '',
  setSubscriptionKey: (key) => set(() => ({ subscriptionKey: key })),
  geography: Object.keys(getEnvs())[0],
  setGeography: (geo) => set(() => ({ geography: geo })),
}));

export const getDomain = (geography) => {
  return getEnvs()[geography].URL;
};