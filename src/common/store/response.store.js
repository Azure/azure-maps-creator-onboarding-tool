import { create } from 'zustand';

import { uploadFile, deleteFromLocation, fetchFromLocation } from 'common/api';
import { HTTP_STATUS_CODE } from 'common/constants';
import i18next from 'common/translations/i18n';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useGeometryStore } from './geometry.store';
import { useProgressBarStore } from './progress-bar-steps';
import { resetStores } from './reset';

const OPERATION_LOCATION = 'Operation-Location';
const RESOURCE_LOCATION = 'Resource-Location';
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
  operationLocation: '',
  lroStatus: '',
  errorMessage: '',
  acknowledgeError: () => set({
    errorMessage: ''
  }),
  uploadFile: (file) => {
    set(() => ({
      errorMessage: '',
      lroStatus: LRO_STATUS.UPLOADING,
    }));

    uploadFile(file)
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
    .catch(({ message }) => {
      const errorMsg = message === 'Failed to fetch' ? i18next.t('error.network.issue.cors') : message;
      set(() => ({ errorMessage: errorMsg }));
    });
  },

  // Poll the backend for the status of the upload operation
  // Uses the operationLocation set by uploadFile()
  refreshStatus: () => {
    const operationLocation = get().operationLocation;
    if (operationLocation === '') {
      return;
    }

    fetchFromLocation(operationLocation)
      .then(async (r) => {
        const data = await r.json();
        if (r.status !== HTTP_STATUS_CODE.OK) {
          if (STATUS_CODES_WITH_MEANINGFUL_ERRORS.includes(r.status)) {
            const errorMessage = data?.error?.message;
            if (errorMessage) {
              throw new Error(errorMessage);
            }
          }
          throw new Error(i18next.t('error.upload.file.processing'));
        }

        return {
          ...data,
          fetchUrl: r.headers.get(RESOURCE_LOCATION),
        };
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
          get().fetchManifestData(data.fetchUrl);
        }
      })
      .catch(({ message }) => {
        const errorMsg = message === 'Failed to fetch' ? i18next.t('error.network.issue.cors') : message;
        set(() => ({
          errorMessage: errorMsg,
          lroStatus: LRO_STATUS.FAILED,
        }));
      });
  },

  fetchManifestData: (fetchUrl) => {
    fetchFromLocation(fetchUrl)
      .then((re) => re.json())
      .then((data) => {
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
        drawing.layers.forEach(layer => {
          const polygonLayers = [];
          layerNames.add(layer.name);
          if (layer.geometry === undefined) {
            return;
          }
          if (isPolygonLayerComplete(layer)) {
            polygonLayerNames.add(layer.name);
            polygonLayers.push(layer);
          }
          if (layer.geometry.type === 'GeometryCollection') {
            layer.geometry.geometries.forEach((geometry) => {
              if (isGeometryPolygon(geometry)) {
                polygonLayerNames.add(layer.name);
                polygonLayers.push({
                  name: layer.name,
                  geometry,
                });
              }
            });
          }
          useLayersStore.getState().addPolygonLayers(polygonLayers);
        });
        drawing.textLayers.forEach(name => textLayerNames.add(name));
      });

      if (polygonLayerNames.size === 0) {
        throw new Error(i18next.t('error.no.polygonLayerNames'));
      }

      useGeometryStore.getState().updateAnchorPoint({
        coordinates: data.anchorPoint,
      });

      useLayersStore.getState().setLayerNames(
        Array.from(layerNames),
        Array.from(polygonLayerNames),
        Array.from(textLayerNames)
      );

      useLevelsStore.getState().setLevels(data.drawings.map(drawing => drawing.fileName));

      const existingManifestJson = get().existingManifestJson;

      if (existingManifestJson !== null) {
        const manifestVersion = parseInt(existingManifestJson.version);
        const jsonData = parseManifestJson(existingManifestJson);

        if (!Number.isInteger(manifestVersion) || manifestVersion < 2) {
          useProgressBarStore.getState().showIncorrectManifestVersionError();
        } else if (jsonData === null) {
          useProgressBarStore.getState().showInvalidManifestError();
        } else {
          useLevelsStore.getState().updateLevels(jsonData.levels);
          useLevelsStore.getState().setFacilityName(jsonData.facilityName);
          useLayersStore.getState().setLayerFromManifestJson(jsonData.featureClasses);
          useLayersStore.getState().setVisited();
          useGeometryStore.setState({
            dwgLayers: jsonData.dwgLayers.filter((layer) => polygonLayerNames.has(layer)),
          });
          useGeometryStore.getState().updateAnchorPoint({
            coordinates: [
              jsonData.georeference.lon,
              jsonData.georeference.lat,
            ],
            angle: jsonData.georeference.angle,
          });
        }

      }

      set(() => ({
        lroStatus: LRO_STATUS.SUCCEEDED,
      }));

      deleteFromLocation(fetchUrl);
    });
  },
}));

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
  if (typeof json.georeference?.lon !== 'number' || typeof json.georeference?.lat !== 'number' || typeof json.georeference?.angle !== 'number') {
    return null;
  }

  return {
    dwgLayers: json.buildingLevels.dwgLayers,
    facilityName: json.facilityName ?? '',
    featureClasses: json.featureClasses,
    levels: json.buildingLevels.levels,
    georeference: json.georeference,
  };
}

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

export function isPolygonLayerComplete(polygonLayer = {}) {
  if (typeof polygonLayer !== 'object' || polygonLayer === null) {
    return false;
  }
  const { name, geometry } = polygonLayer;
  if (!isGeometryPolygon(geometry)) {
    return false;
  }
  return typeof name === 'string' && typeof geometry === 'object' && geometry !== null
    && typeof geometry.type === 'string' && Array.isArray(geometry.coordinates);
}

function isGeometryPolygon(geometry = {}) {
  return geometry.type === 'MultiPolygon' || geometry.type === 'Polygon';
}