import { Toggle } from '@fluentui/react';
import { useLayersStore } from 'common/store';
import { FieldLabel } from 'components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { categoryLayerRow, flexContainer, readOnlyFieldLabel } from './layers.style';

const layerSelector = s => [s.categoryMappingEnabled, s.setCategoryMappingEnabled];

const MappingToggle = () => {
  const { t } = useTranslation();
  const [categoryMappingEnabled, setCategoryMappingEnabled] = useLayersStore(layerSelector);

  const handleToggleChange = (event, checked) => {
    setCategoryMappingEnabled(checked);
  };

  return (
    <div className={categoryLayerRow}>
      <div className={flexContainer}>
        <div className={readOnlyFieldLabel}>
          <FieldLabel>{t('category.mapping.enable')}</FieldLabel>
        </div>
        <div>
          <Toggle checked={categoryMappingEnabled} onChange={handleToggleChange} />
        </div>
      </div>
    </div>
  );
};

export default MappingToggle;
