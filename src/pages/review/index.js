import { useEffect } from 'react';
import ReactJson from 'react-json-view';

import {
  progressBarSteps,
  progressBarStepsByKey,
  useCompletedSteps,
  useReviewManifestJson,
  useReviewManifestStore,
} from 'common/store';

const reviewManifestSelector = (s) => s.setCanBeDownloaded;

const ReviewAndCreate = () => {
  const setCanBeDownloaded = useReviewManifestStore(reviewManifestSelector);
  const json = useReviewManifestJson();
  const completedSteps = useCompletedSteps();

  useEffect(() => {
    const completedStepsCount = completedSteps.filter((step) => step !== progressBarStepsByKey.reviewCreate).length;
    setCanBeDownloaded(completedStepsCount >= progressBarSteps.length - 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ReactJson src={json} iconStyle='square' indentWidth={2} displayDataTypes={false} name={false}
               displayObjectSize={false} enableClipboard={false} displayArrayKey={false} />
  );
};

export default ReviewAndCreate;