import { isStagingEnv } from './constants';

const flags = {
  onboardingEnabled: isStagingEnv,
};

export default flags;