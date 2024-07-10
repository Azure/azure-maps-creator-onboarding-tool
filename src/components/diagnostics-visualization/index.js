// import { initializeIcons } from '@uifabric/icons';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import React from 'react';
import SplitterLayout from 'react-splitter-layout-react-v18';
import Pane from './components/Content/Pane/Pane';
import Map from './components/Map/Map';
import MapProvider from './components/Map/MapProvider';
import withMap from './components/Map/withMap';

import './index-layout.css';

initializeIcons();

const DiagnosticsVisualization = props => {
  const { map } = props;

  const onPaneDragEnd = () => {
    if (!map) {
      return;
    }
    map.invalidateSize();
  };

  return (
    <MapProvider>
      <SplitterLayout
        onDragEnd={onPaneDragEnd}
        secondaryInitialSize={800}
        secondaryMinSize={550}
        style={{
          height: 100,
          zIndex: 1,
        }}
      >
        <Map />
        <Pane />
      </SplitterLayout>
    </MapProvider>
  );
};

export default withMap(DiagnosticsVisualization);
