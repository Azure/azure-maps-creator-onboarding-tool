import { TextField } from '@fluentui/react';
import { useGeometryStore, useLayersStore } from 'common/store';
import { useValidationStatus } from 'common/store/progress-bar-steps.store';
import { ColumnLayout, ColumnLayoutItem } from 'components/column-layout';
import Dropdown from 'components/dropdown';
import FieldLabel from 'components/field-label';
import FillScreenContainer from 'components/fill-screen-container';
import PageDescription from 'components/page-description/page-description';
import { useFeatureFlags } from 'hooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CheckedMap from './checked-map';
import { textFieldLabelStyle, textFieldRow, textFieldStyle, textInputStyles } from './georeference.style';

const geometryStoreSelector = s => [s.dwgLayers, s.setDwgLayers, s.anchorPoint.coordinates, s.anchorPoint.angle];
const layersSelector = s => s.polygonLayerNames;

function Georeference() {
  const { t } = useTranslation();
  const [dwgLayers, setDwgLayers, anchorPointCoordinates, anchorPointAngle] = useGeometryStore(geometryStoreSelector);
  const polygonLayers = useLayersStore(layersSelector);
  const { isPlacesPreview } = useFeatureFlags();
  const { failed } = useValidationStatus();
  const options = useMemo(() => {
    if (polygonLayers.length === 0) {
      return [
        {
          key: null,
          text: t('error.empty.layers.dropdown'),
        },
      ];
    }
    return polygonLayers.map(layer => ({
      key: layer,
      text: layer,
    }));
  }, [t, polygonLayers]);

  const onExteriorLayersSelect = useCallback(
    (e, item) => {
      if (polygonLayers.length === 0) {
        return;
      }
      setDwgLayers(item.selectedOptions);
    },
    [setDwgLayers, polygonLayers]
  );

  return (
    <ColumnLayout forceRows={isPlacesPreview}>
      <ColumnLayoutItem>
        <PageDescription description={t('page.description.georeference')} />
        <div className={textFieldRow}>
          <FieldLabel
            className={textFieldLabelStyle}
            tooltip={isPlacesPreview ? t('footprint.tooltip') : t('exterior.tooltip')}
            required
          >
            {isPlacesPreview ? t('footprint') : t('exterior')}
          </FieldLabel>
          <Dropdown
            placeholder={t('geography')}
            onOptionSelect={onExteriorLayersSelect}
            className={textFieldStyle}
            options={options}
            multiselect={polygonLayers.length !== 0 && !isPlacesPreview}
            selectedOptions={dwgLayers}
            showFilter
            showError={failed}
            errorMessage={() => (dwgLayers.length === 0 ? t('error.field.is.required') : '')}
          >
            {dwgLayers.length ? dwgLayers.join(', ') : t('select.layers')}
          </Dropdown>
        </div>
        {!isPlacesPreview && (
          <div>
            <div className={textFieldRow}>
              <FieldLabel className={textFieldLabelStyle}>{t('anchor.point.longitude')}</FieldLabel>
              <TextField
                disabled
                readOnly
                value={anchorPointCoordinates[0].toString()}
                className={textFieldStyle}
                ariaLabel={t('anchor.point.longitude')}
                styles={textInputStyles}
              />
            </div>
            <div className={textFieldRow}>
              <FieldLabel className={textFieldLabelStyle}>{t('anchor.point.latitude')}</FieldLabel>
              <TextField
                disabled
                readOnly
                value={anchorPointCoordinates[1].toString()}
                className={textFieldStyle}
                ariaLabel={t('anchor.point.latitude')}
                styles={textInputStyles}
              />
            </div>
            <div className={textFieldRow}>
              <FieldLabel className={textFieldLabelStyle}>{t('anchor.point.angle')}</FieldLabel>
              <TextField
                disabled
                readOnly
                value={anchorPointAngle.toString()}
                className={textFieldStyle}
                ariaLabel={t('anchor.point.angle')}
                styles={textInputStyles}
              />
            </div>
          </div>
        )}
      </ColumnLayoutItem>
      <FillScreenContainer offsetBottom={120} offsetRight={20}>
        {({ height, width }) => <CheckedMap style={{ minHeight: height, minWidth: width }} />}
      </FillScreenContainer>
    </ColumnLayout>
  );
}

export default Georeference;
