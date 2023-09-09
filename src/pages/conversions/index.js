import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { DetailsList, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';

import { PATHS } from 'common';
import { getAllData } from 'common/api/conversions';
import { useConversionStore } from 'common/store/conversion.store';
import { StatusIcon } from './icon';

const columns =  [
  { key: 'nameCol', name: 'Name', fieldName: 'name', minWidth: 40, maxWidth: 200, isResizable: true },
  { key: 'statusCol', name: 'Status', fieldName: 'status', minWidth: 40, maxWidth: 50, isResizable: true },
  { key: 'dateCol', name: 'Date', fieldName: 'date', minWidth: 40, maxWidth: 200, isResizable: true },
  { key: 'actionCol', name: 'View Progress', fieldName: 'view', minWidth: 50, maxWidth: 100, isResizable: true,
    onRender: ({ actionButton }) => actionButton()
  },
];

const conversionStoreSelector = (s) => ({
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

const Conversions = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [existingConversions, setExistingConversions] = useState([]);
  const [items, setItems] = useState([]);
  const ongoingConversion = useConversionStore(conversionStoreSelector, shallow);

  useEffect(() => {
    getAllData().then(({ conversions, datasets, mapDataList, tilesets }) => {
      setIsLoading(false);
      const groupedItems = groupItems(ongoingConversion, { conversions, datasets, mapDataList, tilesets });
      groupedItems.sort((a, b) => a.date < b.date ? 1 : -1);
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

      setItems(items.map((item, i) => ({
        key: i,
        actionButton: () => {
          if (item.ongoing) {
            return <Link to={PATHS.CONVERSION}>{t('view')}</Link>;
          }
          return null;
        },
        name: item.upload?.description,
        status: (
          <>
            <StatusIcon item={item.upload} />
            <StatusIcon item={item.conversion} />
            <StatusIcon item={item.dataset} />
            <StatusIcon item={item.tileset} />
          </>
        ),
        date: item.date.toLocaleString(),
      })));
  }, [existingConversions, ongoingConversion, t]);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <DetailsList
      items={items}
      columns={columns}
      layoutMode={DetailsListLayoutMode.justified}
      selectionMode={0}
    />
  );
};

function groupItems(ongoingConversion, { conversions, datasets, mapDataList, tilesets }) {
  const items = [];

  const usedItems = {
    datasets: new Set([ongoingConversion.datasetId]),
    conversions: new Set([ongoingConversion.conversionId]),
    uploads: new Set([ongoingConversion.uploadUdId]),
  };

  tilesets?.forEach((tileset) => {
    if (tileset.tilesetId === ongoingConversion.tilesetId) {
      return;
    }
    const item = {
      tileset,
    };
    const dataset = datasets.find((dataset) => {
      if (dataset.datasetId === tileset.datasetId) {
        usedItems.datasets.add(dataset.datasetId);
        return true;
      }
      return false;
    });
    item.dataset = dataset;
    const conversionIds = dataset?.datasetSources?.conversionIds ?? [];
    const conversion = conversions.find((c) => {
      if (conversionIds.includes(c.conversionId)) {
        usedItems.conversions.add(c.conversionId);
        return true;
      }
      return false;
    });
    item.conversion = conversion;
    item.upload = mapDataList.find((upload) => {
      if (upload.udid === conversion?.udid) {
        usedItems.uploads.add(upload.udid);
        return true;
      }
      return false;
    });
    item.date = new Date(item.tileset.created);
    items.push(item);
  });

  datasets?.forEach((dataset) => {
    if (usedItems.datasets.has(dataset.datasetId) || dataset.datasetId === ongoingConversion.datasetId) {
      return;
    }
    const item = {
      dataset,
    };

    const conversionIds = dataset.datasetSources?.conversionIds ?? [];
    const conversion = conversions.find((c) => {
      if (conversionIds.includes(c.conversionId)) {
        usedItems.conversions.add(c.conversionId);
        return true;
      }
      return false;
    });
    item.conversion = conversion;
    item.upload = mapDataList.find((upload) => {
      if (upload.udid === conversion?.udid) {
        usedItems.uploads.add(upload.udid);
        return true;
      }
      return false;
    });
    item.date = new Date(item.dataset.created);
    items.push(item);
  });

  conversions?.forEach((conversion) => {
    if (usedItems.conversions.has(conversion.conversionId) || conversion.conversionId === ongoingConversion.conversionId) {
      return;
    }
    const item = {
      conversion,
    };

    item.upload = mapDataList.find((upload) => {
      if (upload.udid === conversion.udid) {
        usedItems.uploads.add(upload.udid);
        return true;
      }
      return false;
    });
    item.date = new Date(item.conversion.created);
    items.push(item);
  });

  mapDataList?.forEach((upload) => {
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