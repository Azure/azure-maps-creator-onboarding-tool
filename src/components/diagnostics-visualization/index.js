// import { initializeIcons } from '@uifabric/icons';
import { Selection } from '@fluentui/react/lib/DetailsList';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ScrollablePane, ScrollbarVisibility } from '@fluentui/react/lib/ScrollablePane';
import { useConversionStore } from 'common/store';
import React, { useEffect, useRef, useState } from 'react';
import SplitterLayout from 'react-splitter-layout-react-v18';
import { parseDiagnosticData } from './components/Content/Pane/List/FileUploader/helpers';
import DetailedView from './components/DetailedView';
import Map from './components/Map/Map';
import './index-layout.css';
// import Filter from './Filter/Filter';
import List from './components/Content/Pane/List/List';

initializeIcons();

const DiagnosticsVisualization = props => {
  const { map } = props;
  const [diagnosticData] = useConversionStore(s => [s.diagnosticData]);

  const [excludedIds, setExcludedIds] = useState({
    errors: new Set(),
    levelOutlines: new Set(),
  });
  const [linkItem, setLinkItem] = useState(undefined);
  const [resultItems, setResultItems] = useState(undefined);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    const { items } = parseDiagnosticData(diagnosticData);

    setResultItems(items);
  }, [diagnosticData]);

  const lastActiveItemKey = useRef(undefined);
  const selection = useRef(
    new Selection({
      onSelectionChanged: () => {
        setSelectedItems(selection.current.getSelection());
      },
    })
  );

  const onActiveListItemChanged = linkItem => {
    if (lastActiveItemKey.current === linkItem.key) {
      return;
    }

    // Update the DetailedView if active item has been changed
    if (showDetailedView) {
      setLinkItem(linkItem);
    }

    lastActiveItemKey.current = linkItem.key;
  };

  const onActiveMapItemChanged = linkItem => onActiveListItemChanged(linkItem);

  const onDetailsClick = linkItem => {
    // Open DetailedView on 'Details' link click
    setLinkItem(linkItem);
    setShowDetailedView(true);
  };

  const onDetailsDismiss = () => {
    setLinkItem(undefined);
    setShowDetailedView(false);
  };

  const errors = resultItems ? resultItems.errors || [] : undefined;

  const onPaneDragEnd = () => {
    if (!map) {
      return;
    }
    map.invalidateSize();
  };

  return (
    <div
      onDragEnd={onPaneDragEnd}
      secondaryInitialSize={800}
      secondaryMinSize={550}
      style={{
        zIndex: 1,
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    >
      <Map
        excludedIds={excludedIds}
        resultItems={resultItems}
        selection={selection.current}
        selectedItems={selectedItems}
        onActiveItemChanged={onActiveMapItemChanged}
      />
      <div id="pane">
        <SplitterLayout vertical primaryMinSize={200} secondaryMinSize={200} secondaryInitialSize={400}>
          <ScrollablePane
            scrollbarVisibility={ScrollbarVisibility.auto}
            styles={{ root: { overflowY: 'hidden' }, stickyBelowItems: { height: 'inherit' } }}
          >
            {/* Rendered Components */}
            {/*
            <Filter excludedIds={excludedIds} resultItems={resultItems} setExcludedIds={setExcludedIds} />
           */}
            <List
              excludedErrorIds={excludedIds.errors}
              errors={errors}
              selection={selection.current}
              onActiveItemChanged={onActiveListItemChanged}
              onDetailsClick={onDetailsClick}
              setResultItems={setResultItems}
            />
          </ScrollablePane>
          {showDetailedView && (
            <DetailedView
              json={linkItem.rawDetail}
              texts={{
                title: linkItem.code,
                description: linkItem.message || '',
              }}
              props={{
                closeButton: { onClick: onDetailsDismiss },
              }}
            />
          )}
        </SplitterLayout>
      </div>
    </div>
  );
};

export default DiagnosticsVisualization;
