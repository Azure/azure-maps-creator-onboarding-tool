import { MessageBar, MessageBarType } from '@fluentui/react';
import { useLayersStore } from 'common/store';
import { useValidationStatus } from 'common/store/progress-bar-steps';
import FileField from 'components/file-field/file-field';
import PageDescription from 'components/page-description/page-description';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import CategoryLayer from './categoryLayer';
import Layer from './layer';
import { dropdownStyles, layersContainer, layersWithPreview } from './layers.style';
import MappingToggle from './mappingToggle';
import Preview from './preview';
import Property from './property';

const layersSelector = s => [
  s.layers,
  s.setVisited,
  s.categoryMappingEnabled,
  s.categoryMapping,
  s.setCategoryMapping,
  s.categoryLayer,
];

export const Units = () => {
  const { t } = useTranslation();
  const [layers, setVisited, categoryMappingEnabled, categoryMapping, setCategoryMapping, categoryLayer] =
    useLayersStore(layersSelector, shallow);
  const { failed } = useValidationStatus();

  const { file, isMappingValid, message } = categoryMapping;

  useEffect(() => {
    setVisited();
  }, [setVisited]);

  const { id, props, value } = layers[0] || {};
  const property = props[0] || {};

  return (
    <>
      <PageDescription
        description={
          <Trans i18nKey="welcome_message">
            {t('page.description.units')}
            <a
              href="https://register.apple.com/resources/imdf/reference/categories#unit"
              target="_blank"
              rel="noreferrer"
            >
              {/* This will replace <1></1> in the translation */}
            </a>
          </Trans>
        }
      />
      <div className={layersWithPreview}>
        <div className={layersContainer}>
          <Layer
            id={id}
            name={t('unit.feature.layers')}
            props={[]}
            value={value}
            isDraft={false}
            readOnlyName
            isRequired
          />
          <Property
            name={t('unit.name.layers')}
            value={property.value}
            id={property.id}
            parentId={id}
            isDraft={false}
            readOnlyName
          />
          <MappingToggle />
          {categoryMappingEnabled && (
            <div>
              <CategoryLayer name={t('unit.category.layer')} value={categoryLayer} />
              <FileField
                fieldClassName={dropdownStyles}
                file={file}
                label={t('category.mapping.file')}
                id="imdf-category-mapping"
                onFileSelect={setCategoryMapping}
                fileType="csv"
                onError={msg => setCategoryMapping(null, msg)}
                tooltip="A CSV file that contains IMDF category mapping in key value pairs."
                showError={failed}
                errorMessage={() => !file && t('error.field.is.required')}
                required
                allowClear
              />
              {message && (
                <div style={{ marginBottom: '1rem' }}>
                  <MessageBar messageBarType={isMappingValid ? MessageBarType.success : MessageBarType.error}>
                    {message}
                  </MessageBar>
                </div>
              )}
            </div>
          )}
        </div>
        <Preview />
      </div>
    </>
  );
};

export default Units;
