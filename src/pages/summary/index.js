import { cx } from '@emotion/css';
import { Icon } from '@fluentui/react';
import { languages } from 'common/languages';
import { useGeometryStore, useLayersStore, useLevelsStore, useReviewManifestStore } from 'common/store';
import { color } from 'common/styles';
import { defaultIcon, failedIcon, successIcon } from 'pages/conversion/style';
import CheckedMap from 'pages/georeference/checked-map';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import {
  entryCell,
  layerPill,
  sectionTitle,
  summaryColumn,
  summaryEntry,
  summaryEntryTitle,
  summaryMap,
  summaryMapWrapper,
  summaryPanel,
  summaryRow,
} from './summary.style';

const reviewManifestSelector = s => s.setManifestReviewed;
const levelsSelector = s => [s.levels, s.facilityName, s.language];
const geometryStoreSelector = s => [s.dwgLayers];
const layersSelector = s => [s.layers, s.categoryMappingEnabled, s.categoryLayer, s.categoryMapping];

const MappingIcon = props => {
  const { isMappingValid, message } = props;

  if (message && isMappingValid) {
    return <Icon iconName="SkypeCircleCheck" className={successIcon} />;
  }
  if (message && !isMappingValid) {
    return <Icon iconName="StatusErrorFull" className={failedIcon} />;
  }
  return <Icon iconName="StatusCircleBlock" className={defaultIcon} />;
};

const SummaryEntry = props => {
  const { title, children } = props;

  return (
    <div className={summaryEntry}>
      <span className={summaryEntryTitle}>{title}</span>
      <span className={entryCell}>{children}</span>
    </div>
  );
};

const NotProvidedEntry = props => {
  return (
    <>
      <MappingIcon />
      <i style={{ color: color.granite }}>Not provided</i>
    </>
  );
};

const SummaryTab = () => {
  const { t } = useTranslation();
  const setManifestReviewed = useReviewManifestStore(reviewManifestSelector);
  const [levels, facilityName, language] = useLevelsStore(levelsSelector, shallow);
  const [dwgLayers] = useGeometryStore(geometryStoreSelector, shallow);
  const [layers, categoryMappingEnabled, categoryLayer, categoryMapping] = useLayersStore(layersSelector, shallow);

  const { isMappingValid, message } = categoryMapping;

  const { props, value } = layers[0] || {};

  useEffect(() => {
    setManifestReviewed(true);
  }, [setManifestReviewed]);

  return (
    <div className={summaryRow}>
      <div className={summaryColumn}>
        <div className={summaryPanel}>
          <div className={sectionTitle}>General</div>
          <SummaryEntry title="Language">{languages[language]}</SummaryEntry>
          <SummaryEntry title={t('building.name')}>{facilityName || <NotProvidedEntry />}</SummaryEntry>
        </div>
        <div className={summaryPanel}>
          <div className={sectionTitle}>Drawing Files</div>
          <table>
            <tbody>
              <tr>
                <th className={entryCell} style={{ fontWeight: 500 }}>
                  Filename
                </th>
                <th className={entryCell} style={{ fontWeight: 500 }}>
                  Ordinal
                </th>
                <th className={entryCell} style={{ fontWeight: 500 }}>
                  Name
                </th>
              </tr>
              {levels.map((level, id) => (
                <tr key={`${level.filename}${id}`}>
                  <td className={entryCell}>{level.filename}</td>
                  <td className={entryCell}>{level.ordinal}</td>
                  <td className={entryCell}>{level.levelName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={summaryPanel}>
          <div className={sectionTitle}>Selected Layers</div>
          <SummaryEntry title={t('exterior')}>
            {dwgLayers.map(layer => (
              <span key={layer} className={layerPill}>
                {layer}
              </span>
            ))}
          </SummaryEntry>
          <SummaryEntry title={t('unit.feature.layers')}>
            {value.map(layer => (
              <span key={layer} className={layerPill}>
                {layer}
              </span>
            ))}
          </SummaryEntry>
          <SummaryEntry title={t('unit.name.layers')}>
            {props[0]?.value?.map(layer => (
              <span key={layer} className={layerPill}>
                {layer}
              </span>
            ))}
          </SummaryEntry>
          {categoryMappingEnabled && (
            <SummaryEntry title={t('unit.category.layer')}>
              {categoryLayer && <span className={layerPill}>{categoryLayer}</span>}
            </SummaryEntry>
          )}
        </div>
        {categoryMappingEnabled && (
          <div className={summaryPanel}>
            <div className={sectionTitle}>Additional Data</div>
            <SummaryEntry title={t('category.mapping.file')}>
              <span className={entryCell} style={{ display: 'flex' }}>
                <MappingIcon isMappingValid={isMappingValid} message={message} />
                <span>{message ?? <i style={{ color: color.granite }}>Not provided</i>}</span>
              </span>
            </SummaryEntry>
          </div>
        )}
      </div>
      <div className={cx(summaryColumn, summaryMapWrapper)}>
        <div className={sectionTitle}>Georeference</div>
        <CheckedMap className={summaryMap} readOnly />
      </div>
    </div>
  );
};

export default SummaryTab;
