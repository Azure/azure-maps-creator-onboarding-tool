import { TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import FieldLabel from 'components/field-label';
import { useGeometryStore } from 'common/store';
import {
  container,
  textFieldColumn,
  textFieldLabelStyle,
  textFieldRow,
  textFieldStyle,
  textInputStyles,
} from './georeference.style';
import CheckedMap from './checked-map';
import MapError from './map-error';

const anchorPointSelector = (s) => [s.anchorPoint.coordinates, s.anchorPoint.angle];

function Georeference() {
  const { t } = useTranslation();
  const [anchorPointCoordinates, anchorPointAngle] = useGeometryStore(anchorPointSelector, shallow);

  return (
    <>
      <MapError />
      <div className={container}>
        <div className={textFieldColumn}>
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