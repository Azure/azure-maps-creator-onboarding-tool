import { useFeatureFlags } from 'hooks';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { PATHS } from '../constants';
import { useIMDFConversionStatus } from './conversion.store';
import { useGeometryStore } from './geometry.store';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useReviewManifestStore } from './review-manifest.store';

export const progressBarStepsByKey = {
  createGeoreference: 'createGeoreference',
  layers: 'layers',
  levels: 'levels',
  reviewCreate: 'reviewCreate',
};

export const useProgressBarSteps = () => {
  const { isPlacesPreview } = useFeatureFlags();

  const { isRunningIMDFConversion } = useIMDFConversionStatus();

  return [
    {
      key: progressBarStepsByKey.levels,
      name: isPlacesPreview ? 'building.levels' : 'facility.levels',
      href: PATHS.LEVELS,
      disabled: isRunningIMDFConversion,
    },
    {
      key: progressBarStepsByKey.createGeoreference,
      name: 'georeference',
      href: PATHS.CREATE_GEOREFERENCE,
      disabled: isRunningIMDFConversion,
    },
    {
      key: progressBarStepsByKey.layers,
      name: isPlacesPreview ? 'dwg.units' : 'dwg.layers',
      href: PATHS.LAYERS,
      disabled: isRunningIMDFConversion,
    },
    {
      key: progressBarStepsByKey.reviewCreate,
      name: isPlacesPreview ? 'review.plus.convert' : 'review.plus.create',
      href: PATHS.REVIEW_CREATE,
      disabled: isRunningIMDFConversion,
    },
  ];
};

const getDefaultState = () => ({
  isMissingDataErrorShown: false,
  isIncorrectManifestVersionErrorShown: false,
  isInvalidManifestErrorShown: false,
});

export const useProgressBarStore = create(set => ({
  ...getDefaultState(),
  reset: () =>
    set({
      ...getDefaultState(),
    }),
  showIncorrectManifestVersionError: () =>
    set({
      isIncorrectManifestVersionErrorShown: true,
    }),
  hideIncorrectManifestVersionError: () =>
    set({
      isIncorrectManifestVersionErrorShown: false,
    }),
  showInvalidManifestError: () =>
    set({
      isInvalidManifestErrorShown: true,
    }),
  hideInvalidManifestError: () =>
    set({
      isInvalidManifestErrorShown: false,
    }),
  showMissingDataError: () =>
    set({
      isMissingDataErrorShown: true,
    }),
  hideMissingDataError: () =>
    set({
      isMissingDataErrorShown: false,
    }),
}));

const geometrySelector = s => s.dwgLayers;
const levelsSelector = s => [
  s.allLevelsCompleted,
  s.levels,
  s.facilityName,
  s.isLevelNameValid,
  s.getVerticalExtentError,
];
const layersSelector = s => [
  s.allLayersValid,
  s.layers,
  s.visited,
  s.categoryMappingEnabled,
  s.categoryLayer,
  s.categoryMapping.isMappingValid,
];
const reviewManifestSelector = s => s.manifestReviewed;

export const useCompletedSteps = () => {
  const dwgLayers = useGeometryStore(geometrySelector);
  const [allLayersValid, layers, layersPageVisited, categoryMappingEnabled, categoryLayer, isMappingValid] =
    useLayersStore(layersSelector, shallow);
  const [allLevelsCompleted, levels, facilityName, isLevelNameValid, getVerticalExtentError] = useLevelsStore(
    levelsSelector,
    shallow
  );
  const manifestReviewed = useReviewManifestStore(reviewManifestSelector);
  const { isPlacesPreview } = useFeatureFlags();

  const completedSteps = [];

  if (dwgLayers.length > 0) {
    completedSteps.push(progressBarStepsByKey.createGeoreference);
  }

  // Validate layers
  if (isPlacesPreview) {
    const { value = [] } = layers[0] || {};
    if (value.length > 0) {
      // Check mapping
      if (categoryMappingEnabled) {
        if (categoryLayer && isMappingValid) completedSteps.push(progressBarStepsByKey.layers);
      } else {
        completedSteps.push(progressBarStepsByKey.layers);
      }
    }
  } else {
    if (layersPageVisited && allLayersValid(layers)) {
      completedSteps.push(progressBarStepsByKey.layers);
    }
  }

  // Facility (Building) name is required for places preview
  if (
    (!isPlacesPreview || facilityName.length > 0) &&
    allLevelsCompleted(levels) &&
    isLevelNameValid(facilityName) &&
    levels.every(level => getVerticalExtentError(level.verticalExtent) === null)
  ) {
    completedSteps.push(progressBarStepsByKey.levels);
  }
  if (manifestReviewed) {
    completedSteps.push(progressBarStepsByKey.reviewCreate);
  }

  return completedSteps;
};

const progressBarSelector = s => s.isMissingDataErrorShown;
export const useValidationStatus = () => {
  const isProgressBarErrorShown = useProgressBarStore(progressBarSelector);
  const completedSteps = useCompletedSteps();
  const progressBarSteps = useProgressBarSteps();

  return {
    success: completedSteps.length === progressBarSteps.length,
    failed: isProgressBarErrorShown,
  };
};
