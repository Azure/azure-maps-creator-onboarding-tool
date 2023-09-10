import { useTranslation } from 'react-i18next';

import { conversionSteps, conversionStatuses } from 'common/store/conversion.store';
import { boldHeader, contentContainer, logContainer, metaInfoContainer } from './style';
import { Log } from './log';
import { DownloadLogs } from './download-logs';
import CopyIcon from './copy-icon';

const DatasetContent = ({ datasetStepStatus, datasetOperationLog, datasetId, selectedStep }) => {
  const { t } = useTranslation();

  if (selectedStep !== conversionSteps.dataset) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        <span className={boldHeader}>DatasetId</span>: {datasetId === null ? '' : datasetId}
        <CopyIcon textToCopy={datasetId} />
      </div>
      {datasetOperationLog && <div className={logContainer}>
        <h3>{t('operation.log')}</h3>
        <Log src={datasetOperationLog} />
      </div>}
      {datasetStepStatus !== conversionStatuses.empty && datasetStepStatus !== conversionStatuses.inProgress &&
        <DownloadLogs type='dataset' isFailed={datasetStepStatus === conversionStatuses.failed}
                      json={datasetOperationLog} />}
    </div>
  );
};

export default DatasetContent;