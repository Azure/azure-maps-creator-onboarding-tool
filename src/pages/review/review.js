import { useReviewManifestJson, useReviewManifestStore } from 'common/store';
import { useEffect } from 'react';
import ReactJson from 'react-json-view';

const reviewManifestSelector = s => s.setManifestReviewed;

const ReviewTab = () => {
  const setManifestReviewed = useReviewManifestStore(reviewManifestSelector);
  const json = useReviewManifestJson();

  useEffect(() => {
    setManifestReviewed(true);
  }, [setManifestReviewed]);

  return (
    <ReactJson
      src={json}
      iconStyle="square"
      indentWidth={2}
      displayDataTypes={false}
      name={false}
      displayObjectSize={false}
      enableClipboard={false}
      displayArrayKey={false}
    />
  );
};

export default ReviewTab;
