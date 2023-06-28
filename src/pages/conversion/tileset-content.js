import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { Pivot, PivotItem } from '@fluentui/react';

import { conversionSteps, useConversionStore } from 'common/store';
import { logsContainer, pivotStyles, pivotStylesObj } from './style';
import TilesetMap from './tileset-map';

const conversionStoreSelector = (s) => [s.tilesetOperationLog, s.tilesetOperationId, s.selectedStep, s.tilesetId, s.mapConfigurationId];

const TilesetContent = () => {
  const { t } = useTranslation();
  const [operationLog, operationId, selectedStep, tilesetId, mapConfigurationId] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.tileset) {
    return null;
  }

  return (
    <div className={pivotStyles}>
      <Pivot className={pivotStyles} styles={pivotStylesObj}>
        <PivotItem headerText={t('logs')} headerButtonProps={{ 'data-title': t('logs') }}>
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
        </PivotItem>
        <PivotItem className={pivotStyles} headerText={t('rendered.map')} headerButtonProps={{ 'data-title': t('rendered.map') }}>
          <TilesetMap />
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default TilesetContent;