import { MessageBar } from '@fluentui/react';
import { conversionStatuses, conversionSteps } from 'common/store/conversion.store';
import { useTranslation } from 'react-i18next';
import CopyIcon from './copy-icon';
import { DownloadLogs } from './download-logs';
import { Log } from './log';
import { boldHeader, contentContainer, logContainer, metaInfoContainer } from './style';

const TilesetContent = ({ tilesetStepStatus, tilesetOperationLog, selectedStep, mapConfigurationId, tilesetId }) => {
  const { t } = useTranslation();

  if (selectedStep !== conversionSteps.tileset) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        <div>
          {tilesetStepStatus === conversionStatuses.deleted && (
            <div style={{ marginBottom: '1rem' }}>
              <MessageBar>{t('resource.deleted')}</MessageBar>
            </div>
          )}
          <span className={boldHeader}>MapConfigurationId</span>:{' '}
          {mapConfigurationId === null ? '' : mapConfigurationId}
          <CopyIcon textToCopy={mapConfigurationId} />
        </div>
        <div>
          <span className={boldHeader}>MapConfigurationAlias</span>: {tilesetId === null ? '' : `default_${tilesetId}`}
          <CopyIcon textToCopy={`default_${tilesetId}`} />
        </div>
      </div>
      {tilesetOperationLog && (
        <div className={logContainer}>
          <h3>{t('operation.log')}</h3>
          <Log src={tilesetOperationLog} />
        </div>
      )}
      {tilesetStepStatus !== conversionStatuses.empty && tilesetStepStatus !== conversionStatuses.inProgress && (
        <DownloadLogs
          type="tileset"
          isFailed={tilesetStepStatus === conversionStatuses.failed}
          json={tilesetOperationLog}
        />
      )}
    </div>
  );
};

export default TilesetContent;
