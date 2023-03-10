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
  s.updateLayer,
  s.getLayerNameError,
];

export const Layer = ({ id, name, value, props, isDraft }) => {
  const { t } = useTranslation();
  const [
    layers,
    deleteLayer,
    layerNames,
    updateLayer,
    getLayerNameError,
  ] = useLayersStore(layerSelector, shallow);

  const options = useMemo(() => {
    if (layerNames.length === 0) {
      return [{
        key: null,
        text: t('error.empty.dropdown'),
      }];
    }
    return layerNames.map((layer) => ({
      key: layer,
      text: layer,
    }));
  }, [t, layerNames]);
  const deleteThisLayer = useCallback(() => {
    deleteLayer(id);
  }, [deleteLayer, id]);
  const onChangeLayersSelection = useCallback((e, item) => {
    if (layerNames.length === 0) {
      return;
    }
    const updatedValue = item.selected ? [...value, item.text] : value.filter(layer => layer !== item.text);
    updateLayer(id, {
      value: updatedValue,
    });
  }, [updateLayer, id, value, layerNames]);
  const onChangeName = useCallback((e) => {
    updateLayer(id, {
      name: e.target.value,
    });
  }, [updateLayer, id]);
  const layerNameError = useMemo(() => {
    if (isDraft) return '';
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
        <TextField className={fieldLabel} value={name} onChange={onChangeName}
                   styles={layerNameInputStyles} errorMessage={layerNameError}
                   placeholder={placeholder} />
        <Dropdown placeholder={t('select.layers')} selectedKeys={value} multiSelect={layerNames.length !== 0}
                  onChange={onChangeLayersSelection} options={options} styles={dropdownStyles} />
        <DeleteIcon isDraft={isDraft} onDelete={deleteThisLayer}
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  props: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
  isDraft: PropTypes.bool.isRequired,
};

export default Layer;