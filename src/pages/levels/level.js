import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@fluentui/react';
import { shallow } from 'zustand/shallow';

import FieldLabel from 'components/field-label';
import { useLevelsStore, useProgressBarStore } from 'common/store';
import FieldError from 'components/field-error';

import { fieldLabel, fieldsRow, fileContainer, inputClass, inputStyles, readOnlyInput } from './levels.style';

const levelsSelector = (s) => [s.getOrdinalError, s.levels, s.setOrdinal, s.setLevelName, s.isLevelNameValid, s.setVerticalExtent, s.getVerticalExtentError, s.isOrdinalEmpty];
const progressBarSelector = (s) => s.isMissingDataErrorShown;

const Level = ({ level }) => {
  const { t } = useTranslation();
  const [getOrdinalError, levels, setOrdinal, setLevelName, isLevelNameValid, setVerticalExtent, getVerticalExtentError, isOrdinalEmpty] = useLevelsStore(levelsSelector, shallow);
  const isProgressBarErrorShown = useProgressBarStore(progressBarSelector);

  const onOrdinalChange = useCallback((e) => {
    setOrdinal(level.filename, e.target.value);
  }, [setOrdinal, level]);
  const onLevelNameChange = useCallback((e) => {
    setLevelName(level.filename, e.target.value);
  }, [setLevelName, level]);
  const onVerticalExtentChange = useCallback((e) => {
    setVerticalExtent(level.filename, e.target.value);
  }, [setVerticalExtent, level]);
  const verticalExtentErrorMsg = useMemo(() => {
    const verticalExtentError = getVerticalExtentError(level.verticalExtent);
    if (verticalExtentError === null) {
      return '';
    }
    return <FieldError text={t(verticalExtentError)} />;
  }, [getVerticalExtentError, level, t]);
  const ordinalErrorMsg = useMemo(() => {
    const ordinalError = getOrdinalError(level.ordinal);
    if (ordinalError === null) {
      if (isProgressBarErrorShown && isOrdinalEmpty(level.ordinal)) {
        return <FieldError text={t('error.field.is.required')} />;
      }
      return '';
    }
    return <FieldError text={t(ordinalError)} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels, isProgressBarErrorShown, level, getOrdinalError, t]);
  const levelNameErrorMsg = useMemo(() => {
    const isLevelNameEmpty = level.levelName.replace(/\s/g, '').length === 0;
    if (isLevelNameEmpty || isLevelNameValid(level.levelName)) {
      if (isLevelNameEmpty && isProgressBarErrorShown) {
        return <FieldError text={t('error.field.is.required')} />;
      }
      return '';
    }
    return <FieldError text={t('error.invalid.level.name')} />;
  }, [isLevelNameValid, level, t, isProgressBarErrorShown]);

  return (
    <div className={fileContainer}>
      <div className={fieldsRow}>
        <FieldLabel className={fieldLabel} required>{t('file.name')}</FieldLabel>
        <TextField readOnly styles={readOnlyInput} className={inputClass} disabled
                   value={level.filename} />
      </div>
      <div className={fieldsRow}>
        <div className={fieldLabel}>
          <FieldLabel required tooltip={t('tooltip.level.name')}>{t('level.name')}</FieldLabel>
        </div>
        <TextField ariaLabel={t('level.name.of.file', { filename: level.filename })}
                   onChange={onLevelNameChange} styles={inputStyles} className={inputClass}
                   value={level.levelName} errorMessage={levelNameErrorMsg} />
      </div>
      <div className={fieldsRow}>
        <div className={fieldLabel}>
          <FieldLabel tooltip={t('tooltip.ordinal')} required>{t('ordinal')}</FieldLabel>
        </div>
        <TextField className={inputClass} value={level.ordinal} onChange={onOrdinalChange}
                   ariaLabel={t('ordinal.of.file', { filename: level.filename })}
                   errorMessage={ordinalErrorMsg} styles={inputStyles} />
      </div>
      <div className={fieldsRow}>
        <div className={fieldLabel}>
          <FieldLabel tooltip={t('tooltip.vertical.extent')}>{t('vertical.extent')}</FieldLabel>
        </div>
        <TextField className={inputClass} value={level.verticalExtent} onChange={onVerticalExtentChange}
                   ariaLabel={t('vertical.extent.of.file', { filename: level.filename })}
                   errorMessage={verticalExtentErrorMsg} styles={inputStyles} />
      </div>
    </div>
  );
};

export default Level;