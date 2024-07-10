import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import parse from 'wellknown';

const DEFAULT_GEOMETRY_COLOR = '#AAAAAA';
const DEFAULT_GEOMETRY_OPACITY = 0.5;
const SELECTED_GEOMETRY_COLOR = '#01FF70';
const SELECTED_GEOMETRY_OPACITY = 1;
const LEVELOUTLINE_GEOMETRY_COLOR = '#007FFF';

const MapDrawer = props => {
  const isDataPopulated = useRef(false);
  const polyMapping = useRef({ errors: {}, levelOutlines: {} });
  const prevExcludedIds = useRef({ errors: new Set(), levelOutlines: new Set() });
  const prevSelectedItems = useRef([]);
  const map = useMap();
  const mapRef = useRef(map);

  useEffect(() => {
    if (!mapRef.current || !props.resultItems) return;

    if (!isDataPopulated.current) {
      processResultItems();
      isDataPopulated.current = true;
    }

    const excludedOrSelectedChange =
      prevExcludedIds.current !== props.excludedIds || prevSelectedItems.current !== props.selectedItems;

    if (prevExcludedIds.current !== props.excludedIds) {
      handleExclusionChange();
    }

    if (prevSelectedItems.current !== props.selectedItems) {
      handleSelectionChange();
    }

    if (excludedOrSelectedChange) {
      adjustMapBounds();
    }
  }, [props.excludedIds, props.resultItems, props.selectedItems]);

  const handleExclusionChange = () => {
    const { excludedIds } = props;

    for (const [idType, ids] of Object.entries(prevExcludedIds.current || {})) {
      ids.forEach(id => {
        const poly = polyMapping.current[idType][id];
        if (poly) poly.addTo(map);
      });
    }

    for (const [idType, ids] of Object.entries(excludedIds || {})) {
      ids.forEach(id => {
        const poly = polyMapping.current[idType][id];
        if (poly) poly.remove();
      });
    }

    prevExcludedIds.current = excludedIds;
  };

  const handleSelectionChange = () => {
    const { errors: errorPolyMapping } = polyMapping.current;
    const { selectedItems } = props;

    prevSelectedItems.current.forEach(item => {
      const poly = errorPolyMapping[item.key];
      if (poly) {
        poly.setStyle({
          color: DEFAULT_GEOMETRY_COLOR,
          opacity: DEFAULT_GEOMETRY_OPACITY,
        });
      }
    });

    (selectedItems || []).forEach(item => {
      const poly = errorPolyMapping[item.key];
      if (poly) {
        poly.remove().addTo(map).setStyle({
          color: SELECTED_GEOMETRY_COLOR,
          opacity: SELECTED_GEOMETRY_OPACITY,
        });
      }
    });

    prevSelectedItems.current = selectedItems;
  };

  const adjustMapBounds = () => {
    const { errors: errorPolyMapping, levelOutlines: levelPolyMapping } = polyMapping.current;
    const { excludedIds, selectedItems } = props;

    const allErrorsPoly = Object.keys(errorPolyMapping)
      .filter(key => !(excludedIds.errors || new Set()).has(Number(key)))
      .map(key => errorPolyMapping[key]);
    const allOutlinesPoly = Object.keys(levelPolyMapping)
      .filter(key => !(excludedIds.levelOutlines || new Set()).has(Number(key)))
      .map(key => levelPolyMapping[key]);
    const allPoly = [...allErrorsPoly, ...allOutlinesPoly];
    const allPolyBounds = safeBounds(L.featureGroup(allPoly).getBounds());

    if (selectedItems.length === 1) {
      const bounds = L.featureGroup(
        allErrorsPoly.filter(poly => selectedItems.some(item => poly === errorPolyMapping[item.key]))
      ).getBounds();
      if (bounds.isValid() && allPolyBounds.isValid() && !map.getBounds().contains(bounds)) {
        map.fitBounds(allPolyBounds);
      }
    } else if (selectedItems.length > 1) {
      const bounds = safeBounds(
        L.featureGroup(
          allErrorsPoly.filter(poly => selectedItems.some(item => poly === errorPolyMapping[item.key]))
        ).getBounds()
      );
      if (bounds.isValid() && !map.getBounds().contains(bounds)) {
        map.fitBounds(bounds);
      }
    } else if (allPoly.length > 0 && allPolyBounds.isValid()) {
      map.invalidateSize();
      map.fitBounds(allPolyBounds);
    }
  };

  const processResultItems = () => {
    const { resultItems } = props;
    polyMapping.current = { errors: {}, levelOutlines: {} };

    for (const [itemType, items] of Object.entries(resultItems || {})) {
      items.forEach(item => {
        const { key, geometry } = item;
        if (!geometry) return;

        const geoGeometry = typeof geometry === 'string' ? parse(geometry) : geometry;
        if (!geoGeometry) return;

        polyMapping.current[itemType][key] = L.geoJSON(geoGeometry, {
          style: {
            color: itemType !== 'levelOutlines' ? DEFAULT_GEOMETRY_COLOR : LEVELOUTLINE_GEOMETRY_COLOR,
            fill: !!(itemType !== 'levelOutlines' && geoGeometry.type !== 'LineString'),
            opacity: DEFAULT_GEOMETRY_OPACITY,
          },
          pointToLayer: (_, latlng) =>
            L.circleMarker(latlng, {
              radius: 5,
              fillColor: DEFAULT_GEOMETRY_COLOR,
              fillOpacity: DEFAULT_GEOMETRY_OPACITY,
            }),
        });

        if (item.levelOrdinal !== 3) {
          polyMapping.current[itemType][key].addTo(map);
        }
        if (itemType === 'errors' || itemType === 'warnings') {
          polyMapping.current[itemType][key].on('click', () => {
            props.selection.toggleKeySelected(key);
            onActiveItemChanged(item);
            console.log(item);
          });
        }
      });
    }
  };

  const safeBounds = bounds => {
    if (!bounds) return bounds;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    if (!ne || !sw) return bounds;

    if (
      (Math.round(ne.lat) * 1e5) / 1e5 === (Math.round(sw.lat) * 1e5) / 1e5 ||
      (Math.round(ne.lng) * 1e5) / 1e5 === (Math.round(sw.lng) * 1e5) / 1e5
    ) {
      const newNe = L.latLng(ne.lat + 5e-5, ne.lng + 5e-5);
      const newSw = L.latLng(sw.lat - 5e-5, sw.lng - 5e-5);
      return L.latLngBounds(newSw, newNe);
    }

    return bounds;
  };

  const onActiveItemChanged = item => props.onActiveItemChanged(item);

  return null;
};

export default MapDrawer;
