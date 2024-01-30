import * as zip from '@zip.js/zip.js';
import { PLACES_PREVIEW } from 'common/constants';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { isNumeric } from '../functions';
import { useGeometryStore } from './geometry.store';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';

export const useReviewManifestStore = create((set, get) => ({
  manifestReviewed: false,
  originalPackage: null,
  getOriginalManifestJson: async () => {
    const { originalPackage } = get();

    if (originalPackage === null) {
      return null;
    }

    try {
      const zipFileReader = new zip.BlobReader(originalPackage);
      const zipReader = new zip.ZipReader(zipFileReader);

      const entries = await zipReader.getEntries();

      for (let i = 0; i < entries.length; i++) {
        const file = entries[i];
        if (file.filename.toLowerCase() === 'manifest.json') {
          const data = await file.getData(new zip.BlobWriter());
          return JSON.parse(await data.text());
        }
      }
    } catch (e) {
      console.warn('manifest.json in DWG ZIP archive was not read correctly. ', e);
    }
    return null;
  },
  createPackageWithJson: json => {
    const { originalPackage } = get();
    return createPackageWithJson(originalPackage, json);
  },
  getOriginalPackageName: () => {
    const { originalPackage } = get();
    if (originalPackage === null) {
      return '';
    }
    return originalPackage.name?.split('.')[0] ?? '';
  },
  setOriginalPackage: originalPackage =>
    set(() => ({
      originalPackage,
    })),
  setManifestReviewed: manifestReviewed =>
    set(() => ({
      manifestReviewed,
    })),
}));

const geometryStoreSelector = s => [s.anchorPoint, s.dwgLayers];
const levelsStoreSelector = s => [s.levels, s.facilityName, s.language];
const layersStoreSelector = s => [s.layers, s.categoryMappingEnabled, s.categoryLayer, s.categoryMapping.categoryMap];

export const useReviewManifestJson = () => {
  const [layers] = useLayersStore(layersStoreSelector, shallow);
  const [levels, facilityName] = useLevelsStore(levelsStoreSelector, shallow);
  const [anchorPoint, dwgLayers] = useGeometryStore(geometryStoreSelector, shallow);

  const json = {
    version: '2.0',
    buildingLevels: {
      dwgLayers,
      levels: levels.map(level => {
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
      .filter(layer => !layer?.isDraft)
      .map((layer = {}) => {
        const featureClass = {
          featureClassName: layer.name,
          dwgLayers: layer.value,
        };

        const props = (layer.props || []).filter(prop => !prop?.isDraft);

        if (props.length !== 0) {
          featureClass.featureClassProperties = props.map(prop => ({
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

export const usePlacesReviewManifestJson = () => {
  const [layers, categoryMappingEnabled, categoryDwgLayer, categoryMap] = useLayersStore(layersStoreSelector, shallow);
  const [levels, facilityName, language] = useLevelsStore(levelsStoreSelector, shallow);
  const [anchorPoint, dwgLayers] = useGeometryStore(geometryStoreSelector, shallow);

  const featureLayer = layers?.[0] || {};
  const propertyLayer = featureLayer.props?.[0] || {};

  const featureClass = {
    featureClassName: 'unit',
    dwgLayers: featureLayer.value,
  };

  if (categoryMappingEnabled) {
    featureClass.categoryMap = categoryMap;
    featureClass.categoryDwgLayer = categoryDwgLayer;
  }

  if (propertyLayer?.value?.length > 0) {
    featureClass.featureClassProperties = [
      {
        featureClassPropertyName: 'name',
        dwgLayers: propertyLayer.value,
      },
    ];
  }

  const json = {
    version: PLACES_PREVIEW.VERSION,
    language: language,
    buildingLevels: {
      dwgLayers,
      levels: levels.map(level => {
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
    featureClasses: [featureClass],
  };

  if (facilityName.replace(/\s/g, '').length !== 0) {
    json.buildingName = facilityName;
  }

  return json;
};

export async function createPackageWithJson(originalPackage, json) {
  const zipFileReader = new zip.BlobReader(originalPackage);
  const zipReader = new zip.ZipReader(zipFileReader);

  const newFile = new Blob([JSON.stringify(json, null, 2)], {
    type: 'application/json',
  });

  const blobWriter = new zip.BlobWriter('application/zip');
  const writer = new zip.ZipWriter(blobWriter);

  await writer.add('manifest.json', new zip.BlobReader(newFile));

  const entries = await zipReader.getEntries();

  for (let i = 0; i < entries.length; i++) {
    const file = entries[i];
    if (file.filename.toLowerCase().endsWith('.dwg')) {
      const data = await file.getData(new zip.BlobWriter());
      await writer.add(file.filename, new zip.BlobReader(data));
    }
  }

  return await writer.close();
}
