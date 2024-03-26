import { MessageBar, MessageBarType } from '@fluentui/react';
import { useLayersStore } from 'common/store';
import { useValidationStatus } from 'common/store/progress-bar-steps';
import { ColumnLayout, ColumnLayoutItem } from 'components/column-layout';
import FileField from 'components/file-field/file-field';
import FillScreenContainer from 'components/fill-screen-container';
import PageDescription from 'components/page-description/page-description';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import CategoryLayer from './categoryLayer';
import Layer from './layer';
import { dropdownStyles } from './layers.style';
import MappingToggle from './mappingToggle';
import Preview from './preview-map';
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
    useLayersStore(layersSelector);
  const { failed } = useValidationStatus();

  const { file, isMappingValid, message } = categoryMapping;

  useEffect(() => {
    setVisited();
  }, [setVisited]);

  const { id, props, value } = layers[0] || {};
  const property = props[0] || {};

  return (
    <ColumnLayout>
      <ColumnLayoutItem>
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
        <Layer
          id={id}
          name={t('unit.feature.layers')}
          tooltip={t('unit.feature.layers.tooltip')}
          props={[]}
          value={value}
          isDraft={false}
          readOnlyName
        />
        <Property
          id={property.id}
          name={t('unit.name.layers')}
          tooltip={t('unit.name.layers.tooltip')}
          value={property.value}
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
      </ColumnLayoutItem>
      <FillScreenContainer style={{ overflowY: 'unset' }} offsetBottom={150} offsetRight={20}>
        {({ height, width }) => <Preview height={height} width={width} />}
      </FillScreenContainer>
    </ColumnLayout>
  );
};

export default Units;
