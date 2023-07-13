import { conversionSteps, useConversionStore } from 'common/store';
import TilesetMap from './tileset-map';

const conversionStoreSelector = (s) => s.selectedStep;

const MapContent = () => {
  const selectedStep = useConversionStore(conversionStoreSelector);

  if (selectedStep !== conversionSteps.map) {
    return null;
  }

  return (
    <TilesetMap />
  );
};

export default MapContent;