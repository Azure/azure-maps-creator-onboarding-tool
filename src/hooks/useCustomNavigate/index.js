import { PLACES_PREVIEW } from 'common/constants';
import useFeatureFlags from 'hooks/useFeatureFlags';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useCustomNavigate = () => {
  const navigate = useNavigate();
  const { isPlacesPreview } = useFeatureFlags();

  const handleNavigate = useCallback(
    (to, options) => {
      const [path, search] = to.split('?');
      const query = new URLSearchParams(search);

      if (isPlacesPreview) {
        query.set(PLACES_PREVIEW.SEARCH_PARAMETER, 'true');
      }

      navigate(`${path}?${query.toString()}`, options);
    },
    [navigate, isPlacesPreview]
  );

  return handleNavigate;
};

export default useCustomNavigate;
