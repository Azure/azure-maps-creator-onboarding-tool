import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { DetailsList, DetailsRow, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { TextField } from '@fluentui/react';

import { PATHS } from 'common';
import { getAllData } from 'common/api/conversions';
import { conversionStatuses, useConversionStore } from 'common/store/conversion.store';
import { useConversionPastStore } from 'common/store/conversion-past.store';
import { StatusIcon } from './icon';
import { filterInputStyles, iconsContainer, nameFilterContainer } from './style';

const defaultColumns = [
  { key: 'nameCol', name: 'Name', fieldName: 'name', minWidth: 40, maxWidth: 200, isResizable: true },
  { key: 'statusCol', name: 'Status', fieldName: 'status', minWidth: 40, maxWidth: 200, isResizable: true },
  {
    key: 'dateCol',
    name: 'Date',
    fieldName: 'date',
    minWidth: 40,
    maxWidth: 200,
    isResizable: true,
    isSorted: true,
    isSortedDescending: true,
  },
];

const addSorting = (columns, sortingColumnKey) =>
  columns.map(column => ({
    ...column,
    isSorted: column.key === sortingColumnKey,
    isSortedDescending: isDescending(column, sortingColumnKey),
  }));

const isDescending = (column, sortingColumnKey) => {
  if (column.key !== sortingColumnKey) {
    return undefined;
  }
  if (column.isSortedDescending === undefined) {
    return false;
  }
  return !column.isSortedDescending;
};

const getOnColumnClickCallback = (columns, setColumns, setSorting) => (e, column) => {
  if (column.key === 'statusCol') return;
  const newColumns = addSorting(columns, column.key);
  setSorting({
    fieldName: column.fieldName,
    descending: !!newColumns.find(col => col.key === column.key).isSortedDescending,
  });
  setColumns(
    newColumns.map(col => ({
      ...col,
      onColumnClick: getOnColumnClickCallback(newColumns, setColumns, setSorting),
    }))
  );
};

const conversionStoreSelector = s => ({
  uploadStepStatus: s.uploadStepStatus,
  uploadUdId: s.uploadUdId,
  uploadStartTime: s.uploadStartTime,
  uploadDescription: s.uploadDescription,
  conversionStepStatus: s.conversionStepStatus,
  conversionId: s.conversionId,
  conversionDate: s.conversionEndTime,
  datasetStepStatus: s.datasetStepStatus,
  datasetId: s.datasetId,
  datasetDate: s.datasetEndTime,
  tilesetStepStatus: s.tilesetStepStatus,
  tilesetId: s.tilesetId,
  tilesetDate: s.tilesetEndTime,
});

const pastConversionStoreSelector = s => s.setData;

const Conversions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [existingConversions, setExistingConversions] = useState([]);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ fieldName: 'date', descending: true });
  const [columns, setColumns] = useState([]);
  const [nameFilter, setNameFilter] = useState('');

  const ongoingConversion = useConversionStore(conversionStoreSelector, shallow);
  const setPastConversionData = useConversionPastStore(pastConversionStoreSelector, shallow);

  const onItemClick = useCallback(
    item => {
      setPastConversionData(item.conversionData);
      navigate(item.ongoing ? PATHS.CONVERSION : PATHS.PAST_CONVERSION);
    },
    [navigate, setPastConversionData]
  );

  const onNameFilterChange = (e, text) => setNameFilter(text);

  useEffect(() => {
    setColumns(
      defaultColumns.map(column => ({
        ...column,
        onColumnClick: getOnColumnClickCallback(defaultColumns, setColumns, setSorting),
      }))
    );
    getAllData().then(({ conversions, datasets, mapDataList, tilesets }) => {
      setIsLoading(false);
      const groupedItems = groupItems(ongoingConversion, { conversions, datasets, mapDataList, tilesets });
      groupedItems.sort((a, b) => (a.date < b.date ? 1 : -1));
      setExistingConversions(groupedItems);
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    const items = [...existingConversions];
    if (ongoingConversion.uploadStartTime) {
      items.unshift({
        ongoing: true,
        upload: {
          udid: ongoingConversion.uploadUdId,
          uploadStatus: ongoingConversion.uploadStepStatus,
          created: ongoingConversion.uploadStartTime,
          description: ongoingConversion.uploadDescription,
        },
        conversion: {
          conversionId: ongoingConversion.conversionId,
          conversionStatus: ongoingConversion.conversionStepStatus,
          created: ongoingConversion.conversionDate,
        },
        dataset: {
          datasetId: ongoingConversion.datasetId,
          datasetStatus: ongoingConversion.datasetStepStatus,
          created: ongoingConversion.datasetDate,
        },
        tileset: {
          tilesetId: ongoingConversion.tilesetId,
          tilesetStatus: ongoingConversion.tilesetStepStatus,
          created: ongoingConversion.tilesetDate,
        },
        date: new Date(ongoingConversion.tilesetDate ?? ongoingConversion.uploadStartTime),
      });
    }

    setItems(
      items
        .map((item, i) => ({
          key: i,
          name:
            item.upload?.description ??
            item.conversion?.description ??
            item.dataset?.description ??
            item.tileset?.description ??
            '',
          status: (
            <div className={iconsContainer}>
              <StatusIcon item={item.upload} />
              <StatusIcon item={item.conversion} />
              <StatusIcon item={item.dataset} />
              <StatusIcon item={item.tileset} />
            </div>
          ),
          date: item.date.toLocaleString(),
          ongoing: item.ongoing,
          conversionData: {
            uploadStepStatus: item.upload?.udid ? conversionStatuses.finishedSuccessfully : conversionStatuses.empty,
            uploadUdId: item.upload?.udid,
            conversionStepStatus: item.conversion?.conversionId
              ? conversionStatuses.finishedSuccessfully
              : conversionStatuses.empty,
            conversionId: item.conversion?.conversionId,
            datasetStepStatus: item.dataset?.datasetId
              ? conversionStatuses.finishedSuccessfully
              : conversionStatuses.empty,
            datasetId: item.dataset?.datasetId,
            tilesetStepStatus: item.tileset?.tilesetId
              ? conversionStatuses.finishedSuccessfully
              : conversionStatuses.empty,
            tilesetId: item.tileset?.tilesetId,
            mapConfigurationId: item.tileset?.defaultMapConfigurationId,
            bbox: item.tileset?.bbox,
          },
        }))
        .filter(item => item.name.includes(nameFilter))
        .sort((a, b) => {
          if (a[sorting.fieldName] < b[sorting.fieldName]) {
            return sorting.descending ? 1 : -1;
          }
          return sorting.descending ? -1 : 1;
        })
    );
  }, [existingConversions, ongoingConversion, t, sorting, nameFilter]);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <>
      <div className={nameFilterContainer}>
        <TextField
          ariaLabel={t('filter.by.name')}
          placeholder={t('filter.by.name')}
          styles={filterInputStyles}
          value={nameFilter}
          onChange={onNameFilterChange}
        />
      </div>
      <DetailsList
        items={items}
        onItemInvoked={onItemClick}
        columns={columns}
        onRenderRow={data => <DetailsRow {...data} styles={{ root: { fontSize: '0.875rem' } }} />}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={0}
      />
    </>
  );
};

