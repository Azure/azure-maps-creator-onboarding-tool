import { useReviewManifestStore } from 'common/store/review-manifest.store';

import ReviewManifestPane from './review-manifest-pane';

const reviewManifestSelector = (s) => s.isPaneShown;

const ReviewManifest = () => {
  const isPaneShown = useReviewManifestStore(reviewManifestSelector);

  if (!isPaneShown) {
    return null;
  }

  return <ReviewManifestPane />;
};

export default ReviewManifest;