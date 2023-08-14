import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { conversionSteps, useConversionStore, conversionStatuses } from 'common/store/conversion.store';
import { boldHeader, contentContainer, logContainer, metaInfoContainer } from './style';
import { Log } from './log';
import { DownloadLogs } from './download-logs';

const conversionStoreSelector = (s) => [s.tilesetStepStatus, s.tilesetOperationLog, s.selectedStep, s.mapConfigurationId, s.tilesetId];

const TilesetContent = () => {
  const { t } = useTranslation();
  const [tilesetStepStatus, operationLog, selectedStep, mapConfigurationId, tilesetId] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.tileset) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        <div>
          <span className={boldHeader}>MapConfigurationId</span>: {mapConfigurationId === null ? '' : mapConfigurationId}
        </div>
        <div>
          <span className={boldHeader}>MapConfigurationAlias</span>: {tilesetId === null ? '' : `default_${tilesetId}`}
        </div>
      </div>
      <div className={logContainer}>
        <h3>{t('operation.log')}</h3>
        <Log src={operationLog} />
      </div>
      {tilesetStepStatus !== conversionStatuses.empty && tilesetStepStatus !== conversionStatuses.inProgress &&
        <DownloadLogs type='tileset' isFailed={tilesetStepStatus === conversionStatuses.failed}
                      json={operationLog} />}
    </div>
  );
};

export default TilesetContent;