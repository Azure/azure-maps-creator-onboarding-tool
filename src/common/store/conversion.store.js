import { fetchFromLocation } from 'common/api';
import { startConversion, startDataset, startTileset, uploadConversion } from 'common/api/conversion';
import { HTTP_STATUS_CODE } from 'common/constants';
import { create } from 'zustand';
import { LRO_STATUS } from './response.store';
import { useUserStore } from './user.store';

const OPERATION_LOCATION = 'Operation-Location';
const RESOURCE_LOCATION = 'Resource-Location';
const fetchTimeout = 10000;

export const conversionStatuses = {
  deleted: -1,
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
  map: 4,
};

const getDefaultState = () => ({
  selectedStep: conversionSteps.upload,
  uploadStepStatus: conversionStatuses.empty,
  uploadStartTime: null,
  uploadEndTime: null,
  uploadUdId: null,
  uploadOperationLog: null,
  uploadDescription: null,
  conversionStepStatus: conversionStatuses.empty,
  conversionStartTime: null,
  conversionEndTime: null,
  conversionOperationLog: null,
  conversionId: null,
  diagnosticPackageLocation: null,
  datasetStepStatus: conversionStatuses.empty,
  datasetStartTime: null,
  datasetEndTime: null,
  datasetOperationLog: null,
  datasetId: null,
  tilesetStepStatus: conversionStatuses.empty,
  tilesetStartTime: null,
  tilesetEndTime: null,
  tilesetOperationLog: null,
  tilesetId: null,
  mapConfigurationId: null,
  bbox: null,
});

const defaultErrorMessage = 'Operation failed.';

