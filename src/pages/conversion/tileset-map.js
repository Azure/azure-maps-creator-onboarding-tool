import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { useConversionStore, useUserStore } from 'common/store';
import { control, Map } from 'azure-maps-control';
import { getEnvs } from 'common/functions';
import { mapContainer } from './style';

const conversionStoreSelector = (s) => [s.mapConfigurationId, s.bbox];
const userStoreSelector = (s) => [s.geography, s.subscriptionKey];

const TilesetMap = () => {
  const [mapConfigurationId, bbox] = useConversionStore(conversionStoreSelector, shallow);
  const [geography, subscriptionKey] = useUserStore(userStoreSelector, shallow);

  useEffect(() => {
    if (mapConfigurationId === null) {
      return;
    }
    const mapNew = new Map('azure-maps-container', {
      bounds: bbox,
      subscriptionKey: subscriptionKey,
      language: 'en-US',
      domain: getEnvs()[geography].URL,
      staticAssetsDomain : getEnvs()[geography].URL,
      mapConfiguration: mapConfigurationId,
      styleAPIVersion: '2023-03-01-preview',
    });
    mapNew.controls.add(new control.ZoomControl(), { position: 'top-right' });
  }, [mapConfigurationId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id='azure-maps-container' className={mapContainer} />
  );
};

export default TilesetMap;