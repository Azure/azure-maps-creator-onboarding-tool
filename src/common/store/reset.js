import { useGeometryStore } from './geometry.store';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useProgressBarStore } from './progress-bar-steps.store';
import { useReviewManifestStore } from './review-manifest.store';

export function resetStores() {
  useProgressBarStore.getState().reset();
  useLayersStore.getState().reset();
  useGeometryStore.getState().reset();
  useLevelsStore.getState().reset();
  useReviewManifestStore.getState().reset();
}
