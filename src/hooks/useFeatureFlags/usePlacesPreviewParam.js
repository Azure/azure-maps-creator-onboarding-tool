import { PLACES_PREVIEW } from 'common/constants';
import { useSearchParams } from 'react-router-dom';

const usePlacesPreviewParam = () => {
  const [searchParams] = useSearchParams();
  const isPlacesPreview = searchParams.get(PLACES_PREVIEW.SEARCH_PARAMETER) === 'true';

  return isPlacesPreview;
};

export default usePlacesPreviewParam;
