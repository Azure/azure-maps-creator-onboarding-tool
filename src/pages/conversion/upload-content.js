import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { conversionStatuses, conversionSteps, useConversionStore } from 'common/store/conversion.store';
import { boldHeader, contentContainer, logContainer, metaInfoContainer } from './style';
import { Log } from './log';
import { DownloadLogs } from './download-logs';

const conversionStoreSelector = (s) => [s.uploadStepStatus, s.uploadOperationLog, s.uploadUdId, s.selectedStep];

const UploadContent = () => {
  const { t } = useTranslation();
  const [uploadStepStatus, uploadOperationLog, uploadUdId, selectedStep] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.upload) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        <span className={boldHeader}>Udid</span>: {uploadUdId === null ? 'N/A' : uploadUdId}
      </div>
      <div className={logContainer}>
        <h3>{t('operation.log')}</h3>
        <Log src={uploadOperationLog} />
      </div>
      {uploadStepStatus !== conversionStatuses.empty && uploadStepStatus !== conversionStatuses.inProgress &&
        <DownloadLogs type='upload' isFailed={uploadStepStatus === conversionStatuses.failed} json={uploadOperationLog} />}
    </div>
  );
};

export default UploadContent;