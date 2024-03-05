import { TextField } from '@fluentui/react';
import { useLayersStore } from 'common/store';
import { FieldLabel } from 'components';
import Dropdown from 'components/dropdown';
import FieldError from 'components/field-error';
import { useFeatureFlags } from 'hooks';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from './delete-icon';
import {
  dropdownStyles,
  layerNameInputStyles,
  propertyDropdownStyles,
  propertyFieldLabel,
  propertyRow,
  readOnlyFieldLabel,
  singlePropertyRow,
} from './layers.style';

const layersSelector = s => [s.layers, s.textLayerNames, s.deleteProperty, s.updateProperty, s.getPropertyNameError];

const Property = ({ name, value = [], id, parentId, isDraft, readOnlyName, singleSelect = false, isRequired }) => {
  const { t } = useTranslation();
  const [layers, textLayerNames, deleteProperty, updateProperty, getPropertyNameError] = useLayersStore(layersSelector);

  const { isPlacesPreview } = useFeatureFlags();

  const options = useMemo(() => {
    if (textLayerNames.length === 0) {
      return [
        {
          key: null,
          text: t('error.empty.text.layers.dropdown'),
        },
      ];
    }
    return textLayerNames.map(layer => ({
      key: layer,
      text: layer,
    }));
  }, [t, textLayerNames]);

  const onDelete = useCallback(() => {
    deleteProperty(parentId, id);
  }, [deleteProperty, parentId, id]);
  const onChangeValue = useCallback(
    (e, item) => {
      if (textLayerNames.length === 0) {
        return;
      }
      updateProperty(parentId, id, {
        value: item.selectedOptions,
      });
    },
    [updateProperty, textLayerNames, parentId, id]
  );
  const onChangeName = useCallback(
    e => {
      updateProperty(parentId, id, {
        name: e.target.value,
      });
    },
    [updateProperty, parentId, id]
  );
  const placeholder = useMemo(() => {
    if (isDraft) {
      return t('enter.property.name');
    }
    return '';
  }, [isDraft, t]);
  const propertyNameError = useMemo(() => {
    if (isDraft) return '';
    const error = getPropertyNameError(parentId, name);
    if (error === null) {
      return '';
    }
    return <FieldError text={t(error)} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPropertyNameError, t, name, parentId, layers]);

  return (
    <div className={isPlacesPreview ? singlePropertyRow : propertyRow} style={{}}>
      {isPlacesPreview ? (
        <div className={readOnlyFieldLabel}>
          <FieldLabel required={isRequired}>{name}</FieldLabel>
        </div>
      ) : (
        <TextField
          className={propertyFieldLabel}
          value={name}
          styles={layerNameInputStyles}
          onChange={onChangeName}
          placeholder={placeholder}
          errorMessage={propertyNameError}
          readOnly={readOnlyName}
          aria-required={isRequired}
        />
      )}
      <Dropdown
        onOptionSelect={onChangeValue}
        className={isPlacesPreview ? dropdownStyles : propertyDropdownStyles}
        showFilter
        options={options}
        multiselect={!singleSelect && textLayerNames?.length !== 0}
        selectedOptions={value}
        positioning="before"
      >
        {value?.length ? value.join(', ') : t('select.layers')}
      </Dropdown>
      {!isPlacesPreview && (
        <DeleteIcon isDraft={isDraft} onDelete={onDelete} title={t('delete.property', { propertyName: name })} />
      )}
    </div>
  );
};

Property.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  parentId: PropTypes.string.isRequired,
};

export default Property;
