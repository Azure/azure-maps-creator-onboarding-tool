import { memo, useCallback, useMemo, useEffect } from 'react';
import {
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapLayerProvider,
  AzureMapsProvider
} from 'react-azure-maps';
import { shallow } from 'zustand/shallow';

import { color } from 'common/styles';
import { getDomain, useGeometryStore, useUserStore } from 'common/store';
import { mapContainerStyle } from './georeference.style';
import GeoreferenceControl from './control/controlClass';

const controls = [
  {
    controlName: 'ZoomControl',
    options: { position: 'top-left' },
  },
  {
    controlName: 'StyleControl',
    options: { position: 'top-left' },
    controlOptions: { mapStyles: ['road_shaded_relief', 'satellite_road_labels', 'high_contrast_dark'] },
  },
];
const customControls = [
  {
    control: new GeoreferenceControl(),
    controlOptions: { position: 'top-right' },
  },
];
const azureMapsLayerProviderOptions = {
  fillOpacity: 0.5,
  fillColor: color.lightRed,
};

const anchorPointSelector = (s) => [s.updateAnchorPointViaMapCenter, s.check];
const userStoreSelector = (s) => [s.geography, s.subscriptionKey];

const Map = ({ exteriorCenter, dissolvedExterior }) => {
  const [updateAnchorPointViaMapCenter, check] = useGeometryStore(anchorPointSelector, shallow);
  const [geography, subscriptionKey] = useUserStore(userStoreSelector, shallow);

  const azureMapOptions = useMemo(() => ({
    authOptions: {
      authType: 'subscriptionKey',
      subscriptionKey,
    },
    center: exteriorCenter,
    domain: getDomain(geography),
    zoom: 16,
  }), []); // eslint-disable-line react-hooks/exhaustive-deps -- this only needs to be set once on map init

  const featureProps = useMemo(() => {
    if (dissolvedExterior.type === 'MultiPolygon') {
      return {
        type: 'MultiPolygon',
        multipleDimensionCoordinates: dissolvedExterior.coordinates,
      };
    }
    return {
      type: 'Polygon',
      coordinates: dissolvedExterior.coordinates,
    };
  }, [dissolvedExterior]);

  const move = useCallback((e) => {
    updateAnchorPointViaMapCenter(e.map.getCamera().center);
    // once this function is passed down to AzureMap component, it will be saved there and never update
    // with empty array of deps here I just wanted to make it explicit that this function isn't going to change after the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this page has no required fields as anchor point data comes from API and already prefilled.
  // so just the fact of loading this page is enough to mark it checked in progress-bar
  useEffect(() => { check(); }, [check]);

  return (
    <AzureMapsProvider>
      <div className={mapContainerStyle}>
        <AzureMap
          options={azureMapOptions}
          customControls={customControls}
          controls={controls}
          events={{ move }}
        >
          <AzureMapDataSourceProvider id='OutlineMapDataSourceProvider'>
            <AzureMapLayerProvider
              id='OutlineLayerProvider'
              options={azureMapsLayerProviderOptions}
              type='PolygonLayer'
            />
            <AzureMapFeature
              variant='shape'
              id='OutlineMapFeature'
              {...featureProps}
              setCoords={dissolvedExterior.coordinates}
            />
          </AzureMapDataSourceProvider>
        </AzureMap>
      </div>
    </AzureMapsProvider>
  );
};

export default memo(Map);