import { TextField } from '@fluentui/react';
import { useLayersStore } from 'common/store';
import { useValidationStatus } from 'common/store/progress-bar-steps';
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
  fieldLabel,
  flexContainer,
  layerNameInputStyles,
  layerRow,
  readOnlyFieldLabel,
} from './layers.style';
import Property from './property';

const layerSelector = s => [
  s.layers,
  s.deleteLayer,
  s.layerNames,
  s.polygonLayerNames,
  s.updateLayer,
  s.getLayerNameError,
  s.setPreviewSingleFeatureClass,
];

export const Layer = ({ id, name, tooltip, value, props, isDraft, readOnlyName = false }) => {
  const { t } = useTranslation();
  const [
    layers,
    deleteLayer,
    layerNames,
    polygonLayerNames,
    updateLayer,
    getLayerNameError,
    setPreviewSingleFeatureClass,
  ] = useLayersStore(layerSelector);

  const { failed } = useValidationStatus();
  const { isPlacesPreview } = useFeatureFlags();
  const filteredLayerNames = isPlacesPreview ? polygonLayerNames : layerNames;

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

  const deleteThisLayer = useCallback(() => {
    deleteLayer(id);
  }, [deleteLayer, id]);

  const onChangeLayersSelection = useCallback(
    (e, item) => {
      if (filteredLayerNames.length === 0) {
        return;
      }
      updateLayer(id, {
        value: item.selectedOptions,
      });
    },
    [updateLayer, id, filteredLayerNames]
  );

  const onChangeName = useCallback(
    e => {
      updateLayer(id, {
        name: e.target.value,
      });
    },
    [updateLayer, id]
  );

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

  const showTempPreview = useCallback(
    (e, { open }) => {
      if (open) {
        setPreviewSingleFeatureClass(id);
      } else {
        setPreviewSingleFeatureClass(null);
      }
    },
    [id, setPreviewSingleFeatureClass]
  );

  return (
    <div className={layerRow}>
      <div className={flexContainer}>
        {isPlacesPreview ? (
          <div className={readOnlyFieldLabel}>
            <FieldLabel required tooltip={tooltip}>
              {name}
            </FieldLabel>
          </div>
        ) : (
          <TextField
            className={fieldLabel}
            value={name}
            onChange={onChangeName}
            styles={layerNameInputStyles}
            errorMessage={layerNameError}
            placeholder={placeholder}
            readOnly={readOnlyName}
          />
        )}
        <Dropdown
          onOptionSelect={onChangeLayersSelection}
          onOpenChange={showTempPreview}
          showFilter
          options={options}
          multiselect={filteredLayerNames.length !== 0}
          selectedOptions={value}
          positioning="before"
          className={dropdownStyles}
          showError={!isDraft && failed}
          errorMessage={() => (value.length === 0 ? t('error.field.is.required') : '')}
        >
          {value.length ? value.join(', ') : t('select.layers')}
        </Dropdown>
        {!isPlacesPreview && (
          <DeleteIcon
            isDraft={isDraft}
            onDelete={deleteThisLayer}
            title={t('delete.layer', { layerName: name })}
            placeholder={<div style={{ width: 24 }} />}
          />
        )}
      </div>
      {props.map(property => (
        <Property
          key={property.id}
          name={property.name}
          value={property.value}
          id={property.id}
          parentId={id}
          isDraft={property.isDraft}
          readOnlyName={isPlacesPreview}
        />
      ))}
    </div>
  );
};

Layer.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  props: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  isDraft: PropTypes.bool.isRequired,
};

export default Layer;
