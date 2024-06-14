import * as zip from '@zip.js/zip.js';
import { PLACES_PREVIEW } from 'common/constants';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { isNumeric } from '../functions';
import { useGeometryStore } from './geometry.store';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';

const getDefaultState = () => ({
  manifestReviewed: false,
  originalPackage: null,
  manifestImported: false,
});

export const useReviewManifestStore = createWithEqualityFn(
  (set, get) => ({
    ...getDefaultState(),
    reset: () =>
      set({
        ...getDefaultState(),
      }),
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
    setManifestImported: manifestImported =>
      set(() => ({
        manifestImported,
      })),
  }),
  shallow
);

const geometryStoreSelector = s => [s.anchorPoint, s.dwgLayers];
const levelsStoreSelector = s => [s.levels, s.facilityName, s.language];
const layersStoreSelector = s => [s.layers, s.categoryMappingEnabled, s.categoryLayer, s.categoryMapping.categoryMap];

export const useReviewManifestJson = () => {
  const [layers] = useLayersStore(layersStoreSelector);
  const [levels, facilityName] = useLevelsStore(levelsStoreSelector);
  const [anchorPoint, dwgLayers] = useGeometryStore(geometryStoreSelector);

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
      angle: fixAngleForManifest(anchorPoint.angle),
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
  const [layers, categoryMappingEnabled, categoryDwgLayer, categoryMap] = useLayersStore(layersStoreSelector);
  const [levels, facilityName, language] = useLevelsStore(levelsStoreSelector);
  const [anchorPoint, dwgLayers] = useGeometryStore(geometryStoreSelector);

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
          filename: level.filename,
          levelName: level.levelName,
          ordinal: Number(level.ordinal),
        };

        return formattedLevel;
      }),
    },
    georeference: {
      lat: anchorPoint.coordinates[1],
      lon: anchorPoint.coordinates[0],
      angle: fixAngleForManifest(anchorPoint.angle),
    },
    featureClasses: [featureClass],
  };

  if (facilityName.replace(/\s/g, '').length !== 0) {
    json.buildingName = facilityName;
  }

  return json;
};

export const fixAngleForManifest = angle => {
  if (Math.abs(angle) === 360) {
    return 0;
  }
  return angle;
};

const isHiddenFile = fileName => {
  const parts = fileName.split('/');

  for (let part of parts) {
    if (part.startsWith('.')) {
      return true;
    }
  }

  return false;
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
    const fileName = file.filename.toLowerCase();
    if (!isHiddenFile(fileName) && fileName.endsWith('.dwg')) {
      const data = await file.getData(new zip.BlobWriter());
      await writer.add(file.filename, new zip.BlobReader(data));
    }
  }

  return await writer.close();
}

export async function repackPackage(originalPackage) {
  return new Promise(async resolve => {
    const zipFileReader = new zip.BlobReader(originalPackage);
    const zipReader = new zip.ZipReader(zipFileReader);

    const blobWriter = new zip.BlobWriter('application/zip');
    const writer = new zip.ZipWriter(blobWriter);

    const entries = await zipReader.getEntries();

    for (let i = 0; i < entries.length; i++) {
      const file = entries[i];
      const fileName = file.filename.toLowerCase();
      // File name is absolute path in the zip root, that is why we are using .endsWith()
      if (!isHiddenFile(fileName) && (fileName.endsWith('.dwg') || fileName.endsWith('manifest.json'))) {
        const data = await file.getData(new zip.BlobWriter());
        await writer.add(file.filename, new zip.BlobReader(data));
      }
    }

    const fileContent = await writer.close();
    resolve(fileContent);
  });
}
