import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

import { errorContainer } from './georeference.style';
import { useLayersStore } from 'common/store';

const layersSelector = (s) => s.layers.find((layer) => layer.id === 0);

const MapError = () => {
  const { t } = useTranslation();
  const exteriorLayer = useLayersStore(layersSelector);

  if (exteriorLayer.value.length > 0) {
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