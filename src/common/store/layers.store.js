import { create } from 'zustand';
import nextId from 'react-id-generator';

import { TRUNCATE_FRACTION_DIGITS } from '../constants';

const systemReservedLayerNames = ['facility', 'level'];
const systemReservedPropNames = ['levelid', 'levelordinal', 'layername', 'id'];
const featureClassNameAllowedSymbols = new RegExp(/^[0-9a-z_]+$/i);

export const useLayersStore = create(
  (set, get) => ({
    ...getDefaultState(),
    reset: () => set({
      ...getDefaultState(),
    }),
    setVisited: () => set({
      visited: true,
    }),
    setPreviewSingleFeatureClass: (previewSingleFeatureClass) => set({
      previewSingleFeatureClass,
    }),
    addPolygonLayers: (polygonLayers) => set((state) => ({
      polygonLayers: state.polygonLayers.concat(truncateCoordinates(polygonLayers)),
    })),
    addDwgLayers: (dwgLayers, fileName) => set((state) => ({
      dwgLayers: {
        ...state.dwgLayers,
        [fileName]: dwgLayers,
      },
    })),
    setLayerNames: (layerNames, polygonLayerNames, textLayerNames) => set(() => ({
      layerNames: layerNames.sort((a, b) => a.localeCompare(b)),
      polygonLayerNames: polygonLayerNames.sort((a, b) => a.localeCompare(b)),
      textLayerNames: textLayerNames.sort((a, b) => a.localeCompare(b)),
    })),
    setLayerFromManifestJson: (layers = []) => {
      if (!checkIfLayersValid(layers)) {
        return;
      }

      const convertedLayers = convertLayersFromManifestJson(
        layers,
        get().textLayerNames,
        get().layerNames,
      );

      set({
        layers: convertedLayers,
      });
    },
    updateLayer: (id, data) => set((state) => {
      let isUpdatingDraft;

      const updatedState = {
        layers: state.layers.map((layer) => {
          if (layer.id !== id) {
            return layer;
          }
          isUpdatingDraft = layer.isDraft;
          const updatedLayer = {
            ...layer,
            ...data,
            isDraft: false,
          };

          if (isUpdatingDraft) {
            updatedLayer.props = [{
              id: nextId(),
              name: '',
              isDraft: true,
              value: [],
            }];
          }

          return updatedLayer;
        }),
      };

      if (isUpdatingDraft) {
        updatedState.layers.push({
          id: nextId(),
          name: '',
          value: [],
          props: [],
          isDraft: true,
        });
      }

      return updatedState;
    }),
    deleteLayer: (id) => set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
    })),
    deleteProperty: (layerId, propertyId) => set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== layerId) {
          return layer;
        }
        return {
          ...layer,
          props: layer.props.filter((property) => property.id !== propertyId),
        };
      }),
    })),
    updateProperty: (parentId, id, data) => set((state) => {
      let isUpdatingDraft;

      return {
        layers: state.layers.map((layer) => {
          if (layer.id !== parentId) {
            return layer;
          }
          const updatedProps = layer.props.map((property) => {
            if (property.id !== id) {
              return property;
            }
            isUpdatingDraft = property.isDraft;
            return {
              ...property,
              ...data,
              isDraft: false,
            };
          });

          if (isUpdatingDraft) {
            updatedProps.push({
              id: nextId(),
              name: '',
              isDraft: true,
              value: [],
            });
          }

          return {
            ...layer,
            props: updatedProps,
          };
        }),
      };
    }),
    getLayerNameError: (layerName) => {
      if (!layerName) {
        return 'error.layer.name.cannot.be.empty';
      }
      if (systemReservedLayerNames.includes(layerName.toLowerCase())) {
        return 'error.layer.name.not.allowed';
      }

      const { layers } = get();
      let layersWithThisNameCntr = 0;

      for (let i = 0; i < layers.length; i++) {
        if (layers[i].name.toLowerCase() === layerName.toLowerCase()) {
          layersWithThisNameCntr++;
        }
        if (layersWithThisNameCntr > 1) {
          return 'error.layer.name.must.be.unique';
        }
      }

      if (!layerName[0].match(/[a-z]/i)) {
        return 'error.layer.name.should.begin.with.letter';
      }
      if (!featureClassNameAllowedSymbols.test(layerName)) {
        return 'error.layer.name.contains.illegal.characters';
      }

      return null;
    },
    getPropertyNameError: (parentId, propertyName) => {
      if (!propertyName) {
        return 'error.prop.name.cannot.be.empty';
      }
      if (systemReservedPropNames.includes(propertyName.toLowerCase())) {
        return 'error.prop.name.not.allowed';
      }

      const { layers } = get();
      const parentLayer = layers.find((layer) => layer.id === parentId);
      let propsWithThisNameCntr = 0;

      for (let i = 0; i < parentLayer.props.length; i++) {
        if (parentLayer.props[i].name.toLowerCase() === propertyName.toLowerCase()) {
          propsWithThisNameCntr++;
        }
        if (propsWithThisNameCntr > 1) {
          return 'error.prop.name.must.be.unique';
        }
      }

      if (!propertyName[0].match(/[a-z]/i)) {
        return 'error.prop.name.should.begin.with.letter';
      }
      if (!featureClassNameAllowedSymbols.test(propertyName)) {
        return 'error.prop.name.contains.illegal.characters';
      }

      return null;
    },
    allLayersValid: (layers) => {
      const { getLayerNameError, getPropertyNameError } = get();

      return layers.every((layer) => {
        if (layer.isDraft) {
          return true;
        }
        if (getLayerNameError(layer.name) !== null) {
          return false;
        }
        if (layer.props.length > 0) {
          return layer.props.every((prop) => {
            if (prop.isDraft) {
              return true;
            }
            return getPropertyNameError(layer.id, prop.name) === null;
          });
        }
        return true;
      });
    },
  }),
);

