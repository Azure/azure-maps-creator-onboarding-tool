import { create } from 'zustand';

import { fetchMetaData, fetchUploadStatus, uploadConversion } from 'common/api/conversion';
import { HTTP_STATUS_CODE } from 'common/api';
import { LRO_STATUS } from './response.store';

const OPERATION_LOCATION = 'Operation-Location';
const RESOURCE_LOCATION = 'Resource-Location';

export const conversionStatuses = {
  empty: 'empty',
  inProgress: 'inProgress',
  finishedSuccessfully: 'finishedSuccessfully',
  failed: 'failed',
};

const getDefaultState = () => ({
  uploadStepStatus: conversionStatuses.empty,
  uploadStartTime: null,
  uploadEndTime: null,
  uploadUdId: null,
  uploadOperationId: null,
  uploadOperationLog: null,
});

const defaultErrorMessage = 'Operation failed.';

export const useConversionStore = create((set) => ({
  ...getDefaultState(),
  reset: () => set({
    ...getDefaultState(),
  }),
  uploadPackage: (file, geography, subscriptionKey) => {
    set({
      uploadStartTime: Date.now(),
      uploadStepStatus: conversionStatuses.inProgress,
    });
    uploadConversion(file, geography, subscriptionKey).then((res) => {
      if (res.status !== HTTP_STATUS_CODE.ACCEPTED) {
        res.json().then((jsonRes) => {
          set({
            uploadStepStatus: conversionStatuses.failed,
            uploadOperationLog: jsonRes.error.message,
            uploadEndTime: Date.now(),
          });
        });
      } else {
        const interval = setInterval(() => {
          fetchUploadStatus(res.headers.get(OPERATION_LOCATION), subscriptionKey)
            .then((res) => res.json())
            .then((data) => {
              if (res.status !== HTTP_STATUS_CODE.OK || data.status === LRO_STATUS.FAILED) {
                clearInterval(interval);
                set({
                  uploadStepStatus: conversionStatuses.failed,
                  uploadOperationLog: data?.error?.message || defaultErrorMessage,
                  uploadEndTime: Date.now(),
                });
              } else if (data.status === LRO_STATUS.RUNNING) {
                set(() => ({ uploadOperationId: data.operationId }));
              } else if (data.status === LRO_STATUS.SUCCEEDED) {
                clearInterval(interval);
                set({
                  uploadStepStatus: conversionStatuses.finishedSuccessfully,
                  uploadOperationLog: JSON.stringify(data, null, 4),
                  uploadOperationId: data.operationId,
                  uploadEndTime: Date.now(),
                });

                fetchMetaData(res.headers.get(RESOURCE_LOCATION), subscriptionKey)
                  .then((res) => res.json())
                  .then((data) => {
                    set({
                      uploadUdId: data.udid,
                    });
                  });
              } else {
                throw new Error('should never reach here');
              }
          }).catch(() => {
            clearInterval(interval);
            set({
              uploadStepStatus: conversionStatuses.failed,
              uploadOperationLog: defaultErrorMessage,
              uploadEndTime: Date.now(),
            });
          });
        }, 10000);
      }
    });
  },
}));