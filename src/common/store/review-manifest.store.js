import { create } from 'zustand';

import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useGeometryStore } from './geometry.store';

export const useReviewManifestStore = create((set) => ({
  isPaneShown: false,
  showPane: () => set(() => ({
    isPaneShown: true,
  })),
  hidePane: () => set(() => ({
    isPaneShown: false,
  })),
}));

const geometryStoreSelector = (s) => s.anchorPoint;
const levelsStoreSelector = (s) => s.levels;
const layersStoreSelector = (s) => s.layers;

export const useReviewManifestJson = () => {
  const layers = useLayersStore(layersStoreSelector);
  const levels = useLevelsStore(levelsStoreSelector);
  const anchorPoint = useGeometryStore(geometryStoreSelector);

  return {
    version: '2.0',
    buildingLevels: {
      levels: levels.map((level) => ({
        ...level,
        ordinal: Number(level.ordinal),
      })),
    },
    georeference: {
      lat: anchorPoint.coordinates[1],
      lon: anchorPoint.coordinates[0],
      angle: anchorPoint.angle,
    },
    featureClasses: layers.reduce((acc, layer) => {
      if (layer.isDraft) {
        return acc;
      }

      const featureClass = {
        [layer.name]: {
          dwgLayers: layer.value,
        }
      };

      layer.props.forEach((prop) => {
        if (!prop.isDraft) {
          featureClass[layer.name][prop.name] = prop.value;
        }
      });

      return {
        ...acc,
        ...featureClass,
      };
    }, {}),
  };
};