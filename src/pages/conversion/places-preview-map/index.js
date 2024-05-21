import { Map, control, layer, source } from 'azure-maps-control';
import { getDomain, useConversionStore, useLevelsStore, useUserStore } from 'common/store';
import { useEffect, useMemo, useState } from 'react';
import LevelSelector from './level-selector';
import { calculateBoundingBox, getFeatureLabel, getFillStyles, getLineStyles, getTextStyle, processZip } from './utils';

import 'azure-maps-control/dist/atlas.min.css';

const PlacesPreviewMap = ({ style }) => {
  const [geography, subscriptionKey] = useUserStore(s => [s.geography, s.subscriptionKey]);
  const [imdfPackageLocation] = useConversionStore(s => [s.imdfPackageLocation]);
  const [language] = useLevelsStore(s => [s.language]);

  const [units, setUnits] = useState({ features: [] });
  const [levels, setLevels] = useState({ features: [] });

  useEffect(() => {
    if (!imdfPackageLocation) return;

    processZip(imdfPackageLocation).then(files => {
      const unitFile = files.find(file => file.filename === 'unit.geojson');
      const levelFile = files.find(file => file.filename === 'level.geojson');

      if (unitFile && levelFile) {
        setUnits(unitFile.content);
        setLevels(levelFile.content);
      }
    });
  }, [imdfPackageLocation]);

  const [selectedLevelId, setSelectedLevelId] = useState(null);

  const selectedLevel = useMemo(() => {
    const level = levels.features.find(item => item.id === selectedLevelId) || levels.features[0] || {};
    setSelectedLevelId(level.id);

    return level;
  }, [levels, selectedLevelId]);

  useEffect(() => {
    const map = new Map('azure-maps-container', {
      bounds: calculateBoundingBox(levels),
      subscriptionKey: subscriptionKey,
      language: 'en-US',
      domain: getDomain(geography),
      staticAssetsDomain: getDomain(geography),
      style: 'blank',
    });

    map.controls.add([new control.ZoomControl()], {
      position: 'top-right',
    });

    map.events.add('ready', () => {
      const groupedFeatures = {};
      units.features
        .filter(item => item.properties.level_id === selectedLevel.id)
        .forEach(feature => {
          const { category } = feature.properties;
          if (!groupedFeatures[category]) groupedFeatures[category] = { features: [] };
          groupedFeatures[category].features.push({
            ...feature,
            properties: { ...feature.properties, label: getFeatureLabel(feature, language) },
          });
        });

      const keys = Object.keys(groupedFeatures);

      keys.forEach(category => {
        const features = groupedFeatures[category].features;

        const dataSource = new source.DataSource();
        map.sources.add(dataSource);
        dataSource.add(features);

        map.layers.add(new layer.PolygonLayer(dataSource, null, getFillStyles('unit', category)), 'roomPolygons');
        map.layers.add(new layer.LineLayer(dataSource, null, getLineStyles('unit', category)), 'roomLines');
      });

      const dataSource = new source.DataSource();
      map.sources.add(dataSource);
      dataSource.add(levels);
      map.layers.add(new layer.LineLayer(dataSource, null, getLineStyles('level', 'walkway')), 'walkwayPolygons');

      keys.forEach(category => {
        const features = groupedFeatures[category].features;
        const dataSource = new source.DataSource();
        map.sources.add(dataSource);
        dataSource.add(features);
        map.layers.add(new layer.SymbolLayer(dataSource, null, getTextStyle(category)), 'roomLabels');
      });
    });

    // Cleanup function to remove the map instance when component unmounts or reinitializes
    return () => {
      map.dispose();
    };
  }, [units, levels, selectedLevel, subscriptionKey, geography, language]);

  const handleLevelChange = levelId => {
    setSelectedLevelId(levelId);
  };

  return (
    <div>
      <LevelSelector
        selectedKey={selectedLevelId}
        onChange={handleLevelChange}
        options={levels.features.map(level => ({ key: level.id, text: getFeatureLabel(level, language) }))}
      />
      <div id="azure-maps-container" style={{ width: '100%', height: '500px', ...style }} />
    </div>
  );
};

export default PlacesPreviewMap;
