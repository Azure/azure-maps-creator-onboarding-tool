import { useEffect } from 'react';
import ReactJson from 'react-json-view';

import { useReviewManifestJson, useReviewManifestStore } from 'common/store';

const reviewManifestSelector = s => s.setManifestReviewed;

const ReviewAndCreate = () => {
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

export default ReviewAndCreate;
