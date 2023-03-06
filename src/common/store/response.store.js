import { create } from 'zustand';

import { fetchStatus, HTTP_STATUS_CODE, uploadFile } from 'common/api';
import i18next from 'common/translations/i18n';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useGeometryStore } from './geometry.store';
import { useProgressBarStore } from './progress-bar-steps';

const OPERATION_LOCATION = 'Operation-Location';
const STATUS_CODES_WITH_MEANINGFUL_ERRORS = [
  HTTP_STATUS_CODE.BAD_REQUEST,
  HTTP_STATUS_CODE.UNAUTHORIZED,
  HTTP_STATUS_CODE.FORBIDDEN,
  HTTP_STATUS_CODE.TOO_MANY_REQUESTS
];
const ERROR_CODES_WITH_MEANINGFUL_ERRORS = ['dwgError', 'invalidArchiveFormat', 'packagingError'];

export const LRO_STATUS = {
  UPLOADING: 'Uploading',
  UPLOADED: 'Uploaded',
  ACCEPTED: 'Accepted',
  RUNNING: 'Running',
  SUCCEEDED: 'Succeeded',
  FAILED: 'Failed',
};

export const useResponseStore = create((set, get) => ({
  existingManifestJson: null,
  setExistingManifestJson: (json) => set(() => ({
    existingManifestJson: json,
  })),
  // Operation-Location header from the uploadFile() response, used to poll for the status of the operation
  operationLocation: '',

  // LRO status from the fetchStatus() response
  lroStatus: '',

  // Error message to display to the user if an error occurs during API calls
  errorMessage: '',

  acknowledgeError: () => set({
    errorMessage: ''
  }),

  // Submit the zip package for processing on the backend
  uploadFile: async (file, geography, subscriptionKey) => {
    set(() => ({
      // Reset the error message, since upload is the first step in the process
      errorMessage: '',
      lroStatus: LRO_STATUS.UPLOADING,
    }));

    // Upload the zip package to the backend
    uploadFile(file, geography, subscriptionKey)
    .then(async (r) => {
      if (r.status !== HTTP_STATUS_CODE.ACCEPTED) {
        if (STATUS_CODES_WITH_MEANINGFUL_ERRORS.includes(r.status)) {
          const data = await r.json();
          const errorMessage = data?.error?.message;
          if (errorMessage) {
            throw new Error(errorMessage);
          }
        }
        throw new Error(i18next.t('error.upload.file'));
      }

      // Once accepted by the backend, the response will contain the location of the operation
      set(() => ({
        lroStatus: LRO_STATUS.UPLOADED,
        operationLocation: r.headers.get(OPERATION_LOCATION),
      }));
    })
    .catch((e) => {
      set(() => ({ errorMessage: e.message }));
    });
  },

  // Poll the backend for the status of the upload operation
  // Uses the operationLocation set by uploadFile()
  refreshStatus: async (subscriptionKey) => {
    const operationLocation = get().operationLocation;
    if (operationLocation === '') {
      return;
    }

    fetchStatus(operationLocation, subscriptionKey)
      .then(async (r) => {
        if (r.status !== HTTP_STATUS_CODE.OK) {
          if (STATUS_CODES_WITH_MEANINGFUL_ERRORS.includes(r.status)) {
            const data = await r.json();
            const errorMessage = data?.error?.message;
            if (errorMessage) {
              throw new Error(errorMessage);
            }
          }
          throw new Error(i18next.t('error.upload.file.processing'));
        }

        return r.json();
      })
      .then((data) => {
        if (!data || !data.status) {
          throw new Error(i18next.t('error.upload.file.processing'));
        }

        if (data.status === LRO_STATUS.RUNNING || data.status === LRO_STATUS.ACCEPTED) {
          set(() => ({ lroStatus: data.status }));
          return;
        }

        if (data.status === LRO_STATUS.FAILED) {
          const meaningfulError = getFirstMeaningfulError(data);
          const message = meaningfulError?.message || i18next.t('error.upload.file.processing');
          throw new Error(message);
        }

        if (data.status === LRO_STATUS.SUCCEEDED) {
          // If successful, the server should return manifestToolSupportingData object
          // We should always assume that the server will return the data in the same format
          let parsed;
          try {
            parsed = JSON.parse(data.properties.manifestToolSupportingData);
          } catch {
            parsed = {};
          }

          useProgressBarStore.getState().hideError();
          useLayersStore.getState().reset();
          useGeometryStore.getState().reset();
          useLevelsStore.getState().reset();

          // Compute and store useful response data
          const layerNames = new Set();
          const polygonLayerNames = new Set();
          const textLayerNames = new Set();

          // parsed.drawings = drawing[]
          // drawing = {filename, layer[]}
          // layer = {name, geometry[]}
          parsed.drawings.forEach(drawing => {
            drawing.layers.forEach(layer => layerNames.add(layer));
            drawing.polygonLayers.forEach(layer => polygonLayerNames.add(layer.name));
            useLayersStore.getState().addPolygonLayers(drawing.polygonLayers);
            drawing.textLayers.forEach(name => textLayerNames.add(name));
          });

          if (polygonLayerNames.size === 0) {
            throw new Error(i18next.t('error.no.polygonLayerNames'));
          }

          useGeometryStore.getState().updateAnchorPoint({
            coordinates: parsed.anchorPoint,
          });

          useLayersStore.getState().setLayerNames(
            Array.from(layerNames),
            Array.from(polygonLayerNames),
            Array.from(textLayerNames)
          );

          useLevelsStore.getState().setLevels(parsed.drawings.map(drawing => drawing.fileName));

          const existingManifestJson = get().existingManifestJson;

          if (existingManifestJson !== null) {
            useLevelsStore.getState().updateLevels(existingManifestJson.buildingLevels.levels);
            useLevelsStore.getState().setFacilityName(existingManifestJson.facilityName);
            useLayersStore.getState().setLayerFromManifestJson(existingManifestJson.featureClasses);
            useLayersStore.getState().setVisited();
            useGeometryStore.setState({
              dwgLayers: existingManifestJson.buildingLevels.dwgLayers.filter((layer) => polygonLayerNames.has(layer)),
            });
            useGeometryStore.getState().updateAnchorPoint({
              coordinates: [
                existingManifestJson.georeference?.lon ?? 0,
                existingManifestJson.georeference?.lat ?? 0,
              ],
              angle: existingManifestJson.georeference?.angle ?? 0,
            });
          }

          set(() => ({
            lroStatus: LRO_STATUS.SUCCEEDED,
          }));
        }
      })
      .catch((e) => {
        set(() => ({
          errorMessage: e.message,
          lroStatus: LRO_STATUS.FAILED,
        }));
      });
  },
}));

export function getFirstMeaningfulError(data) {
  const details = data?.error?.details ?? [];

  for (let i = 0; i < details.length; i++) {
    const meaningfulError = details[0].details.find((error) => ERROR_CODES_WITH_MEANINGFUL_ERRORS.includes(error.code));
    if (meaningfulError) {
      return meaningfulError;
    }
  }

  return null;
}