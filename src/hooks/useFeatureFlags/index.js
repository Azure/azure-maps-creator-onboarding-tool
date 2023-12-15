import usePlacesPreviewParam from './usePlacesPreviewParam';

const useFeatureFlags = () => {
  const isPlacesPreview = usePlacesPreviewParam();

  return {
    isPlacesPreview,
  };
};

export default useFeatureFlags;
