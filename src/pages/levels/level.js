import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@fluentui/react';
import { shallow } from 'zustand/shallow';

import FieldLabel from 'components/field-label';
import { useLevelsStore } from 'common/store';
import FieldError from 'components/field-error';

import { fieldLabel, fieldsRow, fileContainer, inputClass, inputStyles } from './levels.style';

const selector = (s) => [s.getOrdinalError, s.levels, s.setOrdinal, s.setLevelName, s.isLevelNameValid];

const Level = ({ level }) => {
  const { t } = useTranslation();
  const [getOrdinalError, levels, setOrdinal, setLevelName, isLevelNameValid] = useLevelsStore(selector, shallow);

  const onOrdinalChange = useCallback((e) => {
    setOrdinal(level.filename, e.target.value);
  }, [setOrdinal, level]);
  const onLevelNameChange = useCallback((e) => {
    setLevelName(level.filename, e.target.value);
  }, [setLevelName, level]);
  const ordinalErrorMsg = useMemo(() => {
    const ordinalError = getOrdinalError(level.ordinal);
    if (ordinalError === null) {
      return '';
    }
    return <FieldError text={t(ordinalError)} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels]);
  const levelNameErrorMsg = useMemo(() => {
    if (level.levelName.length === 0 || isLevelNameValid(level.levelName)) {
      return '';
    }
    return <FieldError text={t('error.invalid.level.name')} />;
  }, [isLevelNameValid, level, t]);

  return (
    <div className={fileContainer}>
      <div className={fieldsRow}>
        <FieldLabel className={fieldLabel} required>{t('file.name')}</FieldLabel>
        <TextField readOnly styles={inputStyles} className={inputClass} disabled
                   value={level.filename} />
      </div>
      <div className={fieldsRow}>
        <FieldLabel className={fieldLabel} required>{t('level.name')}</FieldLabel>
        <TextField ariaLabel={t('level.name.of.file', { filename: level.filename })}
                   onChange={onLevelNameChange} styles={inputStyles} className={inputClass}
                   value={level.levelName} errorMessage={levelNameErrorMsg} />
      </div>
      <div className={fieldsRow}>
        <FieldLabel className={fieldLabel} required>{t('ordinal')}</FieldLabel>
        <TextField className={inputClass} value={level.ordinal} onChange={onOrdinalChange}
                   ariaLabel={t('ordinal.of.file', { filename: level.filename })}
                   errorMessage={ordinalErrorMsg} styles={inputStyles} />
      </div>
    </div>
  );
};

export default Level;