import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useGeometryStore } from './geometry.store';
import { isNumeric } from '../functions';

export const useReviewManifestStore = create((set) => ({
  canBeDownloaded: false,
  originalPackage: null,
  setOriginalPackage: (originalPackage) => set(() => ({
    originalPackage,
  })),
  setCanBeDownloaded: (canBeDownloaded) => set(() => ({
    canBeDownloaded,
  })),
}));

const geometryStoreSelector = (s) => [s.anchorPoint, s.dwgLayers];
const levelsStoreSelector = (s) => [s.levels, s.facilityName];
const layersStoreSelector = (s) => s.layers;

export const useReviewManifestJson = () => {
  const layers = useLayersStore(layersStoreSelector);
  const [levels, facilityName] = useLevelsStore(levelsStoreSelector, shallow);
  const [anchorPoint, dwgLayers] = useGeometryStore(geometryStoreSelector, shallow);

  const json = {
    version: '2.0',
    buildingLevels: {
      dwgLayers,
      levels: levels.map((level) => {
        const formattedLevel = {
          ...level,
          ordinal: Number(level.ordinal),
        };
        if (isNumeric(formattedLevel.verticalExtent)) {
          formattedLevel.verticalExtent = Number(formattedLevel.verticalExtent);
        } else {
          delete formattedLevel.verticalExtent;
        }
        return formattedLevel;
      }),
    },
    georeference: {
      lat: anchorPoint.coordinates[1],
      lon: anchorPoint.coordinates[0],
      angle: anchorPoint.angle,
    },
    featureClasses: layers
      .filter((layer) => !layer.isDraft)
      .map((layer) => {
        const featureClass = {
          featureClassName: layer.name,
          dwgLayers: layer.value,
        };

        const props = layer.props.filter((prop) => !prop.isDraft);

        if (props.length !== 0) {
          featureClass.featureClassProperties = props.map((prop) => ({
            featureClassPropertyName: prop.name,
            dwgLayers: prop.value,
          }));
        }

        return featureClass;
      }, {}),
  };

  if (facilityName.replace(/\s/g, '').length !== 0) {
    json.facilityName = facilityName;
  }

  return json;
};