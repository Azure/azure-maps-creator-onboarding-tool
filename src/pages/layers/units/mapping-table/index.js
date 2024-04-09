import { Icon } from '@fluentui/react';
import {
  CounterBadge,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  createTableColumn,
} from '@fluentui/react-components';
import { useLayersStore } from 'common/store';
import { useElementSize } from 'hooks';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImdfCategorySelector from './category-selector';
import { emptyTableContent, emptyTableIcon } from './index.style';

const columnSizingOptions = {
  imdfCategory: {
    minWidth: 250,
  },
};

const MappingTable = props => {
  const { texts, height = 600 } = props;

  const { t } = useTranslation();

  const [editingItemId, setEditingItemId] = useState(null);
  const [headerRef, { height: headerHeight }] = useElementSize();

  const [categoryMap, updateCategoryMapping] = useLayersStore(s => [
    s.categoryMapping.categoryMap,
    s.updateCategoryMapping,
  ]);

  const tableItems = Object.keys(categoryMap).map(key => {
    const value = categoryMap[key];
    return {
      id: key,
      fileCategory: key,
      count: texts.reduce(
        (count, current) => (current.toLowerCase().trim() === key.toLowerCase().trim() ? count + 1 : count),
        0
      ),
      imdfCategory: value,
    };
  });

  const handleOptionSelect = (event, option, item) => {
    const { optionValue } = option;
    if (!optionValue) return;

    updateCategoryMapping({ [item.fileCategory]: optionValue });
  };

  const columns = [
    createTableColumn({
      columnId: 'fileCategory',
      compare: (a, b) => a.fileCategory.localeCompare(b.fileCategory),
      renderHeaderCell: () => 'DWG Category',
      renderCell: item => item.fileCategory,
    }),
    createTableColumn({
      columnId: 'count',
      compare: (a, b) => a.count - b.count,
      renderHeaderCell: () => 'Count',
      renderCell: item => (
        <CounterBadge
          count={item.count}
          appearance="filled"
          color={item.count > 0 ? 'informative' : 'danger'}
          showZero
        />
      ),
    }),
    createTableColumn({
      columnId: 'imdfCategory',
      compare: (a, b) => a.imdfCategory.localeCompare(b.imdfCategory),
      renderHeaderCell: () => 'IMDF Category',
      renderCell: item => {
        return editingItemId === item.id ? (
          <ImdfCategorySelector
            selectedOptions={[item.imdfCategory]}
            onOptionSelect={(event, option) => handleOptionSelect(event, option, item)}
            onBlur={() => setEditingItemId(null)}
          />
        ) : (
          <span
            onClick={() => setEditingItemId(item.id)}
            style={{ cursor: 'pointer', paddingLeft: 12, width: 250, height: 22, color: '#005ea5' }}
          >
            <span style={{ fontStyle: item.imdfCategory === 'unspecified' ? 'italic' : 'normal' }}>
              {item.imdfCategory}
            </span>
            <Icon iconName="CaretDownSolid8" style={{ fontSize: 10, color: '#0078d4', paddingLeft: 5 }} />
          </span>
        );
      },
    }),
  ];

  return (
    <DataGrid
      aria-label="Editable Data Grid"
      columns={columns}
      items={tableItems}
      getRowId={item => item.id.toString()}
      sortable
      defaultSortState={{ sortDirection: 'ascending', sortColumn: 'fileCategory' }}
      columnSizingOptions={columnSizingOptions}
      resizableColumns
    >
      <DataGridHeader ref={headerRef}>
        <DataGridRow>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      {tableItems.length === 0 ? (
        <div className={emptyTableContent}>
          <Icon className={emptyTableIcon} iconName="SearchData" />
          <div style={{ fontSize: '1.1rem' }}>No data</div>
          <div>{`Please select a layer from the ${t('unit.category.layer')} dropdown above`}</div>
        </div>
      ) : (
        <DataGridBody style={{ height: height - headerHeight, overflowY: 'auto' }}>
          {({ item, rowId }) => (
            <DataGridRow key={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>
          )}
        </DataGridBody>
      )}
    </DataGrid>
  );
};

export default MappingTable;
