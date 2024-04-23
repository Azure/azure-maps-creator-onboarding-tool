import { cx } from '@emotion/css';
import { Switch } from '@fluentui/react-components';
import { useLayersStore } from 'common/store';
import Dropdown, { selectAllId } from 'components/dropdown';
import { useFeatureFlags } from 'hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  dropdownContainer,
  inlineSelectContainer,
  previewDropdownStyles,
  previewTitle,
  previewTitleWrapper,
  selectContainer,
} from './index.style';

const MapFilters = props => {
  const { featureClasses, filters, setFilters } = props;
  const { displayMappedCategories, unselectedFeatureClasses, selectedDrawings } = filters;

  const { t } = useTranslation();
  const { isPlacesPreview } = useFeatureFlags();

  const [dwgLayers, categoryLayer] = useLayersStore(s => [s.dwgLayers, s.categoryLayer]);

  const setDisplayMappedCategories = value => setFilters(prev => ({ ...prev, displayMappedCategories: value }));
  const setUnselectedFeatureClasses = value => setFilters(prev => ({ ...prev, unselectedFeatureClasses: value }));
  const setSelectedDrawings = value => setFilters(prev => ({ ...prev, selectedDrawings: value }));

  const handleSwitchChange = () => setDisplayMappedCategories(!displayMappedCategories);

  const drawings = useMemo(() => Object.keys(dwgLayers), [dwgLayers]);

  const selectedDrawingsOptions = useMemo(() => {
    if (selectedDrawings.length !== Object.keys(dwgLayers).length) return selectedDrawings;
    return [selectAllId, ...selectedDrawings];
  }, [dwgLayers, selectedDrawings]);

  const selectedFeatureClassesNames = featureClasses
    .filter(fClass => !unselectedFeatureClasses.includes(fClass.id))
    .map(fClass => fClass.name);

  const selectedFeatureClassesIds = featureClasses
    .filter(fClass => !unselectedFeatureClasses.includes(fClass.id))
    .map(fClass => fClass.id);

  const selectedFeatureClassesOptions = useMemo(() => {
    if (selectedFeatureClassesIds.length !== featureClasses.length) {
      return selectedFeatureClassesIds;
    }
    return [selectAllId, ...selectedFeatureClassesIds];
  }, [featureClasses, selectedFeatureClassesIds]);

  const levelDropdownOptions = useMemo(() => {
    const options = drawings.map(drawing => ({
      key: drawing,
      text: drawing,
    }));
    if (options.length === 1) {
      return [options];
    }
    return [
      [
        {
          key: selectAllId,
          text: t('select.all'),
        },
      ],
      options,
    ];
  }, [drawings, t]);

  const featureClassDropdownOptions = useMemo(() => {
    if (featureClasses.length === 0) {
      return [
        [
          {
            key: null,
            text: t('error.empty.feature.class.dropdown'),
          },
        ],
      ];
    }
    const options = featureClasses.map(ffClass => ({
      key: ffClass.id,
      text: ffClass.name,
    }));
    if (options.length === 1) {
      return [options];
    }
    return [
      [
        {
          key: selectAllId,
          text: t('select.all'),
        },
      ],
      options,
    ];
  }, [featureClasses, t]);

  const onLayerDropdownChange = (e, item) => {
    if (featureClasses.length === 0) {
      return;
    }
    if (item.optionValue === selectAllId) {
      if (item.selectedOptions.includes(selectAllId)) {
        setUnselectedFeatureClasses([]);
      } else {
        setUnselectedFeatureClasses(featureClasses.map(fClass => fClass.id));
      }
    } else {
      setUnselectedFeatureClasses(
        featureClasses.filter(fClass => !item.selectedOptions.includes(fClass.id)).map(fClass => fClass.id)
      );
    }
  };

  const onLevelsDropdownChange = (e, item) => {
    if (item.optionValue === selectAllId) {
      if (item.selectedOptions.includes(selectAllId)) {
        setSelectedDrawings(Object.keys(dwgLayers));
      } else {
        setSelectedDrawings([]);
      }
    } else {
      setSelectedDrawings(item.selectedOptions.filter(option => option !== selectAllId));
    }
  };

  return (
    <div>
      <div className={previewTitleWrapper}>
        <span className={previewTitle}>Preview</span>
      </div>

      <div className={dropdownContainer}>
        <div className={cx(selectContainer, { [inlineSelectContainer]: isPlacesPreview })}>
          <div>Level</div>
          <Dropdown
            onOptionSelect={onLevelsDropdownChange}
            className={previewDropdownStyles}
            optionGroups={levelDropdownOptions}
            multiselect
            selectedOptions={selectedDrawingsOptions}
          >
            {selectedDrawings.length ? selectedDrawings.join(', ') : t('select.levels.preview')}
          </Dropdown>
        </div>
        {isPlacesPreview ? (
          categoryLayer && (
            <Switch label={`IMDF mapping preview`} checked={displayMappedCategories} onChange={handleSwitchChange} />
          )
        ) : (
          <div className={selectContainer}>
            <div>Feature Class</div>
            <Dropdown
              onOptionSelect={onLayerDropdownChange}
              className={previewDropdownStyles}
              selectedOptions={selectedFeatureClassesOptions}
              optionGroups={featureClassDropdownOptions}
              multiselect={featureClasses.length !== 0}
            >
              {selectedFeatureClassesNames.length
                ? selectedFeatureClassesNames.join(', ')
                : t('select.feature.class.preview')}
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapFilters;
