import { useLayersStore } from 'common/store';
import { useValidationStatus } from 'common/store/progress-bar-steps';
import { FieldLabel } from 'components';
import Dropdown from 'components/dropdown';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { categoryMappingPanel, dropdownStyles, flexContainer, readOnlyFieldLabel } from './layers.style';

const layerSelector = s => [s.setCategoryLayer, s.textLayerNames];

export const CategoryLayer = ({ name, value }) => {
  const { t } = useTranslation();
  const [setCategoryLayer, textLayerNames] = useLayersStore(layerSelector);
  const { failed } = useValidationStatus();

  const filteredLayerNames = textLayerNames;

  const options = useMemo(() => {
    if (filteredLayerNames.length === 0) {
      return [
        {
          key: null,
          text: t('error.empty.layers.dropdown'),
        },
      ];
    }
    return filteredLayerNames.map(layer => ({
      key: layer,
      text: layer,
    }));
  }, [t, filteredLayerNames]);

  const onChangeLayersSelection = useCallback(
    (e, item) => {
      if (filteredLayerNames.length === 0) {
        return;
      }

      setCategoryLayer(item.selectedOptions[0]);
    },
    [setCategoryLayer, filteredLayerNames]
  );

  return (
    <div className={categoryMappingPanel}>
      <div className={flexContainer}>
        <div className={readOnlyFieldLabel}>
          <FieldLabel required tooltip="Property layer from drawing files used to map IMDF category">
            {name}
          </FieldLabel>
        </div>
        <Dropdown
          onOptionSelect={onChangeLayersSelection}
          showFilter
          options={options}
          selectedOptions={[value]}
          selected
          positioning="before"
          className={dropdownStyles}
          showError={failed}
          errorMessage={() => !value && t('error.field.is.required')}
        >
          {value || t('select.layers')}
        </Dropdown>
      </div>
    </div>
  );
};

CategoryLayer.propTypes = {
  name: PropTypes.string.isRequired,
};

export default CategoryLayer;
