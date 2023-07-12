import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { TextField } from '@fluentui/react';

import { useLayersStore } from 'common/store';
import Dropdown from 'components/dropdown';
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
  s.setPreviewSingleFeatureClass,
];

export const Layer = ({ id, name, value, props, isDraft }) => {
  const { t } = useTranslation();
  const [
    layers,
    deleteLayer,
    layerNames,
    updateLayer,
    getLayerNameError,
    setPreviewSingleFeatureClass,
  ] = useLayersStore(layerSelector, shallow);

  const options = useMemo(() => {
    if (layerNames.length === 0) {
      return [{
        key: null,
        text: t('error.empty.layers.dropdown'),
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
    updateLayer(id, {
      value: item.selectedOptions,
    });
  }, [updateLayer, id, layerNames]);
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
  }, [getLayerNameError, t, name, layers]); // eslint-disable-line react-hooks/exhaustive-deps
  const placeholder = useMemo(() => {
    if (isDraft) {
      return t('enter.feature.class.name');
    }
    return '';
  }, [isDraft, t]);
  const showTempPreview = useCallback((e, { open }) => {
    if (open) {
      setPreviewSingleFeatureClass(id);
    } else {
      setPreviewSingleFeatureClass(null);
    }
  }, [id, setPreviewSingleFeatureClass]);

  return (
    <div className={layerRow}>
      <div className={flexContainer}>
        <TextField className={fieldLabel} value={name} onChange={onChangeName} styles={layerNameInputStyles}
                   errorMessage={layerNameError} placeholder={placeholder} />
        <Dropdown placeholder={t('geography')} onOptionSelect={onChangeLayersSelection} onOpenChange={showTempPreview}
                  options={options} multiselect={layerNames.length !== 0} selectedOptions={value}
                  positioning='before' className={dropdownStyles}>
          {value.length ? value.join(', ') : t('select.layers')}
        </Dropdown>
        <DeleteIcon isDraft={isDraft} onDelete={deleteThisLayer} title={t('delete.layer', { layerName: name })} />
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