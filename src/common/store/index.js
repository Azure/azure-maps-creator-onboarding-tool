import { useProgressBarStore } from './progress-bar-steps';
import { useLayersStore } from './layers.store';
import { useGeometryStore } from './geometry.store';
import { useLevelsStore } from './levels.store';
import { useReviewManifestStore } from './review-manifest.store';

export { getDomain, useUserStore } from './user.store';
export { useResponseStore } from './response.store';
export { progressBarSteps, progressBarStepsByKey, useCompletedSteps, useProgressBarStore } from './progress-bar-steps';
export { useDissolvedExterior, useGeometryStore } from './geometry.store';
export { useLayersStore } from './layers.store';
export { useLevelsStore } from './levels.store';
export { useReviewManifestJson, useReviewManifestStore } from './review-manifest.store';
export { useConversionStore } from './conversion.store';

export function resetStores() {
  useProgressBarStore.getState().reset();
  useLayersStore.getState().reset();
  useGeometryStore.getState().reset();
  useLevelsStore.getState().reset();
  useReviewManifestStore.getState().setCanBeDownloaded(false);
}