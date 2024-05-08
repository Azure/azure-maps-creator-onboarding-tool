import { Map, control, layer, source } from 'azure-maps-control';
// import { indoor, control as indoorControl } from 'azure-maps-indoor';
import { getDomain, useConversionStore, useUserStore } from 'common/store';
import { useEffect, useMemo, useState } from 'react';
import LevelSelector from './level-selector';
import { calculateBoundingBox, getFillStyles, getLineStyles, getTextStyle, processZip } from './utils';

import 'azure-maps-control/dist/atlas.min.css';

const PlacesPreviewMap = ({ style }) => {
  const [geography, subscriptionKey] = useUserStore(s => [s.geography, s.subscriptionKey]);

  const [imdfPackageLocation] = useConversionStore(s => [s.imdfPackageLocation]);

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
            properties: { ...feature.properties, label: feature.properties.name.en },
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

      /*
			const levelControl = new indoorControl.LevelControl({ position: 'top-left', levelLabel: 'ordinal' })			
      const indoorManager = new indoor.IndoorManager(map, {
        style: 'blank',
        levelControl: levelControl,
      });

			map.controls.add([levelControl], {
				position: 'top-left',
			});		

			map.events.add('levelchanged', indoorManager, (eventData) => {

				//code that you want to run after a level has been changed
				console.log('The level has changed: ', eventData);
			});
			
			map.events.add('facilitychanged', indoorManager, (eventData) => {
			
				//code that you want to run after a facility has been changed
				console.log('The facility has changed: ', eventData);
			});
			*/
    });

    // Cleanup function to remove the map instance when component unmounts or reinitializes
    return () => {
      map.dispose();
    };
  }, [units, levels, selectedLevel, subscriptionKey, geography]);

  const handleLevelChange = levelId => {
    setSelectedLevelId(levelId);
  };

  return (
    <div>
      <LevelSelector
        selectedKey={selectedLevelId}
        onChange={handleLevelChange}
        options={levels.features.map(level => ({ key: level.id, text: level.properties.name.en }))}
      />
      <div id="azure-maps-container" style={{ width: '100%', height: '500px', ...style }} />
    </div>
  );
};

export default PlacesPreviewMap;
