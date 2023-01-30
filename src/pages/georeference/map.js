import { memo, useCallback, useMemo, useEffect } from 'react';
import {
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapLayerProvider,
  AzureMapsProvider
} from 'react-azure-maps';
import { shallow } from 'zustand/shallow';
import { math } from 'azure-maps-control';

import { color } from 'common/styles';
import { getDomain, useGeometryStore, useUserStore } from 'common/store';
import { TRUNCATE_FRACTION_DIGITS } from 'common/constants';
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

const anchorPointSelector = (state) => [state.updateAnchorPoint, state.check];
const userStoreSelector = (s) => [s.geography, s.subscriptionKey];
const formatCoordinates = (coordinate) => parseFloat(coordinate.toFixed(TRUNCATE_FRACTION_DIGITS));

const Map = ({ exteriorCenter, dissolvedExterior, anchorPointHeading, anchorPointDistance }) => {
  const [updateAnchorPoint, check] = useGeometryStore(anchorPointSelector, shallow);
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
    const newAnchorPoint = math.getDestination(e.map.getCamera().center, anchorPointHeading, anchorPointDistance, 'meters');

    updateAnchorPoint({
      coordinates: [
        formatCoordinates(newAnchorPoint[0]),
        formatCoordinates(newAnchorPoint[1]),
      ],
    });
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