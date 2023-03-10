import { useMemo, useCallback } from 'react';
import { TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { Dropdown } from '@fluentui/react/lib/Dropdown';

import FieldLabel from 'components/field-label';
import { useGeometryStore, useLayersStore } from 'common/store';
import {
  container,
  dropdownStyles,
  textFieldColumn,
  textFieldLabelStyle,
  textFieldRow,
  textFieldStyle,
  textInputStyles,
} from './georeference.style';
import CheckedMap from './checked-map';
import MapError from './map-error';
import PageDescription from 'components/page-description/page-description';

const geometryStoreSelector = (s) => [s.dwgLayers, s.addDwgLayer, s.removeDwgLayer, s.anchorPoint.coordinates, s.anchorPoint.angle];
const layersSelector = (s) => s.polygonLayerNames;

function Georeference() {
  const { t } = useTranslation();
  const [dwgLayers, addDwgLayer, removeDwgLayer, anchorPointCoordinates, anchorPointAngle] = useGeometryStore(geometryStoreSelector, shallow);
  const polygonLayers = useLayersStore(layersSelector);

  const options = useMemo(() => {
    if (polygonLayers.length === 0) {
      return [{
        key: null,
        text: t('error.empty.dropdown'),
      }];
    }
    return polygonLayers.map((layer) => ({
      key: layer,
      text: layer,
    }));
  }, [t, polygonLayers]);

  const onExteriorLayersSelect = useCallback((e, item) => {
    if (polygonLayers.length === 0) {
      return;
    }
    const modifier = item.selected ? addDwgLayer : removeDwgLayer;
    modifier(item.text);
  }, [addDwgLayer, removeDwgLayer, polygonLayers]);

  return (
    <>
      <MapError />
      <PageDescription description={t('page.description.georeference')} />
      <div className={container}>
        <div className={textFieldColumn}>
          <div className={textFieldRow}>
            <FieldLabel className={textFieldLabelStyle}>{t('exterior')}</FieldLabel>
            <Dropdown placeholder={t('select.layers')} selectedKeys={dwgLayers} multiSelect={options.length !== 0}
                      onChange={onExteriorLayersSelect} options={options} styles={dropdownStyles} />
          </div>
          <div className={textFieldRow}>
            <FieldLabel className={textFieldLabelStyle}>{t('anchor.point.longitude')}</FieldLabel>
            <TextField disabled readOnly value={anchorPointCoordinates[0].toString()} className={textFieldStyle}
                       ariaLabel={t('anchor.point.longitude')} styles={textInputStyles} />
          </div>
          <div className={textFieldRow}>
            <FieldLabel className={textFieldLabelStyle}>{t('anchor.point.latitude')}</FieldLabel>
            <TextField disabled readOnly value={anchorPointCoordinates[1].toString()} className={textFieldStyle}
                       ariaLabel={t('anchor.point.latitude')} styles={textInputStyles} />
          </div>
          <div className={textFieldRow}>
            <FieldLabel className={textFieldLabelStyle}>{t('anchor.point.angle')}</FieldLabel>
            <TextField disabled readOnly value={anchorPointAngle.toString()} className={textFieldStyle}
                       ariaLabel={t('anchor.point.angle')} styles={textInputStyles} />
          </div>
        </div>
        <CheckedMap />
      </div>
    </>
  );
}

export default Georeference;