export function checkIfLayersValid(layers) {
  if (!Array.isArray(layers)) {
    return false;
  }
  return layers.every((layer) => {
    if (typeof layer.featureClassName !== 'string' || !Array.isArray(layer.dwgLayers)) {
      return false;
    }
    if (!Array.isArray(layer.featureClassProperties) && layer.featureClassProperties !== undefined) {
      return false;
    }
    if (Array.isArray(layer.featureClassProperties)
      && !layer.featureClassProperties.every((prop) => typeof prop.featureClassPropertyName === 'string' && Array.isArray(prop.dwgLayers))) {
      return false;
    }
    return true;
  });
}

export function getDefaultState() {
  return {
    dwgLayers: {},
    layerNames: [],
    polygonLayers: [],
    polygonLayerNames: [],
    textLayerNames: [],
    previewSingleFeatureClass: null,
    visited: false,
    layers: [
      {
        id: nextId(),
        name: '',
        value: [],
        props: [],
        isDraft: true,
      }
    ],
  };
}

// added this due to bug in turf.js appearing in some cases when applying union function
// steps to reproduce the bug: upload msft building 111 and choose layers AK-ROOM and AK-WALL
// expected error message: Unhandled Thrown Error! Unable to complete output ring starting at [0.009363126608, 0.000104200207]. Last matching segment found ends at [0.009427818866, 0.001071406505].
// got the idea of truncation from https://github.com/mfogel/polygon-clipping/issues/91
// Also have a feeling that it might not be related to turf, but is rather caused by poor handling of floating numbers in javascript.
export function truncateCoordinates(polygonLayers) {
  return polygonLayers.map((layer) => {
    return {
      name: layer.name,
      geometry: {
        type: layer.geometry.type,
        coordinates: truncateRecursively(layer.geometry.coordinates)
      },
    };
  });
}

function truncateRecursively(coordinates) {
  if (typeof coordinates === 'number') {
    return parseFloat(coordinates.toFixed(TRUNCATE_FRACTION_DIGITS));
  }
  return coordinates.map(truncateRecursively);
}

export function convertLayersFromManifestJson(layers, allowedTextLayerNames, allowedLayerNames) {
  return layers.map(({ featureClassName, dwgLayers, featureClassProperties = [] }) => ({
    id: nextId(),
    name: featureClassName,
    isDraft: false,
    props: featureClassProperties.map(({ featureClassPropertyName, dwgLayers }) => ({
      id: nextId(),
      name: featureClassPropertyName,
      isDraft: false,
      value: dwgLayers.filter((layer) => allowedTextLayerNames.includes(layer)),
    })).concat({
      id: nextId(),
      name: '',
      isDraft: true,
      value: [],
    }),
    value: dwgLayers.filter((layer) => allowedLayerNames.includes(layer)),
  })).concat({
    id: nextId(),
    name: '',
    value: [],
    props: [],
    isDraft: true,
  });
}