function groupItems(ongoingConversion, { conversions, datasets, mapDataList, tilesets }) {
  const items = [];

  const usedItems = {
    datasets: new Set([ongoingConversion.datasetId]),
    conversions: new Set([ongoingConversion.conversionId]),
    uploads: new Set([ongoingConversion.uploadUdId]),
  };

  tilesets?.forEach(tileset => {
    if (tileset.tilesetId === ongoingConversion.tilesetId) {
      return;
    }
    const item = {
      tileset,
    };
    const dataset = datasets.find(dataset => {
      if (dataset.datasetId === tileset.datasetId) {
        usedItems.datasets.add(dataset.datasetId);
        return true;
      }
      return false;
    });
    item.dataset = dataset;
    const conversionIds = dataset?.datasetSources?.conversionIds ?? [];
    const conversion = conversions.find(c => {
      if (conversionIds.includes(c.conversionId)) {
        usedItems.conversions.add(c.conversionId);
        return true;
      }
      return false;
    });
    item.conversion = conversion;
    item.upload = mapDataList.find(upload => {
      if (upload.udid === conversion?.udid) {
        usedItems.uploads.add(upload.udid);
        return true;
      }
      return false;
    });
    item.date = new Date(item.tileset.created);
    items.push(item);
  });

  datasets?.forEach(dataset => {
    if (usedItems.datasets.has(dataset.datasetId) || dataset.datasetId === ongoingConversion.datasetId) {
      return;
    }
    const item = {
      dataset,
    };

    const conversionIds = dataset.datasetSources?.conversionIds ?? [];
    const conversion = conversions.find(c => {
      if (conversionIds.includes(c.conversionId)) {
        usedItems.conversions.add(c.conversionId);
        return true;
      }
      return false;
    });
    item.conversion = conversion;
    item.upload = mapDataList.find(upload => {
      if (upload.udid === conversion?.udid) {
        usedItems.uploads.add(upload.udid);
        return true;
      }
      return false;
    });
    item.date = new Date(item.dataset.created);
    items.push(item);
  });

  conversions?.forEach(conversion => {
    if (
      usedItems.conversions.has(conversion.conversionId) ||
      conversion.conversionId === ongoingConversion.conversionId
    ) {
      return;
    }
    const item = {
      conversion,
    };

    item.upload = mapDataList.find(upload => {
      if (upload.udid === conversion.udid) {
        usedItems.uploads.add(upload.udid);
        return true;
      }
      return false;
    });
    item.date = new Date(item.conversion.created);
    items.push(item);
  });

  mapDataList?.forEach(upload => {
    if (usedItems.uploads.has(upload.udid) || upload.udid === ongoingConversion.udid) {
      return;
    }
    items.push({
      upload,
      date: new Date(upload.created),
    });
  });

  return items;
}

export default Conversions;
