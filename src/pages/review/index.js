import { useProgressBarStore, useValidationStatus } from 'common/store/progress-bar-steps';
import { useFeatureFlags } from 'hooks';
import SummaryTab from 'pages/summary';
import { useEffect } from 'react';
import ReviewTab from './review';

const progressBarStoreSelector = s => [s.showMissingDataError, s.hideMissingDataError];

const Review = () => {
  const [showMissingDataError, hideMissingDataError] = useProgressBarStore(progressBarStoreSelector);
  const { isPlacesPreview } = useFeatureFlags();
  const { success } = useValidationStatus();

  useEffect(() => {
    if (success) hideMissingDataError();
    else showMissingDataError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPlacesPreview) return <SummaryTab />;
  return <ReviewTab />;
};

export default Review;
