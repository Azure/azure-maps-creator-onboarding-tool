/* eslint-disable no-restricted-syntax */ // @todo fix this
import withMap from 'components/diagnostics-visualization/components/Map/withMap';
import L from 'leaflet';
import * as React from 'react';
import parse from 'wellknown';

class MapDrawer extends React.Component {
  DEFAULT_GEOMETRY_COLOR = '#AAAAAA';

  DEFAULT_GEOMETRY_OPACITY = 0.5;

  SELECTED_GEOMETRY_COLOR = '#01FF70';

  SELECTED_GEOMETRY_OPACITY = 1;

  LEVELOUTLINE_GEOMETRY_COLOR = '#007FFF';

  isDataPopulated = false;

  polyMapping = {
    errors: {},
    levelOutlines: {},
  };

  prevExcludedIds = {
    errors: new Set(),
    levelOutlines: new Set(),
  };

  prevSelectedItems = [];

  datasource;

  componentDidUpdate() {
    const { excludedIds, map, resultItems, selectedItems } = this.props;
    if (!map || !resultItems) {
      return;
    }
    if (!this.isDataPopulated) {
      this.processResultItems();
      this.isDataPopulated = true;
    }

    const excludedOrSelectedChange = this.prevExcludedIds !== excludedIds || this.prevSelectedItems !== selectedItems;

    // Apply geometry add/remove based on filter
    if (this.prevExcludedIds !== excludedIds) {
      // Add back polygons that were previously excluded
      for (const [idType, ids] of Object.entries(this.prevExcludedIds)) {
        ids.forEach(id => {
          const polyMapping = this.polyMapping[idType];
          if (polyMapping[id]) {
            polyMapping[id].addTo(map);
          }
        });
      }

      // Remove polygons that are now excluded
      for (const [idType, ids] of Object.entries(excludedIds)) {
        ids.forEach(id => {
          const polyMapping = this.polyMapping[idType];
          if (polyMapping[id]) {
            polyMapping[id].remove();
          }
        });
      }

      this.prevExcludedIds = excludedIds;
    }

    // Apply styles based on selection
    const { errors: errorPolyMapping, levelOutlines: levelPolyMapping } = this.polyMapping;
    const featureGroup = [];
    if (this.prevSelectedItems !== selectedItems) {
      this.prevSelectedItems.forEach(
        item =>
          errorPolyMapping[item.key] &&
          errorPolyMapping[item.key].setStyle({
            color: this.DEFAULT_GEOMETRY_COLOR,
            opacity: this.DEFAULT_GEOMETRY_OPACITY,
          })
      );
      selectedItems.forEach(
        item =>
          errorPolyMapping[item.key] &&
          errorPolyMapping[item.key].remove().addTo(map) &&
          errorPolyMapping[item.key].setStyle({
            color: this.SELECTED_GEOMETRY_COLOR,
            opacity: this.SELECTED_GEOMETRY_OPACITY,
          }) &&
          featureGroup.push(errorPolyMapping[item.key])
      );

      this.prevSelectedItems = selectedItems;
    }

    // Change the bounding box for map camera if filter or selection has been updated
    if (excludedOrSelectedChange) {
      const allErrorsPoly = Object.keys(errorPolyMapping)
        .filter(key => !excludedIds.errors.has(Number(key)))
        .map(key => errorPolyMapping[key]);
      const allOutlinesPoly = Object.keys(levelPolyMapping)
        .filter(key => !excludedIds.levelOutlines.has(Number(key)))
        .map(key => levelPolyMapping[key]);
      const allPoly = [...allErrorsPoly, ...allOutlinesPoly];
      const allPolyBounds = this.safeBounds(L.featureGroup(allPoly).getBounds());
      if (selectedItems.length === 1) {
        // If selecting one item,
        // - If item is in camera bounds, DO NOTHING
        // - Else, SET BOUNDS TO FIT ALL ITEMS
        const bounds = L.featureGroup(featureGroup).getBounds();
        if (bounds.isValid() && allPolyBounds.isValid() && !map.getBounds().contains(bounds)) {
          map.fitBounds(allPolyBounds);
        }
      } else if (selectedItems.length > 1) {
        // If more than one items are selected,
        // -  If items are in bounds, DO NOTHING
        // -  If items are not in bounds, ZOOM TO THESE ITEMS
        const bounds = this.safeBounds(L.featureGroup(featureGroup).getBounds());
        if (bounds.isValid() && !map.getBounds().contains(bounds)) {
          map.fitBounds(bounds);
        }
      } else if (allPoly.length > 0) {
        // If no items are selected,
        // - SET BOUNDS TO FIT ALL ITEMS
        if (allPolyBounds.isValid()) {
          map.invalidateSize(); // Sometimes map area needs to be recalculated
          map.fitBounds(allPolyBounds);
        }
      }
    }
  }

  processResultItems = () => {
    const { map, resultItems } = this.props;

    this.polyMapping = {
      errors: {},
      levelOutlines: {},
    };

    for (const [itemType, items] of Object.entries(resultItems)) {
      items.forEach(item => {
        const { key, geometry } = item;
        if (!geometry) {
          return;
        }

        const geogeometry = typeof geometry === 'string' ? parse(geometry) : geometry;
        if (!geogeometry) {
          return;
        }

        this.polyMapping[itemType][key] = L.geoJSON(geogeometry, {
          style: {
            color: itemType !== 'levelOutlines' ? this.DEFAULT_GEOMETRY_COLOR : this.LEVELOUTLINE_GEOMETRY_COLOR,
            fill: !!(itemType !== 'levelOutlines' && geogeometry.type !== 'LineString'),
            opacity: this.DEFAULT_GEOMETRY_OPACITY,
          },
          pointToLayer: (_, latlng) =>
            L.circleMarker(latlng, {
              radius: 5,
              fillColor: this.DEFAULT_GEOMETRY_COLOR,
              fillOpacity: this.DEFAULT_GEOMETRY_OPACITY,
            }),
        });

        if (item.levelOrdinal !== 3) {
          this.polyMapping[itemType][key].addTo(map);
        }
        if (itemType === 'errors' || itemType === 'warnings') {
          this.polyMapping[itemType][key].on('click', () => {
            const { selection } = this.props;
            selection.toggleKeySelected(key);
            this.onActiveItemChanged(item);
            // eslint-disable-next-line no-console
            console.log(item);
          });
        }
      });
    }
  };

  render = () => null;

  safeBounds = bounds => {
    if (!bounds) {
      return bounds;
    }
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    if (!ne || !sw) {
      return bounds;
    }
    if (
      (Math.round(ne.lat) * 1e5) / 1e5 === (Math.round(sw.lat) * 1e5) / 1e5 ||
      (Math.round(ne.lng) * 1e5) / 1e5 === (Math.round(sw.lng) * 1e5) / 1e5
    ) {
      const newNeLat = ne.lat + 5 * 1e-5;
      const newNeLng = ne.lng + 5 * 1e-5;
      const newSwLat = sw.lat - 5 * 1e-5;
      const newSwLng = sw.lng - 5 * 1e-5;
      const newNe = L.latLng(newNeLat > 90 ? 90 : newNeLat, newNeLng > 180 ? 180 : newNeLng);
      const newSw = L.latLng(newSwLat > 90 ? 90 : newSwLat, newSwLng > 180 ? 180 : newSwLng);
      return L.latLngBounds(newSw, newNe);
    }

    return bounds;
  };

  onActiveItemChanged = item => this.props.onActiveItemChanged(item);
}

export default withMap(MapDrawer);
