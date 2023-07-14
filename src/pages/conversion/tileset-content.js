import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { conversionSteps, useConversionStore } from 'common/store';
import { logsContainer } from './style';

const conversionStoreSelector = (s) => [s.tilesetOperationLog, s.tilesetOperationId, s.selectedStep, s.tilesetId, s.mapConfigurationId];

const TilesetContent = () => {
  const { t } = useTranslation();
  const [operationLog, operationId, selectedStep, tilesetId, mapConfigurationId] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.tileset) {
    return null;
  }

  return (
    <div>
      <div>
        <h3>{t('meta.data')}</h3>
        <div>operationId: {operationId === null ? 'N/A' : operationId}</div>
        <div>tilesetId: {tilesetId === null ? 'N/A' : tilesetId}</div>
        <div>mapConfigurationId: {mapConfigurationId === null ? 'N/A' : mapConfigurationId}</div>
      </div>
      <div>
        <h3>{t('operation.log')}</h3>
        <pre className={logsContainer}>{operationLog}</pre>
      </div>
    </div>
  );
};

export default TilesetContent;