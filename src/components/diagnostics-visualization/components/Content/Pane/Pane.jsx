import { Selection } from '@fluentui/react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from '@fluentui/react/lib/ScrollablePane';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import SplitterLayout from 'react-splitter-layout-react-v18';
import DetailedView from '../../DetailedView';
// import Filter from './Filter/Filter';
import { useConversionStore } from 'common/store';
import withMap from '../../Map/withMap';
import { parseDiagnosticData } from './List/FileUploader/helpers';
import List from './List/List';
import MapDrawer from './MapDrawer/MapDrawer';

const Pane = props => {
  const { map } = props;
  const [diagnosticData] = useConversionStore(s => [s.diagnosticData]);

  const [excludedIds, setExcludedIds] = useState({
    errors: new Set(),
    levelOutlines: new Set(),
  });
  const [linkItem, setLinkItem] = useState(undefined);
  const [resultItems_old, setResultItems] = useState(undefined);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDetailedView, setShowDetailedView] = useState(false);

  const resultItems = React.useMemo(() => {
    const { items } = parseDiagnosticData(diagnosticData);

    return items;
  }, [diagnosticData]);

  const isMapConfigured = useRef(false);
  const lastActiveItemKey = useRef(undefined);
  const selection = useRef(
    new Selection({
      onSelectionChanged: () => {
        setSelectedItems(selection.current.getSelection());
      },
    })
  );

  useEffect(() => {
    if (map && !isMapConfigured.current) {
      map.invalidateSize();
      isMapConfigured.current = true;
    }
  }, [map]);

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

  return (
    <div id="pane">
      <SplitterLayout vertical primaryMinSize={200} secondaryMinSize={200} secondaryInitialSize={400}>
        Side panel
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
      {/* Helper Components */}
      <MapDrawer
        excludedIds={excludedIds}
        resultItems={resultItems}
        selection={selection.current}
        selectedItems={selectedItems}
        onActiveItemChanged={onActiveMapItemChanged}
      />
    </div>
  );
};

export default withMap(Pane);