export const useConversionStore = create((set, get) => ({
  ...getDefaultState(),
  reset: () =>
    set({
      ...getDefaultState(),
    }),
  setStep: selectedStep =>
    set({
      selectedStep,
    }),
  uploadPackage: file => {
    set({
      ...getDefaultState(),
      uploadStartTime: Date.now(),
      uploadStepStatus: conversionStatuses.inProgress,
    });
    uploadConversion(file)
      .then(res => {
        if (res.status !== HTTP_STATUS_CODE.ACCEPTED) {
          res.json().then(data => {
            set({
              uploadStepStatus: conversionStatuses.failed,
              uploadOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
              uploadEndTime: Date.now(),
            });
          });
        } else {
          get().fetchUploadStatus(res.headers.get(OPERATION_LOCATION));
        }
      })
      .catch(e => {
        set({
          uploadStepStatus: conversionStatuses.failed,
          uploadOperationLog: e.message || defaultErrorMessage,
          uploadEndTime: Date.now(),
        });
      });
  },
  fetchUploadStatus: location => {
    if (get().uploadStartTime === null) {
      return;
    }
    fetchFromLocation(location)
      .then(async res => {
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
            uploadOperationLog: JSON.stringify(data, null, 4),
          }));
          setTimeout(() => {
            get().fetchUploadStatus(location);
          }, fetchTimeout);
        } else if (data.status === LRO_STATUS.SUCCEEDED) {
          set({
            uploadStepStatus: conversionStatuses.finishedSuccessfully,
            uploadOperationLog: JSON.stringify(data, null, 4),
            uploadEndTime: Date.now(),
          });

          fetchFromLocation(res.headers.get(RESOURCE_LOCATION))
            .then(res => res.json())
            .then(data => {
              get().startConversion(data.udid);
              set({
                uploadUdId: data.udid,
                uploadDescription: data.description,
              });
            });
        } else {
          throw new Error(JSON.stringify(data, null, 4));
        }
      })
      .catch(e => {
        set({
          uploadStepStatus: conversionStatuses.failed,
          uploadOperationLog: e.message || defaultErrorMessage,
          uploadEndTime: Date.now(),
        });
      });
  },
  startConversion: udid => {
    if (get().uploadStartTime === null) {
      return;
    }
    set({
      conversionStartTime: Date.now(),
      conversionStepStatus: conversionStatuses.inProgress,
      selectedStep: conversionSteps.conversion,
    });
    startConversion(udid)
      .then(res => {
        if (res.status !== HTTP_STATUS_CODE.ACCEPTED) {
          res.json().then(data => {
            set({
              conversionStepStatus: conversionStatuses.failed,
              conversionOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
              conversionEndTime: Date.now(),
            });
          });
        } else {
          get().fetchConversionStatus(res.headers.get(OPERATION_LOCATION));
        }
      })
      .catch(e => {
        set({
          conversionStepStatus: conversionStatuses.failed,
          conversionOperationLog: e.message || defaultErrorMessage,
          conversionEndTime: Date.now(),
        });
      });
  },
  fetchConversionStatus: operationLocation => {
    if (get().uploadStartTime === null) {
      return;
    }
    fetchFromLocation(operationLocation)
      .then(async res => {
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
            conversionEndTime: Date.now(),
            diagnosticPackageLocation: `${data.properties.diagnosticPackageLocation}&subscription-key=${subscriptionKey}`,
          });

          fetchFromLocation(res.headers.get(RESOURCE_LOCATION))
            .then(res => res.json())
            .then(data => {
              set({
                conversionId: data.conversionId,
              });
              get().startDataset(data.conversionId);
            });
        } else {
          throw new Error(JSON.stringify(data, null, 4));
        }
      })
      .catch(e => {
        set({
          conversionStepStatus: conversionStatuses.failed,
          conversionOperationLog: e.message || defaultErrorMessage,
          conversionEndTime: Date.now(),
        });
      });
  },
  startDataset: conversionId => {
    if (get().uploadStartTime === null) {
      return;
    }
    set({
      datasetStartTime: Date.now(),
      datasetStepStatus: conversionStatuses.inProgress,
      selectedStep: conversionSteps.dataset,
    });
    startDataset(conversionId)
      .then(res => {
        if (res.status !== HTTP_STATUS_CODE.ACCEPTED) {
          res.json().then(data => {
            set({
              datasetStepStatus: conversionStatuses.failed,
              datasetOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
              datasetEndTime: Date.now(),
            });
          });
        } else {
          get().fetchDatasetStatus(res.headers.get(OPERATION_LOCATION));
        }
      })
      .catch(e => {
        set({
          datasetStepStatus: conversionStatuses.failed,
          datasetOperationLog: e.message || defaultErrorMessage,
          datasetEndTime: Date.now(),
        });
      });
  },
  fetchDatasetStatus: location => {
    if (get().uploadStartTime === null) {
      return;
    }
    fetchFromLocation(location)
      .then(async res => {
        if (res.status !== HTTP_STATUS_CODE.OK) {
          throw new Error();
        }

        const data = await res.json();

        if (data.status === LRO_STATUS.FAILED) {
          set({
            datasetStepStatus: conversionStatuses.failed,
            datasetOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
            datasetEndTime: Date.now(),
          });
        } else if (data.status === LRO_STATUS.RUNNING) {
          set(() => ({
            datasetOperationLog: JSON.stringify(data, null, 4),
          }));
          setTimeout(() => {
            get().fetchDatasetStatus(location);
          }, fetchTimeout);
        } else if (data.status === LRO_STATUS.SUCCEEDED) {
          set({
            datasetStepStatus: conversionStatuses.finishedSuccessfully,
            datasetOperationLog: JSON.stringify(data, null, 4),
            datasetEndTime: Date.now(),
          });

          fetchFromLocation(res.headers.get(RESOURCE_LOCATION))
            .then(res => res.json())
            .then(data => {
              set({
                datasetId: data.datasetId,
              });
              get().startTileset(data.datasetId);
            });
        } else {
          throw new Error(JSON.stringify(data, null, 4));
        }
      })
      .catch(e => {
        set({
          datasetStepStatus: conversionStatuses.failed,
          datasetOperationLog: e.message || defaultErrorMessage,
          datasetEndTime: Date.now(),
        });
      });
  },
  startTileset: datasetId => {
    if (get().uploadStartTime === null) {
      return;
    }
    set({
      tilesetStartTime: Date.now(),
      tilesetStepStatus: conversionStatuses.inProgress,
      selectedStep: conversionSteps.tileset,
    });
    startTileset(datasetId)
      .then(res => {
        if (res.status !== HTTP_STATUS_CODE.ACCEPTED) {
          res.json().then(data => {
            set({
              tilesetStepStatus: conversionStatuses.failed,
              tilesetOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
              tilesetEndTime: Date.now(),
            });
          });
        } else {
          get().fetchTilesetStatus(res.headers.get(OPERATION_LOCATION));
        }
      })
      .catch(e => {
        set({
          tilesetStepStatus: conversionStatuses.failed,
          tilesetOperationLog: e.message || defaultErrorMessage,
          tilesetEndTime: Date.now(),
        });
      });
  },
  fetchTilesetStatus: location => {
    if (get().uploadStartTime === null) {
      return;
    }
    fetchFromLocation(location)
      .then(async res => {
        if (res.status !== HTTP_STATUS_CODE.OK) {
          throw new Error();
        }

        const data = await res.json();

        if (data.status === LRO_STATUS.FAILED) {
          set({
            tilesetStepStatus: conversionStatuses.failed,
            tilesetOperationLog: data.error ? JSON.stringify(data.error, null, 4) : defaultErrorMessage,
            tilesetEndTime: Date.now(),
          });
        } else if (data.status === LRO_STATUS.RUNNING) {
          set(() => ({
            tilesetOperationLog: JSON.stringify(data, null, 4),
          }));
          setTimeout(() => {
            get().fetchTilesetStatus(location);
          }, fetchTimeout);
        } else if (data.status === LRO_STATUS.SUCCEEDED) {
          set({
            tilesetStepStatus: conversionStatuses.finishedSuccessfully,
            tilesetOperationLog: JSON.stringify(data, null, 4),
            tilesetEndTime: Date.now(),
            selectedStep: conversionSteps.map,
          });

          fetchFromLocation(res.headers.get(RESOURCE_LOCATION))
            .then(res => res.json())
            .then(data => {
              set({
                tilesetId: data.tilesetId,
                mapConfigurationId: data.defaultMapConfigurationId,
                bbox: data.bbox,
              });
            });
        } else {
          throw new Error(JSON.stringify(data, null, 4));
        }
      })
      .catch(e => {
        set({
          tilesetStepStatus: conversionStatuses.failed,
          tilesetOperationLog: e.message || defaultErrorMessage,
          tilesetEndTime: Date.now(),
        });
      });
  },
}));
