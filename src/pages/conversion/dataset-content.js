import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { conversionSteps, useConversionStore, conversionStatuses } from 'common/store/conversion.store';
import { boldHeader, contentContainer, logContainer, metaInfoContainer } from './style';
import { Log } from './log';
import { DownloadLogs } from './download-logs';

const conversionStoreSelector = (s) => [s.datasetStepStatus, s.datasetOperationLog, s.datasetId, s.selectedStep];

const DatasetContent = () => {
  const { t } = useTranslation();
  const [datasetStepStatus, datasetOperationLog, datasetId, selectedStep] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.dataset) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        <span className={boldHeader}>DatasetId</span>: {datasetId === null ? 'N/A' : datasetId}
      </div>
      <div className={logContainer}>
        <h3>{t('operation.log')}</h3>
        <Log src={datasetOperationLog} />
      </div>
      {datasetStepStatus !== conversionStatuses.empty && datasetStepStatus !== conversionStatuses.inProgress &&
        <DownloadLogs type='dataset' isFailed={datasetStepStatus === conversionStatuses.failed}
                      json={datasetOperationLog} />}
    </div>
  );
};

export default DatasetContent;