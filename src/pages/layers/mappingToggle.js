import { Toggle } from '@fluentui/react';
import { useLayersStore } from 'common/store';
import { FieldLabel } from 'components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { categoryLayerRow, featureClassRow, mappingToggle, readOnlyFieldLabel } from './layers.style';

const layerSelector = s => [s.categoryMappingEnabled, s.setCategoryMappingEnabled];

const MappingToggle = () => {
  const { t } = useTranslation();
  const [categoryMappingEnabled, setCategoryMappingEnabled] = useLayersStore(layerSelector);

  const handleToggleChange = (event, checked) => {
    setCategoryMappingEnabled(checked);
  };

  return (
    <div className={categoryLayerRow}>
      <div className={featureClassRow}>
        <div className={readOnlyFieldLabel}>
          <FieldLabel tooltip={t('category.mapping.enable.tooltip')}>{t('category.mapping.enable')}</FieldLabel>
        </div>
        <Toggle className={mappingToggle} checked={categoryMappingEnabled} onChange={handleToggleChange} />
      </div>
    </div>
  );
};

export default MappingToggle;
