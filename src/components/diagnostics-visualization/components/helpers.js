import nextId from 'react-id-generator';

const parseDetail = rawDetail => {
  const { code, message, innererror } = rawDetail;
  const layerName = innererror ? (innererror.layerName ? String(innererror.layerName) : 'undefined') : 'undefined';
  const levelOrdinal = innererror
    ? !Number.isNaN(Number(innererror.levelOrdinal))
      ? Number(innererror.levelOrdinal)
      : 'NaN'
    : 'NaN';

  return {
    // eslint-disable-next-line no-plusplus
    key: nextId(),
    code,
    layerName,
    levelOrdinal,
    message,
    rawDetail,
    ...(innererror && { geometry: innererror.geometry }),
  };
};

export const parseDiagnosticData = data => {
  const errorDetailsAreMissing = !data || !data.error || !data.error.details;
  const warningDetailsAreMissing = !data || !data.warning || !data.warning.details;
  const levelOutlinesAreMissing = !data || !data.levelOutlines || !data.levelOutlines.features;

  let parseError = null;

  const items = {
    errors: [],
    levelOutlines: [],
  };

  if ((errorDetailsAreMissing || warningDetailsAreMissing) && levelOutlinesAreMissing) {
    return { parseError: 'Both level outlines and error / warning details are missing from the file.' };
  }

  if (!errorDetailsAreMissing) {
    const errorDetailsList = data.error.details;
    errorDetailsList.forEach(errorDetailsItem => {
      const errorDetails = errorDetailsItem.details;
      if (!errorDetails) {
        parseError = 'Error details are missing from the file.';
        return;
      }

      errorDetails.forEach(errorDetail => {
        items.errors.push(parseDetail(errorDetail));
      });
    });
  }

  if (!warningDetailsAreMissing) {
    const warningDetailsList = data.warning.details;
    warningDetailsList.forEach(warningDetailsItem => {
      const warningDetails = warningDetailsItem.details;
      if (!warningDetails) {
        parseError = 'Warning details are missing from the file.';
        return;
      }

      warningDetails.forEach(warningDetail => {
        // @TODO temporarily pushing warning to errors
        items.errors.push(parseDetail(warningDetail));
      });
    });
  }

  if (!levelOutlinesAreMissing) {
    const levelOutlines = data.levelOutlines.features;
    levelOutlines.forEach((levelOutline, key) => {
      const { properties, geometry } = levelOutline;
      items.levelOutlines.push({
        key,
        geometry,
        ...(properties && `${properties.ordinal}` && { levelOrdinal: properties.ordinal }),
      });
    });
  }

  return { parseError, items };
};
