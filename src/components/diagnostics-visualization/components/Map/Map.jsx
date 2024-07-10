/* eslint-disable react/destructuring-assignment */
import L from 'leaflet';
import React, { useEffect } from 'react';
import withMap from './withMap';

const mapDivId = 'map';

const Map = props => {
  useEffect(() => {
    console.log('PROPS', props);
    // When div (this.divId) mounts, load the map to that div
    var container = L.DomUtil.get(mapDivId);
    if (container != null) {
      container._leaflet_id = null;
    }

    const map = L.map(mapDivId, {
      crs: L.CRS.Simple,
    });

    // Initialize the starting camera point
    map.setView([0, 0], 0);

    /* <a style="display:block; text-align:right; " href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> */
    map.attributionControl.setPrefix(''); // Hides leaflet logo from the map
    // Set map object for the Context
    props.setMap(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shallow comparison of shouldComponentUpdate
  // shouldComponentUpdate = nextProps => !Object.is(this.props.map, nextProps.map);

  return <div id={mapDivId} style={{ visibility: 'visible' }} />;
};

export default withMap(Map);
