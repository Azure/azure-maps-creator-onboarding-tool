import { TextField } from '@fluentui/react';
import { languages, languagesList } from 'common/languages';
import { useLevelsStore, useProgressBarStore } from 'common/store';
import Dropdown from 'components/dropdown';
import FieldError from 'components/field-error';
import FieldLabel from 'components/field-label';
import PageDescription from 'components/page-description/page-description';
import { useFeatureFlags } from 'hooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Level from './level';
import { dropdownInputClass, fieldLabel, fieldsRow, fileContainer, inputClass, inputStyles } from './levels.style';

const levelsSelector = s => [
  s.levels,
  s.facilityName,
  s.setFacilityName,
  s.isLevelNameValid,
  s.language,
  s.setLanguage,
];
const progressBarSelector = s => s.isMissingDataErrorShown;

const mappedLanguages = languagesList.map(lang => ({ key: lang.code, text: lang.name }));

const Levels = () => {
  const { t } = useTranslation();
  const isProgressBarErrorShown = useProgressBarStore(progressBarSelector);
  const [levels, facilityName, setFacilityName, isLevelNameValid, language, setLanguage] =
    useLevelsStore(levelsSelector);
  const { isPlacesPreview } = useFeatureFlags();

  const onFacilityNameChange = useCallback(
    e => {
      setFacilityName(e.target.value);
    },
    [setFacilityName]
  );

  const facilityNameErrorMsg = useMemo(() => {
    if (!isProgressBarErrorShown) return '';
    const isFacilityNameEmpty = facilityName.replace(/\s/g, '').length === 0;
    if (isPlacesPreview && isFacilityNameEmpty) {
      return <FieldError text={t('error.field.is.required')} />;
    }
    if (isFacilityNameEmpty || isLevelNameValid(facilityName)) {
      return '';
    }
    return <FieldError text={isPlacesPreview ? t('error.invalid.building.name') : t('error.invalid.facility.name')} />;
  }, [isLevelNameValid, facilityName, t, isPlacesPreview, isProgressBarErrorShown]);

  const handleLanguageChange = useCallback(
    (e, item) => {
      setLanguage(item.optionValue);
    },
    [setLanguage]
  );

  const labelName = isPlacesPreview ? t('building.name') : t('facility.name');
  const labelTooltip = isPlacesPreview ? t('building.name.tooltip') : t('facility.name.tooltip');

  return (
    <div>
      <PageDescription description={t('page.description.levels')} />

      <div className={fileContainer}>
        {isPlacesPreview && (
          <div className={fieldsRow}>
            <div className={fieldLabel}>
              <FieldLabel tooltip={t('language.tooltip')}>{t('language')}</FieldLabel>
            </div>
            <Dropdown
              onOptionSelect={handleLanguageChange}
              showFilter
              options={mappedLanguages}
              selectedKey={language}
              className={dropdownInputClass}
            >
              {languages[language]}
            </Dropdown>
          </div>
        )}
        <div className={fieldsRow}>
          <div className={fieldLabel}>
            <FieldLabel required={isPlacesPreview} tooltip={labelTooltip}>
              {labelName}
            </FieldLabel>
          </div>
          <TextField
            ariaLabel={labelName}
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
