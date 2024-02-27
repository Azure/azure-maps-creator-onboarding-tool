import { cx } from '@emotion/css';
import { getDomain, useGeometryStore, useUserStore } from 'common/store';
import { color } from 'common/styles';
import { memo, useCallback, useMemo } from 'react';
import {
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapLayerProvider,
  AzureMapsProvider,
} from 'react-azure-maps';
import GeoreferenceControl from './control/controlClass';
import { mapContainerStyle } from './georeference.style';

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

const anchorPointSelector = s => s.updateAnchorPointViaMapCenter;
const userStoreSelector = s => [s.geography, s.subscriptionKey];

const Map = props => {
  const { className, style, exteriorCenter, dissolvedExterior, readOnly = false } = props;

  const updateAnchorPointViaMapCenter = useGeometryStore(anchorPointSelector);
  const [geography, subscriptionKey] = useUserStore(userStoreSelector);

  const azureMapOptions = useMemo(
    () => ({
      authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey,
      },
      center: exteriorCenter,
      domain: getDomain(geography),
      zoom: 16,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- this only needs to be set once on map init
    []
  );

  const featureProps = useMemo(() => {
    if (dissolvedExterior === null) {
      return {};
    }
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

  const move = useCallback(e => {
    updateAnchorPointViaMapCenter(e.map.getCamera().center);
    // once this function is passed down to AzureMap component, it will be saved there and never update
    // with empty array of deps here I just wanted to make it explicit that this function isn't going to change after the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapProps = readOnly
    ? {}
    : {
        customControls,
        controls,
        events: { move },
      };

  return (
    <AzureMapsProvider>
      <div className={cx(mapContainerStyle, className)} style={style}>
        <AzureMap options={azureMapOptions} {...mapProps}>
          <AzureMapDataSourceProvider id="OutlineMapDataSourceProvider">
            <AzureMapLayerProvider
              id="OutlineLayerProvider"
              options={azureMapsLayerProviderOptions}
              type="PolygonLayer"
            />
            {/*
              Added key attribute here to remount this component whenever type changes.
              It is only set once inside AzureMapFeature on component mount https://github.com/Azure/react-azure-maps/blob/master/src/components/AzureMapFeature/AzureMapFeature.tsx#L18
              and due to this the feature is not rendered properly when type changes from polygon to multipolygon or vice-versa
            */}
            {dissolvedExterior !== null && (
              <AzureMapFeature
                key={dissolvedExterior.type}
                variant="shape"
                id="OutlineMapFeature"
                {...featureProps}
                setCoords={dissolvedExterior.coordinates}
              />
            )}
          </AzureMapDataSourceProvider>
        </AzureMap>
      </div>
    </AzureMapsProvider>
  );
};

export default memo(Map);
