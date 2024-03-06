import { PLACES_PREVIEW } from 'common/constants';

const getFeatureFlags = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const isPlacesPreview = queryParams.get(PLACES_PREVIEW.SEARCH_PARAMETER) === 'true';

  return {
    isPlacesPreview,
  };
};

export default getFeatureFlags;
