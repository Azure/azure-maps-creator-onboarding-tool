import { getEnvs } from 'common/functions';
import { create } from 'zustand';

export const useUserStore = create(set => ({
  subscriptionKey: '',
  setSubscriptionKey: key => set(() => ({ subscriptionKey: key })),
  geography: localStorage.getItem('geography') || Object.keys(getEnvs())[0],
  setGeography: geo => set(() => ({ geography: geo })),
}));

export const getDomain = geography => {
  return getEnvs()[geography].URL.replace('https://', '');
};
