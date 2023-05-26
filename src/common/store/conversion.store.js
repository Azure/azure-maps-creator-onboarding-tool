import { create } from 'zustand';

import { startConversion, uploadConversion } from 'common/api/conversion';
import { fetchFromLocation } from 'common/api';
import { HTTP_STATUS_CODE } from 'common/constants';
import { LRO_STATUS } from './response.store';
import { useUserStore } from './user.store';

const OPERATION_LOCATION = 'Operation-Location';
const RESOURCE_LOCATION = 'Resource-Location';
const fetchTimeout = 10000;

export const conversionStatuses = {
  empty: 0,
  inProgress: 1,
  finishedSuccessfully: 2,
  failed: 3,
};

export const conversionSteps = {
  upload: 0,
  conversion: 1,
  dataset: 2,
  tileset: 3,
};

const getDefaultState = () => ({
  selectedStep: conversionSteps.upload,
  uploadStepStatus: conversionStatuses.empty,
  uploadStartTime: null,
  uploadEndTime: null,
  uploadUdId: null,
  uploadOperationId: null,
  uploadOperationLog: null,
  conversionStepStatus: conversionStatuses.empty,
  conversionStartTime: null,
  conversionEndTime: null,
  conversionOperationId: null,
  conversionOperationLog: null,
  conversionId: null,
  diagnosticPackageLocation: null,
});

const defaultErrorMessage = 'Operation failed.';

export const useConversionStore = create((set, get) => ({
  ...getDefaultState(),
  reset: () => set({
    ...getDefaultState(),
  }),
  setStep: (selectedStep) => set({
    selectedStep,
  }),
  uploadPackage: (file) => {
    set({
      uploadStartTime: Date.now(),
      uploadStepStatus: conversionStatuses.inProgress,
    });
    uploadConversion(file).then((res) => {
      if (res.status !== HTTP_STATUS_CODE.ACCEPTED) {
        res.json().then((data) => {
          set({
            uploadStepStatus: conversionStatuses.failed,
            uploadOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
            uploadEndTime: Date.now(),
          });
        });
      } else {
        get().fetchUploadStatus(res.headers.get(OPERATION_LOCATION));
      }
    }).catch((e) => {
      set({
        uploadStepStatus: conversionStatuses.failed,
        uploadOperationLog: e.message || defaultErrorMessage,
        uploadEndTime: Date.now(),
      });
    });
  },
  fetchUploadStatus: (location) => {
    fetchFromLocation(location)
      .then(async (res) => {
        if (res.status !== HTTP_STATUS_CODE.OK) {
          throw new Error();
        }

        const data = await res.json();

        if (data.status === LRO_STATUS.FAILED) {
          set({
            uploadStepStatus: conversionStatuses.failed,
            uploadOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
            uploadEndTime: Date.now(),
          });
        } else if (data.status === LRO_STATUS.RUNNING) {
          set(() => ({
            uploadOperationId: data.operationId,
            uploadOperationLog: JSON.stringify(data, null, 4),
          }));
          setTimeout(() => {
            get().fetchUploadStatus(location);
          }, fetchTimeout);
        } else if (data.status === LRO_STATUS.SUCCEEDED) {
          set({
            uploadStepStatus: conversionStatuses.finishedSuccessfully,
            uploadOperationLog: JSON.stringify(data, null, 4),
            uploadOperationId: data.operationId,
            uploadEndTime: Date.now(),
          });

          fetchFromLocation(res.headers.get(RESOURCE_LOCATION))
            .then((res) => res.json())
            .then((data) => {
              get().startConversion(data.udid);
              set({
                uploadUdId: data.udid,
              });
            });
        } else {
          throw new Error(JSON.stringify(data, null, 4));
        }
      }).catch((e) => {
      set({
        uploadStepStatus: conversionStatuses.failed,
        uploadOperationLog: e.message || defaultErrorMessage,
        uploadEndTime: Date.now(),
      });
    });
  },
  startConversion: (udid) => {
    set({
      conversionStartTime: Date.now(),
      conversionStepStatus: conversionStatuses.inProgress,
    });
    startConversion(udid).then((res) => {
      if (res.status !== HTTP_STATUS_CODE.ACCEPTED) {
        res.json().then((data) => {
          set({
            conversionStepStatus: conversionStatuses.failed,
            conversionOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
            conversionEndTime: Date.now(),
          });
        });
      } else {
        get().fetchConversionStatus(res.headers.get(OPERATION_LOCATION));
      }
    }).catch((e) => {
      set({
        conversionStepStatus: conversionStatuses.failed,
        conversionOperationLog: e.message || defaultErrorMessage,
        conversionEndTime: Date.now(),
      });
    });
  },
  fetchConversionStatus: (operationLocation) => {
    fetchFromLocation(operationLocation)
      .then(async (res) => {
        if (res.status !== HTTP_STATUS_CODE.OK) {
          throw new Error();
        }

        const data = await res.json();

        if (data.status === LRO_STATUS.FAILED) {
          set({
            conversionStepStatus: conversionStatuses.failed,
            conversionOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
            conversionEndTime: Date.now(),
          });
        } else if (data.status === LRO_STATUS.RUNNING) {
          set(() => ({
            conversionOperationId: data.operationId,
            conversionOperationLog: JSON.stringify(data, null, 4),
          }));
          setTimeout(() => {
            get().fetchConversionStatus(operationLocation);
          }, fetchTimeout);
        } else if (data.status === LRO_STATUS.SUCCEEDED) {
          const { subscriptionKey } = useUserStore.getState();
          set({
            conversionStepStatus: conversionStatuses.finishedSuccessfully,
            conversionOperationLog: JSON.stringify(data, null, 4),
            conversionOperationId: data.operationId,
            conversionEndTime: Date.now(),
            diagnosticPackageLocation: `${data.properties.diagnosticPackageLocation}&subscription-key=${subscriptionKey}`,
          });

          fetchFromLocation(res.headers.get(RESOURCE_LOCATION))
            .then((res) => res.json())
            .then((data) => {
              set({
                conversionId: data.conversionId,
              });
            });
        } else {
          throw new Error(JSON.stringify(data, null, 4));
        }
      })
      .catch((e) => {
        set({
          conversionStepStatus: conversionStatuses.failed,
          conversionOperationLog: e.message || defaultErrorMessage,
          conversionEndTime: Date.now(),
        });
      });
  },
}));