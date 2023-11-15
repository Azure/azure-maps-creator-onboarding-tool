export const groupItems = (ongoingConversion, { conversions, datasets, mapDataList, tilesets }) => {
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
};
