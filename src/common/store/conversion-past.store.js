import { create } from 'zustand';

import { conversionStatuses, conversionSteps} from './conversion.store';

export const useConversionPastStore = create((set) => ({
  selectedStep: conversionSteps.upload,
  uploadStepStatus: conversionStatuses.empty,
  uploadUdId: null,
  conversionStepStatus: conversionStatuses.empty,
  conversionId: null,
  datasetStepStatus: conversionStatuses.empty,
  datasetId: null,
  tilesetStepStatus: conversionStatuses.empty,
  tilesetId: null,
  mapConfigurationId: null,
  bbox: null,
  setStep: (selectedStep) => set({
    selectedStep,
  }),
  setData: (data) => set(data),
}));