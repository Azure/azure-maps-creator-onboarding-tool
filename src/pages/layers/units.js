import { MessageBar, MessageBarType } from '@fluentui/react';
import { useLayersStore } from 'common/store';
import PageDescription from 'components/page-description/page-description';
import FileField from 'pages/create-manifest/file-field';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import CategoryLayer from './categoryLayer';
import Layer from './layer';
import { dropdownStyles, layersContainer, layersWithPreview } from './layers.style';
import MappingToggle from './mappingToggle';
import Preview from './preview';
import Property from './property';

const layersSelector = s => [
  s.layers,
  s.updateLayer,
  s.setVisited,
  s.categoryMappingEnabled,
  s.categoryMapping,
  s.setCategoryMapping,
  s.categoryLayer,
];

export const Units = () => {
  const { t } = useTranslation();
  const [layers, updateLayer, setVisited, categoryMappingEnabled, categoryMapping, setCategoryMapping, categoryLayer] =
    useLayersStore(layersSelector, shallow);

  const { file, isMappingValid, message } = categoryMapping;

  useEffect(() => {
    // this page does not have any required fields, so the only requirement is to visit it once.
    setVisited();

    const { id: layerId, props = [{}] } = layers[0] || {};
    updateLayer(layerId, { name: 'unit', props: [{ ...props[0], name: 'name', isDraft: true }] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVisited]);

  const { id, props, value } = layers[0] || {};
  const property = props[0] || {};

  return (
    <>
      <PageDescription description={t('page.description.layers')} />
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
            isDraft={property.isDraft}
            readOnlyName
            isRequired
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
