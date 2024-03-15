import { deleteFromLocation, fetchFromLocation, fetchWithRetries, uploadFile } from 'common/api';
import { clearCloudStorageData } from 'common/api/conversions';
import { HTTP_STATUS_CODE, PLACES_PREVIEW } from 'common/constants';
import i18next from 'common/translations/i18n';
import { useAssistantStore } from 'components/ai-assistant/assistant.store';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { useGeometryStore } from './geometry.store';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useProgressBarStore } from './progress-bar-steps';
import { resetStores } from './reset';
import { useReviewManifestStore } from './review-manifest.store';

const OPERATION_LOCATION = 'Operation-Location';
const RESOURCE_LOCATION = 'Resource-Location';
const defaultErrorMessage = 'Operation failed.';

export const LRO_STATUS = {
  UPLOADING: 'Uploading',
  UPLOADED: 'Uploaded',
  ACCEPTED: 'Accepted',
  FETCHING_DATA: 'FetchingData',
  RUNNING: 'Running',
  SUCCEEDED: 'Succeeded',
  FAILED: 'Failed',
};

export const useResponseStore = createWithEqualityFn(
  (set, get) => ({
    operationLocation: '',
    lroStatus: '',
    errorMessage: '',
    refreshRunning: false,
    acknowledgeError: () => {
      set({
        errorMessage: '',
      });
    },
    uploadFile: (file, { isPlacesPreview }) => {
      if (isPlacesPreview) {
        clearCloudStorageData();
      }

      set(() => ({
        errorMessage: '',
        lroStatus: LRO_STATUS.UPLOADING,
      }));

      useReviewManifestStore.getState().setOriginalPackage(file);

      uploadFile(file)
        .then(async r => {
          if (r.status !== HTTP_STATUS_CODE.ACCEPTED) {
            const data = await r.json();
            const errorMessage = data?.error?.message;
            if (errorMessage) {
              throw new Error(errorMessage);
            }
            throw new Error(i18next.t('error.upload.file'));
          }

          // Once accepted by the backend, the response will contain the location of the operation
          set(() => ({
            lroStatus: LRO_STATUS.UPLOADED,
            operationLocation: r.headers.get(OPERATION_LOCATION),
          }));
        })
        .catch(({ message }) => {
          const errorMsg = message === 'Failed to fetch' ? i18next.t('error.network.issue.cors') : message;
          set(() => ({ errorMessage: errorMsg }));
        });
    },

    // Poll the backend for the status of the upload operation
    // Uses the operationLocation set by uploadFile()
    refreshStatus: async () => {
      const operationLocation = get().operationLocation;
      const lroStatus = get().lroStatus;
      const refreshRunning = get().refreshRunning;

      if (
        operationLocation === '' ||
        lroStatus === LRO_STATUS.FETCHING_DATA ||
        lroStatus === LRO_STATUS.SUCCEEDED ||
        refreshRunning
      ) {
        return;
      }

      set({ refreshRunning: true });

      await fetchFromLocation(operationLocation)
        .then(async r => {
          const data = await r.json();
          if (r.status !== HTTP_STATUS_CODE.OK) {
            const errorMessage = data?.error?.message;
            if (errorMessage) {
              throw new Error(errorMessage);
            }
            throw new Error(i18next.t('error.upload.file.processing'));
          }

          return {
            ...data,
            fetchUrl: r.headers.get(RESOURCE_LOCATION),
          };
        })
        .then(async data => {
          if (!data || !data.status) {
            throw new Error(i18next.t('error.upload.file.processing'));
          }

          if (data.status === LRO_STATUS.RUNNING || data.status === LRO_STATUS.ACCEPTED) {
            set(() => ({ lroStatus: data.status }));
            return;
          }

          if (data.status === LRO_STATUS.FAILED) {
            const meaningfulError = getFirstMeaningfulError(data);
            const message = meaningfulError || i18next.t('error.upload.file.processing');
            throw new Error(message);
          }

          if (data.status === LRO_STATUS.SUCCEEDED) {
            set(() => ({
              lroStatus: LRO_STATUS.FETCHING_DATA,
            }));

            await get().fetchManifestData(data.fetchUrl);
          }
        })
        .catch(({ message }) => {
          const errorMsg = message === 'Failed to fetch' ? i18next.t('error.network.issue.cors') : message;
          set(() => ({
            errorMessage: errorMsg,
            lroStatus: LRO_STATUS.FAILED,
          }));
        });

      set({ refreshRunning: false });
    },

    fetchManifestData: async fetchUrl => {
      return fetchWithRetries(fetchUrl)
        .then(async data => {
          resetStores();

          // Compute and store useful response data
          const layerNames = new Set();
          const polygonLayerNames = new Set();
          const textLayerNames = new Set();

          // data.drawings = drawing[]
          // drawing = {filename, layer[]}
          // layer = {name, geometry[]}
          data.drawings.forEach(drawing => {
            useLayersStore.getState().addDwgLayers(drawing.layers, drawing.fileName);
            const polygonLayers = [];
            drawing.layers.forEach(layer => {
              layerNames.add(layer.name);
              if (layer.geometrySimplified === undefined) {
                return;
              }
              polygonLayerNames.add(layer.name);
              polygonLayers.push({
                name: layer.name,
                geometry: layer.geometrySimplified,
              });
            });
            useLayersStore.getState().addPolygonLayers(polygonLayers);
            drawing.textLayers.forEach(name => textLayerNames.add(name));
          });

          if (polygonLayerNames.size === 0) {
            throw new Error(i18next.t('error.no.polygonLayerNames'));
          }

          useGeometryStore.getState().updateAnchorPoint({
            coordinates: data.anchorPoint,
          });

          useLayersStore
            .getState()
            .setLayerNames(Array.from(layerNames), Array.from(polygonLayerNames), Array.from(textLayerNames));

          useLevelsStore.getState().setLevels(data.drawings.map(drawing => drawing.fileName));

          const existingManifestJson = await useReviewManifestStore.getState().getOriginalManifestJson();

          if (existingManifestJson !== null) {
            const jsonData = parseManifestJson(existingManifestJson);

            if (!isValidManifestVersion(existingManifestJson.version)) {
              useProgressBarStore.getState().showIncorrectManifestVersionError();
            } else if (jsonData === null) {
              useProgressBarStore.getState().showInvalidManifestError();
            } else {
              useLevelsStore.getState().updateLevels(jsonData.levels);
              useLevelsStore.getState().setFacilityName(jsonData.facilityName);
              useLevelsStore.getState().setLanguage(jsonData.language);
              useLayersStore.getState().setLayerFromManifestJson(jsonData.featureClasses);
              useLayersStore.getState().setVisited();
              useGeometryStore.setState({
                dwgLayers: jsonData.dwgLayers.filter(layer => polygonLayerNames.has(layer)),
              });
              useGeometryStore.getState().updateAnchorPoint({
                coordinates: [jsonData.georeference.lon, jsonData.georeference.lat],
                angle: jsonData.georeference.angle,
              });
            }
          }

          await useAssistantStore.getState().fetchSuggestions(data);

          set(() => ({
            lroStatus: LRO_STATUS.SUCCEEDED,
          }));

          deleteFromLocation(fetchUrl);
        })
        .catch(({ message }) => {
          const errorMsg =
            message === 'Failed to fetch' ? i18next.t('error.network.issue.cors') : message || defaultErrorMessage;
          set(() => ({
            errorMessage: errorMsg,
            lroStatus: LRO_STATUS.FAILED,
          }));
        });
    },
  }),
  shallow
);

