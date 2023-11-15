import { useProgressBarStore } from './progress-bar-steps';
import { useLayersStore } from './layers.store';
import { useGeometryStore } from './geometry.store';
import { useLevelsStore } from './levels.store';
import { useReviewManifestStore } from './review-manifest.store';

export function resetStores() {
  useProgressBarStore.getState().reset();
  useLayersStore.getState().reset();
  useGeometryStore.getState().reset();
  useLevelsStore.getState().reset();
  useReviewManifestStore.getState().setManifestReviewed(false);
}
