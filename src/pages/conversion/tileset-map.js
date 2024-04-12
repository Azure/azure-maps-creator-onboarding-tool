import { Map, control } from 'azure-maps-control';
import { indoor, control as indoorControl } from 'azure-maps-indoor';
import { getDomain, useConversionStore, useUserStore } from 'common/store';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { mapContainer } from './style';

const conversionStoreSelector = s => [s.mapConfigurationId, s.bbox];
const userStoreSelector = s => [s.geography, s.subscriptionKey];

const TilesetMap = () => {
  const [mapConfigurationId, bbox] = useConversionStore(conversionStoreSelector, shallow);
  const [geography, subscriptionKey] = useUserStore(userStoreSelector, shallow);

  useEffect(() => {
    if (mapConfigurationId === null) {
      return;
    }
    const map = new Map('azure-maps-container', {
      bounds: bbox,
      subscriptionKey: subscriptionKey,
      language: 'en-US',
      domain: getDomain(geography),
      staticAssetsDomain: getDomain(geography),
      mapConfiguration: mapConfigurationId,
      styleAPIVersion: '2023-03-01-preview',
    });
    map.controls.add(new control.ZoomControl(), { position: 'top-right' });
    new indoor.IndoorManager(map, {
      levelControl: new indoorControl.LevelControl({ position: 'top-left' }),
    });
    map.controls.add(new control.StyleControl({ mapStyles: 'all' }), { position: 'top-right' });
  }, [mapConfigurationId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div id='azure-maps-container' className={mapContainer} />;
};

export default TilesetMap;
