import { useTranslation } from 'react-i18next';

import { conversionSteps, conversionStatuses } from 'common/store/conversion.store';
import { boldHeader, contentContainer, logContainer, metaInfoContainer } from './style';
import { Log } from './log';
import { DownloadLogs } from './download-logs';
import CopyIcon from './copy-icon';

const TilesetContent = ({ tilesetStepStatus, tilesetOperationLog, selectedStep, mapConfigurationId, tilesetId }) => {
  const { t } = useTranslation();

  if (selectedStep !== conversionSteps.tileset) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        <div>
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
