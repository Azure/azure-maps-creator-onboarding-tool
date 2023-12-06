import { MessageBar } from '@fluentui/react';
import { conversionStatuses, conversionSteps } from 'common/store/conversion.store';
import { useTranslation } from 'react-i18next';
import CopyIcon from './copy-icon';
import { DownloadLogs } from './download-logs';
import { Log } from './log';
import { boldHeader, contentContainer, logContainer, metaInfoContainer } from './style';

const UploadContent = ({ uploadStepStatus, uploadOperationLog, uploadUdId, selectedStep }) => {
  const { t } = useTranslation();

  if (selectedStep !== conversionSteps.upload) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        {uploadStepStatus === conversionStatuses.deleted && (
          <div style={{ marginBottom: '1rem' }}>
            <MessageBar>{t('resource.deleted')}</MessageBar>
          </div>
        )}
        <span className={boldHeader}>Udid</span>: {uploadUdId === null ? '' : uploadUdId}
        <CopyIcon textToCopy={uploadUdId} />
      </div>
      {uploadOperationLog && (
        <div className={logContainer}>
          <h3>{t('operation.log')}</h3>
          <Log src={uploadOperationLog} />
        </div>
      )}
      {uploadStepStatus !== conversionStatuses.empty && uploadStepStatus !== conversionStatuses.inProgress && (
        <DownloadLogs
          type="upload"
          isFailed={uploadStepStatus === conversionStatuses.failed}
          json={uploadOperationLog}
        />
      )}
    </div>
  );
};

export default UploadContent;
