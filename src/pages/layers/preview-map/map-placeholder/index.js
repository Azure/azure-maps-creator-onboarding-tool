import { DefaultButton } from '@fluentui/react';
import { PATHS } from 'common';
import { useCustomNavigate, useFeatureFlags } from 'hooks';
import { primaryButtonStyle } from 'pages/create-manifest/create-manifest.style';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { mapPlaceholder, mapPlaceholderWrapper } from './index.style';

const MapPlaceholder = () => {
  const navigate = useCustomNavigate();
  const { isPlacesPreview } = useFeatureFlags();
  const { t } = useTranslation();

  const handleButtonClick = () => navigate(PATHS.CREATE_GEOREFERENCE);

  return (
    <div className={mapPlaceholderWrapper}>
      <div className={mapPlaceholder}>
        <div style={{ fontSize: '1.1rem' }}>{`${
          isPlacesPreview ? t('footprint') : t('exterior')
        } layer not selected`}</div>
        <div>Please select layer(s) from the Georeference tab</div>
        <div>
          <DefaultButton className={primaryButtonStyle} onClick={handleButtonClick}>
            Go to Georeference
          </DefaultButton>
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;
