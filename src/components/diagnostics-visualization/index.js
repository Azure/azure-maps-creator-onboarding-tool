import { Selection, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { useConversionStore } from 'common/store';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SplitterLayout from 'react-splitter-layout-react-v18';
import DetailedView from './components/DetailedView';
import Filter from './components/Filter';
import List from './components/List/List';
import Map from './components/Map/Map';
import { parseDiagnosticData } from './components/helpers';
import { contentWrapper, diagnosticVisualizationWrapper } from './index.style';

import './index-layout.css';

const DiagnosticsVisualization = () => {
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

  const selection = useMemo(() => {
    return new Selection({
      onSelectionChanged: () => {
        setSelectedItems(selection.getSelection());
      },
      selectionMode: SelectionMode.multiple,
      getKey: item => item.key,
    });
  }, []);

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
    <div className={diagnosticVisualizationWrapper}>
      <Map
        excludedIds={excludedIds}
        resultItems={resultItems}
        selection={selection}
        selectedItems={selectedItems}
        onActiveItemChanged={onActiveMapItemChanged}
      />
      <div className={contentWrapper}>
        <Filter excludedIds={excludedIds} resultItems={resultItems} setExcludedIds={setExcludedIds} />
        <SplitterLayout vertical primaryMinSize={200} secondaryMinSize={200} secondaryInitialSize={400}>
          <List
            excludedErrorIds={excludedIds.errors}
            errors={errors}
            selection={selection}
            onActiveItemChanged={onActiveListItemChanged}
            onDetailsClick={onDetailsClick}
            setResultItems={setResultItems}
          />
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
