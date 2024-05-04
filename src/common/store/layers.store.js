import { imdfCategories } from 'common/imdf-categories';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import nextId from 'react-id-generator';
import { getFeatureFlags } from 'utils';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { PLACES_PREVIEW, TRUNCATE_FRACTION_DIGITS } from '../constants';

const systemReservedLayerNames = ['facility', 'level'];
const systemReservedPropNames = ['levelid', 'levelordinal', 'layername', 'id'];
const featureClassNameAllowedSymbols = new RegExp(/^[0-9a-z_]+$/i);

export const useLayersStore = createWithEqualityFn(
  (set, get) => ({
    ...getDefaultState(),
    reset: () =>
      set({
        ...getDefaultState(),
      }),
    setVisited: () =>
      set({
        visited: true,
      }),
    setCategoryMappingEnabled: categoryMappingEnabled => {
      set({
        categoryMappingEnabled,
      });
    },
    setCategoryLayerValueOnly: categoryLayer => {
      set(() => {
        return {
          categoryLayer,
        };
      });
    },
    setCategoryLayer: categoryLayer => {
      set(prev => {
        const dwgLabels =
          prev.textLayers.filter(t => t.name === categoryLayer).flatMap(t => t?.textList?.map(t => t.value.toLowerCase().trim())).filter(hasValueAndUnique) || [];
        const dwgMap = {};
        dwgLabels.forEach(label => (dwgMap[label] = PLACES_PREVIEW.DEFAULT_IMDF_CATEGORY));
        return {
          categoryLayer,
          categoryMapping: {
            ...prev.categoryMapping,
            categoryMap: { ...dwgMap, ...prev.categoryMapping.fileCategoryMap },
          },
        };
      });
    },
    updateCategoryMapping: (newMappings = {}) => {
      set(prev => {
        const newCategoryMap = { ...prev.categoryMapping.categoryMap, ...newMappings };
        return {
          categoryMapping: {
            ...prev.categoryMapping,
            categoryMap: newCategoryMap,
          },
        };
      });
    },
    uploadCategoryMapping: (mappingFile, errorMessage = null) => {
      let isMappingValid = false;
      let fileCategoryMap = {};
      let message = null;

      if (!mappingFile) {
        toast.error(errorMessage);
        return set({
          categoryMapping: { ...getDefaultState().categoryMapping, message: errorMessage },
        });
      }

      Papa.parse(mappingFile, {
        header: false,
        skipEmptyLines: true,
        complete: results => {
          const { data } = results;
          const mapping = {};

          if (data.length > 2000) {
            message = 'Maximum number of rows is 2000.';
          } else {
            data.forEach((row, index) => {
              // Check if row has 2 columns
              if (row?.length !== 2) {
                console.log('Invalid row', row);
                message = `Error uploading category map. Each row must have 2 columns (row ${index + 1}).`;
                return;
              }
              // if the key already exists
              const key = row[0].toLowerCase().trim();
              const value = row[1].trim();

              if (mapping[key]) {
                console.log('Duplicate key', key);
                message = `Error uploading category map. Duplicate key found (row ${index + 1}).`;
                return;
              }

              if (!imdfCategories.includes(value)) {
                console.log('Invalid IMDF category', value);
                message = `Error uploading category map. In row ${index + 1}, "${value}" is not a valid IMDF category.`;
                return;
              }
              // Map the key to the value
              mapping[key] = value;
            });
          }

          if (!message) {
            isMappingValid = true;
            fileCategoryMap = mapping;
            message = 'Mapping file successfully imported.';
            toast.success(message);
          } else {
            toast.error(message);
          }

          set(prev => ({
            categoryMapping: {
              ...prev.categoryMapping,
              file: isMappingValid ? mappingFile : null,
              fileCategoryMap,
              categoryMap: { ...prev.categoryMapping.categoryMap, ...fileCategoryMap },
              message,
            },
          }));
        },
      });
    },
    setPreviewSingleFeatureClass: previewSingleFeatureClass =>
      set({
        previewSingleFeatureClass,
      }),
    addPolygonLayers: polygonLayers =>
      set(state => ({
        polygonLayers: state.polygonLayers.concat(truncateCoordinates(polygonLayers)),
      })),
    addTextLayers: textLayers =>
      set(state => ({
        textLayers: state.textLayers.concat(textLayers),
      })),
    addDwgLayers: (dwgLayers, fileName) =>
      set(state => ({
        dwgLayers: {
          ...state.dwgLayers,
          [fileName]: dwgLayers,
        },
      })),
    setLayerNames: (layerNames, polygonLayerNames, textLayerNames) => {
      set(() => ({
        layerNames: layerNames.sort((a, b) => a.localeCompare(b)),
        polygonLayerNames: polygonLayerNames.sort((a, b) => a.localeCompare(b)),
        textLayerNames: textLayerNames.sort((a, b) => a.localeCompare(b)),
      }));
    },
    setLayerFromManifestJson: (layers = []) => {
      if (!checkIfLayersValid(layers)) {
        return;
      }

      const convertedLayers = convertLayersFromManifestJson(layers, get().textLayerNames, get().layerNames);

      const mappingData = {};
      const categoryDwgLayer = layers?.[0]?.categoryDwgLayer;

      if (categoryDwgLayer) {
        mappingData.categoryLayer = categoryDwgLayer;
        mappingData.categoryMappingEnabled = true;
      }

      set({
        ...mappingData,
        layers: convertedLayers,
      });
    },
    updateLayer: (id, data) =>
      set(state => {
        let isUpdatingDraft;

        const updatedState = {
          layers: state.layers.map(layer => {
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
              updatedLayer.props = [
                {
                  id: nextId(),
                  name: '',
                  isDraft: true,
                  value: [],
                },
              ];
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
    deleteLayer: id =>
      set(state => ({
        layers: state.layers.filter(layer => layer.id !== id),
      })),
    deleteProperty: (layerId, propertyId) =>
      set(state => ({
        layers: state.layers.map(layer => {
          if (layer.id !== layerId) {
            return layer;
          }
          return {
            ...layer,
            props: layer.props.filter(property => property.id !== propertyId),
          };
        }),
      })),
    updateProperty: (parentId, id, data) =>
      set(state => {
        let isUpdatingDraft;

        return {
          layers: state.layers.map(layer => {
            if (layer.id !== parentId) {
              return layer;
            }
            const updatedProps = layer.props.map(property => {
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
    getLayerNameError: layerName => {
      const { isPlacesPreview } = getFeatureFlags();
      // For places preview, name is automatically generated
      if (isPlacesPreview) return null;

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
      const parentLayer = layers.find(layer => layer.id === parentId);
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
    allLayersValid: layers => {
      const { getLayerNameError, getPropertyNameError } = get();

      return layers.every(layer => {
        if (layer.isDraft) {
          return true;
        }
        if (getLayerNameError(layer.name) !== null) {
          return false;
        }
        if (layer.props.length > 0) {
          return layer.props.every(prop => {
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
  shallow
);

export function checkIfLayersValid(layers) {
  if (!Array.isArray(layers)) {
    return false;
  }
  return layers.every(layer => {
    if (typeof layer.featureClassName !== 'string' || !Array.isArray(layer.dwgLayers)) {
      return false;
    }
    if (!Array.isArray(layer.featureClassProperties) && layer.featureClassProperties !== undefined) {
      return false;
    }
    if (
      Array.isArray(layer.featureClassProperties) &&
      !layer.featureClassProperties.every(
        prop => typeof prop.featureClassPropertyName === 'string' && Array.isArray(prop.dwgLayers)
      )
    ) {
      return false;
    }
    return true;
  });
}

export function getDefaultState() {
  return {
    categoryMappingEnabled: true,
    categoryLayer: undefined,
    categoryMapping: {
      file: null,
      fileCategoryMap: {},
      categoryMap: {},
      message: null,
    },
    dwgLayers: {},
    layerNames: [],
    polygonLayers: [],
    polygonLayerNames: [],
    textLayers: [],
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
      },
    ],
  };
}

// added this due to bug in turf.js appearing in some cases when applying union function
// steps to reproduce the bug: upload msft building 111 and choose layers AK-ROOM and AK-WALL
// expected error message: Unhandled Thrown Error! Unable to complete output ring starting at [0.009363126608, 0.000104200207]. Last matching segment found ends at [0.009427818866, 0.001071406505].
// got the idea of truncation from https://github.com/mfogel/polygon-clipping/issues/91
// Also have a feeling that it might not be related to turf, but is rather caused by poor handling of floating numbers in javascript.
export function truncateCoordinates(polygonLayers) {
  return polygonLayers.map(layer => {
    return {
      name: layer.name,
      geometry: {
        type: layer.geometry.type,
        coordinates: truncateRecursively(layer.geometry.coordinates),
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
  return layers
    .map(({ featureClassName, dwgLayers, featureClassProperties = [] }) => ({
      id: nextId(),
      name: featureClassName,
      isDraft: false,
      props: featureClassProperties
        .map(({ featureClassPropertyName, dwgLayers }) => ({
          id: nextId(),
          name: featureClassPropertyName,
          isDraft: false,
          value: dwgLayers.filter(layer => allowedTextLayerNames.includes(layer)),
        }))
        .concat({
          id: nextId(),
          name: '',
          isDraft: true,
          value: [],
        }),
      value: dwgLayers.filter(layer => allowedLayerNames.includes(layer)),
    }))
    .concat({
      id: nextId(),
      name: '',
      value: [],
      props: [],
      isDraft: true,
    });
}

function hasValueAndUnique(value, index, array) {
  return value !== undefined && array.indexOf(value) === index;
}
