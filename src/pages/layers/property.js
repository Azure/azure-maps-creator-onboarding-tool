import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import DeleteIcon from './delete-icon';
import FieldError from 'components/field-error';

import {
  dropdownStyles,
  propertyRow,
  propertyFieldLabel,
  layerNameInputStyles,
} from './layers.style';
import { useLayersStore } from 'common/store';

const layersSelector = (s) => [s.layers, s.textLayerNames, s.deleteProperty, s.updateProperty, s.getPropertyNameError];

const Property = ({ name, value, id, parentId, isDraft }) => {
  const { t } = useTranslation();
  const [layers, textLayerNames, deleteProperty, updateProperty, getPropertyNameError] = useLayersStore(layersSelector, shallow);

  const options = useMemo(() => {
    if (textLayerNames.length === 0) {
      return [{
        key: null,
        text: t('error.empty.dropdown'),
      }];
    }
    return textLayerNames.map((layer) => ({
      key: layer,
      text: layer,
    }));
  }, [t, textLayerNames]);

  const onDelete = useCallback(() => {
    deleteProperty(parentId, id);
  }, [deleteProperty, parentId, id]);
  const onChangeValue = useCallback((e, item) => {
    if (textLayerNames.length === 0) {
      return;
    }
    const updatedValue = item.selected ? [...value, item.text] : value.filter(layer => layer !== item.text);
    updateProperty(parentId, id, {
      value: updatedValue,
    });
  }, [updateProperty, textLayerNames, parentId, id, value]);
  const onChangeName = useCallback((e) => {
    updateProperty(parentId, id, {
      name: e.target.value,
    });
  }, [updateProperty, parentId, id]);
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
    <div className={propertyRow}>
      <TextField className={propertyFieldLabel} value={name} styles={layerNameInputStyles}
                 onChange={onChangeName} placeholder={placeholder} errorMessage={propertyNameError} />
      <Dropdown placeholder={t('select.layers')} selectedKeys={value} onChange={onChangeValue}
                multiSelect={textLayerNames.length !== 0} options={options} styles={dropdownStyles} />
      <DeleteIcon required={false} isDraft={isDraft} onDelete={onDelete}
                  title={t('delete.property', { propertyName: name })} />
    </div>
  );
};

Property.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  parentId: PropTypes.number.isRequired,
};

export default Property;