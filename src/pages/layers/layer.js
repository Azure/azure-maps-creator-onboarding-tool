import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react';

import { useLayersStore } from 'common/store';
import FieldError from 'components/field-error';
import Property from './property';
import {
  dropdownStyles,
  fieldLabel,
  flexContainer,
  layerRow,
  layerNameInputStyles,
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

  const options = useMemo(() => {
    const optionNames = required ? polygonLayerNames : layerNames;
    return optionNames.map((layer) => ({
      key: layer,
      text: layer,
    }));
  }, [layerNames, polygonLayerNames, required]);
  const deleteThisLayer = useCallback(() => {
    deleteLayer(id);
  }, [deleteLayer, id]);
  const onChangeLayersSelection = useCallback((e, item) => {
    const updatedValue = item.selected ? [...value, item.text] : value.filter(layer => layer !== item.text);
    updateLayer(id, {
      value: updatedValue,
    });
  }, [updateLayer, id, value]);
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

  return (
    <div className={layerRow}>
      <div className={flexContainer}>
        <TextField disabled={required} className={fieldLabel} value={name} onChange={onChangeName}
                   styles={layerNameInputStyles} errorMessage={layerNameError}
                   placeholder={placeholder} />
        <Dropdown placeholder={t('select.layers')} selectedKeys={value} multiSelect
                  onChange={onChangeLayersSelection} options={options}  styles={dropdownStyles} />
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