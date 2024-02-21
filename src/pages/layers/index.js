import { useFeatureFlags } from 'hooks';
import LayersContent from './layers';
import Units from './units';

const Layers = props => {
  const { isPlacesPreview } = useFeatureFlags();

  if (isPlacesPreview) return <Units {...props} />;

  return <LayersContent {...props} />;
};

export default Layers;
