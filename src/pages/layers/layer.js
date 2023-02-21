import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react';

import { useLayersStore, useProgressBarStore } from 'common/store';
import FieldError from 'components/field-error';
import Property from './property';
import {
  dropdownStyles,
  fieldLabel,
  flexContainer,
  layerRow,
  layerNameInputStyles,
  disabledLayerNameInput,
} from './layers.style';
import DeleteIcon from './delete-icon';

const layerSelector = (s) => [
  s.layers,
  s.deleteLayer,
  s.layerNames,
  s.polygonLayerNames,
  s.updateLayer,
  s.getLayerNameError,
];
const progressBarSelector = (s) => s.isErrorShown;

export const Layer = ({ id, name, value, props, required, isDraft }) => {
  const { t } = useTranslation();
  const [
    layers,
    deleteLayer,
    layerNames,
    polygonLayerNames,
    updateLayer,
    getLayerNameError,
  ] = useLayersStore(layerSelector, shallow);
  const isProgressBarErrorShown = useProgressBarStore(progressBarSelector);

  const optionNames = useMemo(() => (
    required ? polygonLayerNames : layerNames
  ), [layerNames, polygonLayerNames, required]);

  const options = useMemo(() => {
    if (optionNames.length === 0) {
      return [{
        key: null,
        text: t('error.empty.dropdown'),
      }];
    }
    return optionNames.map((layer) => ({
      key: layer,
      text: layer,
    }));
  }, [t, optionNames]);
  const deleteThisLayer = useCallback(() => {
    deleteLayer(id);
  }, [deleteLayer, id]);
  const onChangeLayersSelection = useCallback((e, item) => {
    if (optionNames.length === 0) {
      return;
    }
    const updatedValue = item.selected ? [...value, item.text] : value.filter(layer => layer !== item.text);
    updateLayer(id, {
      value: updatedValue,
    });
  }, [updateLayer, id, value, optionNames]);
  const onChangeName = useCallback((e) => {
    updateLayer(id, {
      name: e.target.value,
    });
  }, [updateLayer, id]);
  const layerNameError = useMemo(() => {
    if (required || isDraft) return '';
    const error = getLayerNameError(name);
    if (error === null) {
      return '';
    }
    return <FieldError text={t(error)} />;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLayerNameError, t, name, layers]);
  const placeholder = useMemo(() => {
    if (isDraft) {
      return t('enter.feature.class.name');
    }
    return '';
  }, [isDraft, t]);
  const textFieldStyles = useMemo(() => (
    required ? disabledLayerNameInput : layerNameInputStyles
  ), [required]);
  const dropDownErrorMsg = useMemo(() => {
    if (required && isProgressBarErrorShown && value.length === 0) {
      return t('error.field.is.required');
    }
    return null;
  }, [required, t, isProgressBarErrorShown, value]);

  return (
    <div className={layerRow}>
      <div className={flexContainer}>
        <TextField disabled={required} className={fieldLabel} value={name} onChange={onChangeName}
                   styles={textFieldStyles} errorMessage={layerNameError}
                   placeholder={placeholder} />
        <Dropdown placeholder={t('select.layers')} selectedKeys={value} multiSelect={optionNames.length !== 0}
                  onChange={onChangeLayersSelection} options={options} styles={dropdownStyles}
                  errorMessage={dropDownErrorMsg} />
        <DeleteIcon required={required} isDraft={isDraft} onDelete={deleteThisLayer}
                    title={t('delete.layer', { layerName: name })} />
      </div>
      {props.map((property) => (
        <Property key={property.id} name={property.name} value={property.value}
                  id={property.id} parentId={id} isDraft={property.isDraft} />
      ))}
    </div>
  );
};

Layer.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  props: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
  required: PropTypes.bool.isRequired,
  isDraft: PropTypes.bool.isRequired,
};

export default Layer;