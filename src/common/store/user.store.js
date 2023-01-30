import { create } from 'zustand';

import { CONSTANTS } from 'common';

export const useUserStore = create((set) => ({
  subscriptionKey: '',
  setSubscriptionKey: (key) => set(() => ({ subscriptionKey: key })),
  geography: Object.keys(CONSTANTS.GEO)[0],
  setGeography: (geo) => set(() => ({ geography: geo })),
}));

export const getDomain = (geography) => {
  return CONSTANTS.GEO[geography].URL;
};