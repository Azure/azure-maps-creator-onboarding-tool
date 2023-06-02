import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { Pivot, PivotItem } from '@fluentui/react';

import { conversionSteps, useConversionStore } from 'common/store';
import { logsContainer } from './style';
import TilesetMap from './tileset-map';

const conversionStoreSelector = (s) => [s.tilesetOperationLog, s.tilesetOperationId, s.selectedStep, s.tilesetId];

const TilesetContent = () => {
  const { t } = useTranslation();
  const [operationLog, operationId, selectedStep, tilesetId] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.tileset) {
    return null;
  }

  return (
    <div>
      <Pivot>
        <PivotItem headerText={t('rendered.map')} headerButtonProps={{ 'data-title': t('rendered.map') }}>
          <TilesetMap />
        </PivotItem>
        <PivotItem headerText={t('logs')} headerButtonProps={{ 'data-title': t('logs') }} >
          <div>
            <h3>{t('meta.data')}</h3>
            <div>operationId: {operationId === null ? 'N/A' : operationId}</div>
            <div>tilesetId: {tilesetId === null ? 'N/A' : tilesetId}</div>
          </div>
          <div>
            <h3>{t('operation.log')}</h3>
            <pre className={logsContainer}>{operationLog}</pre>
          </div>
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default TilesetContent;