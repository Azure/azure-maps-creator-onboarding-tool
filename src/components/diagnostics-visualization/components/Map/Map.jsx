import L from 'leaflet';
import React from 'react';
import { MapContainer } from 'react-leaflet';
import MapDrawer from './MapDrawer';

import 'leaflet/dist/leaflet.css';

const Map = props => {
  return (
    <MapContainer
      id="map"
      style={{ height: '100%', width: '100%' }}
      center={[0, 0]}
      zoom={0}
      crs={L.CRS.Simple}
      attributionControl={false}
    >
      <MapDrawer {...props} />
    </MapContainer>
  );
};

export default Map;
