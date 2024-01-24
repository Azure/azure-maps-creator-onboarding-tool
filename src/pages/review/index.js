import { useFeatureFlags } from 'hooks';
import SummaryTab from 'pages/summary';
import ReviewTab from './review';

const Review = () => {
  const { isPlacesPreview } = useFeatureFlags();

  if (isPlacesPreview) return <SummaryTab />;
  return <ReviewTab />;
};

export default Review;
