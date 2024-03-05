import { Map, control } from 'azure-maps-control';
import { indoor, control as indoorControl } from 'azure-maps-indoor';
import { getDomain, useUserStore } from 'common/store';
import { useEffect } from 'react';
import { mapContainer } from './style';

const userStoreSelector = s => [s.geography, s.subscriptionKey];

const TilesetMap = ({ mapConfigurationId, bbox }) => {
  const [geography, subscriptionKey] = useUserStore(userStoreSelector);

  useEffect(() => {
    if (mapConfigurationId === null) return;

    const map = new Map('azure-maps-container', {
      bounds: bbox,
      subscriptionKey: subscriptionKey,
      language: 'en-US',
      domain: getDomain(geography),
      staticAssetsDomain: getDomain(geography),
      mapConfiguration: mapConfigurationId,
      styleAPIVersion: '2023-03-01-preview',
    });

    map.controls.add([new control.ZoomControl(), new control.StyleControl({ mapStyles: 'all' })], {
      position: 'top-right',
    });

    map.events.add('ready', () => {
      new indoor.IndoorManager(map, {
        levelControl: new indoorControl.LevelControl({ position: 'top-left' }),
      });
    });
  }, [mapConfigurationId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div id="azure-maps-container" className={mapContainer} />;
};

export default TilesetMap;
