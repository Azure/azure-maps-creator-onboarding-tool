import { MessageBar } from '@fluentui/react';
import { conversionStatuses, conversionSteps } from 'common/store/conversion.store';
import { useTranslation } from 'react-i18next';
import CopyIcon from './copy-icon';
import { DownloadLogs } from './download-logs';
import { Log } from './log';
import { boldHeader, contentContainer, logContainer, metaInfoContainer } from './style';

const ConversionContent = ({
  conversionStepStatus,
  conversionOperationLog,
  selectedStep,
  conversionId,
  diagnosticPackageLocation,
}) => {
  const { t } = useTranslation();

  if (selectedStep !== conversionSteps.conversion) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        {conversionStepStatus === conversionStatuses.deleted && (
          <div style={{ marginBottom: '1rem' }}>
            <MessageBar>{t('resource.deleted')}</MessageBar>
          </div>
        )}
        <span className={boldHeader}>ConversionId</span>: {conversionId === null ? '' : conversionId}
        <CopyIcon textToCopy={conversionId} />
      </div>
      {conversionOperationLog && (
        <div className={logContainer}>
          <h3>{t('operation.log')}</h3>
          <Log src={conversionOperationLog} />
        </div>
      )}
      {conversionStepStatus !== conversionStatuses.empty && conversionStepStatus !== conversionStatuses.inProgress && (
        <DownloadLogs
          type="conversion"
          isFailed={conversionStepStatus === conversionStatuses.failed}
          link={diagnosticPackageLocation}
          json={conversionOperationLog}
        />
      )}
    </div>
  );
};

export default ConversionContent;
