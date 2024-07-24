import { ColumnActionsMode, DetailsList } from '@fluentui/react';
import { ScrollToMode } from '@fluentui/react/lib/List';
import React, { useEffect, useRef, useState } from 'react';
import { DetailedViewLink, RenderDetailsHeader } from './ListSupportRenders';
import { areItemKeysEqual, copyAndSort } from './helpers';

const List = props => {
  const { excludedErrorIds, errors, onActiveItemChanged, onDetailsClick, selection } = props;

  const itemsRef = useRef([]);
  const [items, setItems] = useState([]);
  const [prevItems, setPrevItems] = useState([]);
  const [columns, setColumns] = useState([
    {
      key: 'codeColumn',
      maxWidth: 100,
      minWidth: 40,
      name: 'Code',
      fieldName: 'code',
      isResizable: true,
      onColumnClick: (ev, column) => onColumnClick(column),
    },
    {
      key: 'messageColumn',
      maxWidth: 290,
      minWidth: 150,
      name: 'Message',
      fieldName: 'message',
      isResizable: true,
      onColumnClick: (ev, column) => onColumnClick(column),
    },
    {
      key: 'ordinalColumn',
      maxWidth: 40,
      minWidth: 40,
      name: 'Level',
      fieldName: 'levelOrdinal',
      isResizable: true,
      onColumnClick: (ev, column) => onColumnClick(column),
    },
    {
      key: 'layerColumn',
      minWidth: 100,
      name: 'Layer',
      fieldName: 'layerName',
      isResizable: true,
      onColumnClick: (ev, column) => onColumnClick(column),
    },
    {
      key: 'iconsColumn',
      fieldName: 'iconsName',
      columnActionsMode: ColumnActionsMode.disabled,
      isIconOnly: true,
      onRender: item => <DetailedViewLink onClick={() => onDetailsClick(item)} />,
    },
  ]);

  useEffect(() => {
    if (errors) {
      const filteredItems = errors.filter(item => !excludedErrorIds.has(item.key));
      if (!areItemKeysEqual(prevItems, filteredItems)) {
        setItems(filteredItems);
        itemsRef.current = filteredItems;
        setPrevItems(filteredItems);
      }
    }
  }, [errors, excludedErrorIds, prevItems]);

  const onColumnClick = column => {
    if (!column) {
      throw new Error('Column was not returned from the event handler.');
    }

    const newColumns = columns.slice();
    const currColumn = newColumns.find(currCol => column.key === currCol.key);

    newColumns.forEach(newCol => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });

    const newItems = copyAndSort(itemsRef.current, currColumn.fieldName, currColumn.isSortedDescending);
    setColumns(newColumns);
    setItems(newItems);
  };

  if (!items) return null;

  return (
    <div data-is-scrollable="true" style={{ height: '100%' }}>
      <DetailsList
        compact
        items={[...items]}
        columns={columns}
        selection={selection}
        selectionPreservedOnEmptyClick={true}
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        ariaLabelForSelectionColumn="Toggle selection"
        checkButtonAriaLabel="Row checkbox"
        ScrollToMode={ScrollToMode.top}
        onActiveItemChanged={onActiveItemChanged}
        onRenderDetailsHeader={RenderDetailsHeader}
        onShouldVirtualize={() => false}
        setKey="key"
      />
    </div>
  );
};

export default List;
