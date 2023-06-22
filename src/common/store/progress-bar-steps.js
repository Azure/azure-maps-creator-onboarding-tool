import { shallow } from 'zustand/shallow';
import { create } from 'zustand';

import { PATHS } from '../constants';
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
export const progressBarSteps = [
  {
    key: progressBarStepsByKey.levels,
    name: 'facility.levels',
    href: PATHS.LEVELS,
  },
  {
    key: progressBarStepsByKey.createGeoreference,
    name: 'georeference',
    href: PATHS.CREATE_GEOREFERENCE,
  },
  {
    key: progressBarStepsByKey.layers,
    name: 'dwg.layers',
    href: PATHS.LAYERS,
  },
  {
    key: progressBarStepsByKey.reviewCreate,
    name: 'review.plus.create',
    href: PATHS.REVIEW_CREATE,
  },
];

const getDefaultState = () => ({
  isMissingDataErrorShown: false,
  isIncorrectManifestVersionErrorShown: false,
  isInvalidManifestErrorShown: false,
});

export const useProgressBarStore = create((set) => ({
  ...getDefaultState(),
  reset: () => set({
    ...getDefaultState(),
  }),
  showIncorrectManifestVersionError: () => set({
    isIncorrectManifestVersionErrorShown: true,
  }),
  hideIncorrectManifestVersionError: () => set({
    isIncorrectManifestVersionErrorShown: false,
  }),
  showInvalidManifestError: () => set({
    isInvalidManifestErrorShown: true,
  }),
  hideInvalidManifestError: () => set({
    isInvalidManifestErrorShown: false,
  }),
  showMissingDataError: () => set({
    isMissingDataErrorShown: true,
  }),
  hideMissingDataError: () => set({
    isMissingDataErrorShown: false,
  }),
}));

const geometrySelector = s => s.dwgLayers;
const levelsSelector = s => [s.allLevelsCompleted, s.levels, s.facilityName, s.isLevelNameValid, s.getVerticalExtentError];
const layersSelector = s => [s.allLayersValid, s.layers, s.visited];
const reviewManifestSelector = s => s.manifestReviewed;

export const useCompletedSteps = () => {
  const dwgLayers = useGeometryStore(geometrySelector);
  const [allLayersValid, layers, layersPageVisited] = useLayersStore(layersSelector);
  const [allLevelsCompleted, levels, facilityName, isLevelNameValid, getVerticalExtentError] = useLevelsStore(levelsSelector, shallow);
  const manifestReviewed = useReviewManifestStore(reviewManifestSelector);

  const completedSteps = [];

  if (dwgLayers.length > 0) {
    completedSteps.push(progressBarStepsByKey.createGeoreference);
  }
  if (layersPageVisited && allLayersValid(layers)) {
    completedSteps.push(progressBarStepsByKey.layers);
  }
  if (allLevelsCompleted(levels) && isLevelNameValid(facilityName) && levels.every((level) => getVerticalExtentError(level.verticalExtent) === null)) {
    completedSteps.push(progressBarStepsByKey.levels);
  }
  if (manifestReviewed) {
    completedSteps.push(progressBarStepsByKey.reviewCreate);
  }

  return completedSteps;
};