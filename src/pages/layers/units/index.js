import { useLayersStore } from 'common/store';
import { ColumnLayout, ColumnLayoutItem } from 'components/column-layout';
import DataEntryDivider from 'components/data-entry-divider';
import FillScreenContainer from 'components/fill-screen-container';
import PageDescription from 'components/page-description/page-description';
import MappingTable from 'pages/layers/units/mapping-table';
import { useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import CategoryLayer from '../categoryLayer';
import Layer from '../layer';
import PreviewMap from '../preview-map';
import Property from '../property';
import ActionDialog from './actions-dialog';
import DownloadMapping from './download-mapping';
import { tableActions } from './index.style';
import UploadMapping from './upload-mapping';

export const Units = () => {
  const { t } = useTranslation();
  const [layers, setVisited, uploadCategoryMapping, categoryLayer, textLayers] = useLayersStore(s => [
    s.layers,
    s.setVisited,
    s.uploadCategoryMapping,
    s.categoryLayer,
    s.textLayers,
  ]);

  const texts = useMemo(() => {
    return (
      textLayers
        .filter(t => t.name === categoryLayer)
        .flatMap(t => t?.textList?.map(t => t.value.toLowerCase().trim()))
        .filter(t => t !== undefined) || []
    );
  }, [categoryLayer, textLayers]);

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
        <DataEntryDivider />
        <div>{t('category.mapping.file')}</div>
        <CategoryLayer name={t('unit.category.layer')} value={categoryLayer} />
        <div className={tableActions}>
          <UploadMapping onFileSelect={uploadCategoryMapping} onError={msg => uploadCategoryMapping(null, msg)} />
          <DownloadMapping />
          <ActionDialog />
        </div>
        <FillScreenContainer style={{ overflowY: 'unset' }} offsetBottom={112} offsetRight={20}>
          {({ height }) => <MappingTable texts={texts} height={height} />}
        </FillScreenContainer>
      </ColumnLayoutItem>
      <FillScreenContainer style={{ overflowY: 'unset' }} offsetBottom={150} offsetRight={20}>
        {({ height, width }) => <PreviewMap height={Math.max(height, 512)} width={width} />}
      </FillScreenContainer>
    </ColumnLayout>
  );
};

export default Units;
