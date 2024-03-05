import { Spinner, SpinnerSize, TextField } from '@fluentui/react';
import { DetailsList, DetailsListLayoutMode, DetailsRow, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { PATHS } from 'common';
import { getExistingConversions } from 'common/api/conversions';
import { useConversionPastStore } from 'common/store/conversion-past.store';
import { conversionStatuses, useConversionStore } from 'common/store/conversion.store';
import { useCustomNavigate } from 'hooks';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { StatusIcon } from './icon';
import { filterInputStyles, iconsContainer, nameFilterContainer } from './style';
import { groupItems } from './utils';
const defaultColumns = [
  { key: 'nameCol', name: 'Description', fieldName: 'description', minWidth: 40, maxWidth: 460, isResizable: true },
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
  const navigate = useCustomNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [existingConversions, setExistingConversions] = useState([]);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ fieldName: 'date', descending: true });
  const [columns, setColumns] = useState([]);
  const [descriptionFilter, setDescriptionFilter] = useState('');

  const ongoingConversion = useConversionStore(conversionStoreSelector);
  const setPastConversionData = useConversionPastStore(pastConversionStoreSelector);

  const onItemClick = useCallback(
    item => {
      setPastConversionData(item.conversionData);
      navigate(item.ongoing ? PATHS.CONVERSION : PATHS.PAST_CONVERSION);
    },
    [navigate, setPastConversionData]
  );

  const onNameFilterChange = (e, text) => setDescriptionFilter(text);

  useEffect(() => {
    // setIsLoading(true);
    setColumns(
      defaultColumns.map(column => ({
        ...column,
        onColumnClick: getOnColumnClickCallback(defaultColumns, setColumns, setSorting),
      }))
    );
    getExistingConversions().then(({ error, conversions, datasets, mapDataList, tilesets }) => {
      setIsLoading(false);
      if (error) {
        toast.error('Unable to fetch existing conversions. Check your Geography and Subscription key');
        navigate(PATHS.INDEX);
      }
      const groupedItems = groupItems(ongoingConversion, { conversions, datasets, mapDataList, tilesets });
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
        date: new Date(
          ongoingConversion.tilesetDate ??
            ongoingConversion.datasetDate ??
            ongoingConversion.conversionDate ??
            ongoingConversion.uploadStartTime
        ),
      });
    }

    setItems(
      items
        .map((item, i) => {
          const statuses = [item.upload, item.conversion, item.dataset, item.tileset];
          return {
            key: i,
            description:
              item.upload?.description ??
              item.conversion?.description ??
              item.dataset?.description ??
              item.tileset?.description ??
              '',
            status: (
              <div className={iconsContainer}>
                {statuses.map((status, i) => {
                  const isResourceDeleted = !status && statuses.slice(i + 1, 4).some(v => v !== undefined);
                  return <StatusIcon key={i} item={status} deleted={isResourceDeleted} />;
                })}
              </div>
            ),
            date: item.date.toISOString(),
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
          };
        })
        .filter(item => item.description.toLowerCase().includes(descriptionFilter.toLowerCase()))
        .sort((a, b) => {
          if (a[sorting.fieldName] < b[sorting.fieldName]) {
            return sorting.descending ? 1 : -1;
          }
          return sorting.descending ? -1 : 1;
        })
        .map((item, i) => ({ ...item, date: new Date(item.date).toLocaleString() }))
    );
  }, [existingConversions, ongoingConversion, t, sorting, descriptionFilter]);

  if (isLoading) {
    return (
      <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size={SpinnerSize.large} label={t('loading')} />
      </div>
    );
  }

  return (
    <>
      <div className={nameFilterContainer}>
        <TextField
          ariaLabel={t('filter.by.description')}
          placeholder={t('filter.by.description')}
          styles={filterInputStyles}
          value={descriptionFilter}
          onChange={onNameFilterChange}
        />
      </div>
      <DetailsList
        items={items}
        columns={columns}
        onRenderRow={data => (
          <DetailsRow
            {...data}
            onClick={() => onItemClick(data.item)}
            styles={{ root: { fontSize: '0.875rem', cursor: 'pointer' } }}
          />
        )}
        onShouldVirtualize={() => false}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
    </>
  );
};

export default Conversions;
