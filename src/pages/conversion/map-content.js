import { conversionSteps } from 'common/store';
import TilesetMap from './tileset-map';

const MapContent = ({ selectedStep, mapConfigurationId, bbox }) => {
  if (selectedStep !== conversionSteps.map) {
    return null;
  }

  return (
    <TilesetMap mapConfigurationId={mapConfigurationId} bbox={bbox} />
  );
};

export default MapContent;