export function parseManifestJson(json) {
  if (typeof json !== 'object' || json === null) {
    return null;
  }
  if (!Array.isArray(json.buildingLevels?.levels)) {
    return null;
  }
  if (!Array.isArray(json.buildingLevels?.dwgLayers)) {
    return null;
  }
  if (typeof json.facilityName !== 'string' && typeof json.facilityName !== 'undefined') {
    return null;
  }
  if (!Array.isArray(json.featureClasses)) {
    return null;
  }
  if (
    typeof json.georeference?.lon !== 'number' ||
    typeof json.georeference?.lat !== 'number' ||
    typeof json.georeference?.angle !== 'number'
  ) {
    return null;
  }

  return {
    dwgLayers: json.buildingLevels.dwgLayers,
    facilityName: json.facilityName ?? json.buildingName ?? '',
    featureClasses: json.featureClasses,
    levels: json.buildingLevels.levels,
    georeference: json.georeference,
    language: json.language ?? PLACES_PREVIEW.DEFAULT_LANGUAGE,
  };
}

export const isValidManifestVersion = version => {
  const manifestVersion = parseInt(version);

  if (version === PLACES_PREVIEW.VERSION) return true;
  return manifestVersion >= 2;
};

export function getFirstMeaningfulError({ error = {} }) {
  if (error.message) {
    return error.message;
  }

  const details = error.details;

  if (!details || details.length === 0) {
    return null;
  }

  for (let i = 0; i < details.length; i++) {
    const subError = details[i];
    if (subError.message) {
      return subError.message;
    }
    const subDetails = subError.details;
    if (Array.isArray(subDetails)) {
      for (let j = 0; j < subDetails.length; j++) {
        if (subDetails[j].message) {
          return subDetails[j].message;
        }
      }
    }
  }

  return null;
}
