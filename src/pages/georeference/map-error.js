import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

import { errorContainer } from './georeference.style';
import { useGeometryStore } from 'common/store';

const dwgLayersSelector = (s) => s.dwgLayers;

const MapError = () => {
  const { t } = useTranslation();
  const dwgLayers = useGeometryStore(dwgLayersSelector);

  if (dwgLayers.length > 0) {
    return null;
  }

  return (
    <div className={errorContainer}>
      <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
        {t('exterior.layer.not.selected.error')}
      </MessageBar>
    </div>
  );
};

export default MapError;