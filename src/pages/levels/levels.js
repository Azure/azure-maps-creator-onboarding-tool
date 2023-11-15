import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { TextField } from '@fluentui/react';

import Level from './level';
import { useLevelsStore } from 'common/store';
import PageDescription from 'components/page-description/page-description';
import FieldLabel from 'components/field-label';
import FieldError from 'components/field-error';
import { fieldLabel, fieldsRow, fileContainer, inputClass, inputStyles } from './levels.style';

const levelsSelector = s => [s.levels, s.facilityName, s.setFacilityName, s.isLevelNameValid];

const Levels = () => {
  const { t } = useTranslation();
  const [levels, facilityName, setFacilityName, isLevelNameValid] = useLevelsStore(levelsSelector, shallow);

  const onFacilityNameChange = useCallback(
    e => {
      setFacilityName(e.target.value);
    },
    [setFacilityName]
  );
  const facilityNameErrorMsg = useMemo(() => {
    if (facilityName.length === 0 || isLevelNameValid(facilityName)) {
      return '';
    }
    return <FieldError text={t('error.invalid.facility.name')} />;
  }, [isLevelNameValid, facilityName, t]);

  return (
    <div>
      <PageDescription description={t('page.description.levels')} />
      <div className={fileContainer}>
        <div className={fieldsRow}>
          <div className={fieldLabel}>
            <FieldLabel>{t('facility.name')}</FieldLabel>
          </div>
          <TextField
            ariaLabel={t('facility.name')}
            onChange={onFacilityNameChange}
            styles={inputStyles}
            className={inputClass}
            value={facilityName}
            errorMessage={facilityNameErrorMsg}
          />
        </div>
      </div>
      {levels.map((level, id) => (
        <Level key={`${level.filename}${id}`} level={level} />
      ))}
    </div>
  );
};

export default Levels;
