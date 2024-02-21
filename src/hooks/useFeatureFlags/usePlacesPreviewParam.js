import { useSearchParams } from 'react-router-dom';

const usePlacesPreviewParam = () => {
  const [searchParams] = useSearchParams();
  const placespreview = searchParams.get('placespreview') === 'true';

  return placespreview;
};

export default usePlacesPreviewParam;
