import { Map, control, layer, source } from 'azure-maps-control';
import {control as draw_control, drawing} from 'azure-maps-drawing-tools';
import { getDomain, useConversionStore, useLevelsStore, useUserStore } from 'common/store';
import { useEffect, useMemo, useState } from 'react';
import { DefaultButton } from '@fluentui/react';
import { logsButton } from '../style';
import { imdfPreviewMap, imdfPreviewMapWrapper, layerSelect, textWrapper, textArea, mapTextWrapper, saveButtonWrapper } from './indes.style';
import LevelSelector from './level-selector';
import LayerSelector from './layer-selector';
import MapNotification from './map-notification';
import { calculateBoundingBox, getFeatureLabel, getFillStyles, getLineStyles, getTextStyle, processZip } from './utils';
import { currentEditData, groupAndSort, drawingModeChanged, writeToInfoPanel, grabToPointer } from './imdf-model-helpers';
import 'azure-maps-drawing-tools/dist/atlas-drawing.min.css';
import 'azure-maps-control/dist/atlas.min.css';

const PlacesPreviewMap = ({ style }) => {
  const [geography, subscriptionKey] = useUserStore(s => [s.geography, s.subscriptionKey]);
  const [imdfPackageLocation] = useConversionStore(s => [s.imdfPackageLocation]);
  const [language] = useLevelsStore(s => [s.language]);

  const [units, setUnits] = useState({ features: [] });
  const [levels, setLevels] = useState({ features: [] });

  // const [building, setBuilding] = useState({ features: [] }); // building will be used eventually
  const [footprint, setFootprint] = useState({ features: [] });

  useEffect(() => {
    if (!imdfPackageLocation) return;

    processZip(imdfPackageLocation).then(files => {
      const unitFile = files.find(file => file.filename === 'unit.geojson');
      const levelFile = files.find(file => file.filename === 'level.geojson');
      const buildingFile = files.find(file => file.filename === 'building.geojson');
      const footprintFile = files.find(file => file.filename === 'footprint.geojson');

      if (unitFile && levelFile && buildingFile && footprintFile) {
        setUnits(unitFile.content);
        setLevels(levelFile.content);
        // setBuilding(buildingFile.content);
        setFootprint(footprintFile.content);
      }
    });
  }, [imdfPackageLocation]);

  const [selectedLevelId, setSelectedLevelId] = useState(null);

  const selectedLevel = useMemo(() => {
    const level = levels.features.find(item => item.id === selectedLevelId) || levels.features[0] || {};
    setSelectedLevelId(level.id);
    return level;
  }, [levels, selectedLevelId]);

  const [selectedLayerId, setSelectedLayerId] = useState(null);

  useEffect(() => {
    var drawingManager;
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
      var drawingToolbar = new draw_control.DrawingToolbar({ 
        position: 'bottom-right', 
        style: 'light', 
        buttons: ['edit-geometry', 'erase-geometry', 'draw-polygon'] 
      });    

      if(selectedLayerId === 'unitButton') {
        drawingManager = new drawing.DrawingManager(map, {
          toolbar: drawingToolbar
        });
        unitInteractions(units, drawingManager, map);
      } else if(selectedLayerId === 'levelButton') {
        // Retrieve information about the level currently chosen by user
        const selectedLevelDetails = levels.features.filter(item => item.id === selectedLevel.id);

        const dataSource = new source.DataSource();
        map.sources.add(dataSource);
        dataSource.add(selectedLevelDetails);
        
        // Displays outline of level + change in color when cursor is hovering
        var lineLayer = new layer.LineLayer(dataSource, 'levelClick', getLineStyles('level', 'walkway'));
        var lineHoverLayer = new layer.LineLayer(dataSource, null, {
          fillColor: 'rgba(150, 50, 255, 0.2)',
          filter: ['==', ['get', '_azureMapsShapeId'], '']
        });

        map.layers.add([lineLayer, lineHoverLayer], 'walkwayPolygons');
        grabToPointer([lineLayer, lineHoverLayer], map);
        featureHover(lineLayer, lineHoverLayer);
      } else if(selectedLayerId === 'footprintButton') {
        const groupedFeatures = {};
        const keys = Object.keys(groupedFeatures);

        const dataSource = new source.DataSource();
        map.sources.add(dataSource);
        dataSource.add(footprint);

        // Displays outline of footprint + change in color when cursor is hovering
        var footprintLines = new layer.LineLayer(dataSource, null, getLineStyles('footprint', 'walkway'));
        var footprintLayer = new layer.PolygonLayer(dataSource, 'footprintClick', getFillStyles('footprint', keys.category));
        var footprintHoverLayer = new layer.PolygonLayer(dataSource, null, {
          fillColor: 'rgba(150, 50, 255, 0.2)',
          filter: ['==', ['get', '_azureMapsShapeId'], '']
        });

        map.layers.add([footprintLayer, footprintHoverLayer, footprintLines], 'roomPolygons');
        grabToPointer([footprintLayer, footprintHoverLayer], map);
        featureHover(footprintLayer, footprintHoverLayer);
      } else {
        // Displays levels + units
        const groupedFeatures = groupAndSort(units, language, selectedLevel);
        const keys = Object.keys(groupedFeatures); 

        keys.forEach(category => {
          const features = groupedFeatures[category].features;

          const dataSource = new source.DataSource();
          map.sources.add(dataSource);
          dataSource.add(features);

          // Displays outline of unit(s), the fill color of unit(s), + change in color when cursor is hovering
          var unitLayer = new layer.PolygonLayer(dataSource, 'unitClick', getFillStyles('unit', category));
          var unitLines = new layer.LineLayer(dataSource, null, getLineStyles('unit', category));
          var polygonHoverLayer = new layer.PolygonLayer(dataSource, null, {
            fillColor: 'rgba(150, 50, 255, 0.2)',
            filter: ['==', ['get', '_azureMapsShapeId'], '']
          });

          map.layers.add([unitLayer, polygonHoverLayer, unitLines], 'roomPolygons');
          map.layers.add(new layer.SymbolLayer(dataSource, null, getTextStyle(category)), 'roomLabels');
          grabToPointer([unitLayer, polygonHoverLayer], map);
          featureHover(unitLayer, polygonHoverLayer);
        });

        // Level display information below
        const dataSource = new source.DataSource();
        map.sources.add(dataSource);
        dataSource.add(levels);

        lineLayer = new layer.LineLayer(dataSource, 'levelClick', getLineStyles('level', 'walkway'));
        lineHoverLayer = new layer.LineLayer(dataSource, null, {
          fillColor: 'rgba(150, 50, 255, 0.2)',
          filter: ['==', ['get', '_azureMapsShapeId'], '']
        });

        map.layers.add([lineLayer, lineHoverLayer], 'walkwayPolygons');
        grabToPointer([lineLayer, lineHoverLayer], map);
        featureHover(lineLayer, lineHoverLayer);
      }
    });

    // Recognizes which layer button is clicked and sets features data to display accordingly
    map.events.add('click', function(e){
      var features;
      if(selectedLayerId === 'unitButton')
        features = map.layers.getRenderedShapes(e.position, 'unitClick');
      else if(selectedLayerId === 'levelButton')
        features = map.layers.getRenderedShapes(e.position, 'levelClick');
      else if(selectedLayerId === 'footprintButton')
        features = map.layers.getRenderedShapes(e.position, 'footprintClick');
      else
        features = map.layers.getRenderedShapes(e.position, ['unitClick', 'levelClick']);

      features.forEach(function (feature) {
          writeToInfoPanel(feature.data);
      }); 
    });

    // Shows change in corresponding feature color when mouse hovers over that feature
    function featureHover(layerName, polygonHoverLayer) {
      map.events.add('mousemove', layerName, function (e) {
        polygonHoverLayer.setOptions({ filter: ['==', ['get', '_azureMapsShapeId'], e.shapes[0].getProperties()['_azureMapsShapeId']] });
      });

      map.events.add('mouseleave', layerName, function (e) {
          polygonHoverLayer.setOptions({ filter: ['==', ['get', '_azureMapsShapeId'], ''] });
      });
    }

    // Entry point when "unit.geojson" is pressed; the following code should be refactored due to redundancy
    function unitInteractions(units, drawingManager, map) { 
      var unitLayer, unitLines, polygonHoverLayer; 
      var layersAdded = [unitLayer, unitLines, polygonHoverLayer];
      const groupedFeatures = groupAndSort(units, language, selectedLevel);
      const keys = Object.keys(groupedFeatures);
        
      keys.forEach(category => {
        const features = groupedFeatures[category].features;
  
        const dataSource = new source.DataSource();
        map.sources.add(dataSource);
        dataSource.add(features);
  
        unitLayer = new layer.PolygonLayer(dataSource, 'unitClick', getFillStyles('unit', category));
        unitLines = new layer.LineLayer(dataSource, null, getLineStyles('unit', category));
        polygonHoverLayer = new layer.PolygonLayer(dataSource, null, {
          fillColor: 'rgba(150, 50, 255, 0.2)',
          filter: ['==', ['get', 'id'], '']
        });
  
        map.layers.add([unitLayer, polygonHoverLayer, unitLines], 'roomPolygons');
  
        grabToPointer([unitLayer, polygonHoverLayer], map);
        featureHover(unitLayer, polygonHoverLayer);
  
        map.layers.add(new layer.SymbolLayer(dataSource, null, getTextStyle(category)), 'roomLabels');
  
        var drawingSource = drawingManager.getSource();
        drawingSource.add(features);
  
        var dmLayers = drawingManager.getLayers();
        dmLayers.polygonLayer.setOptions({ visible: false });
        dmLayers.polygonOutlineLayer.setOptions({ visible: false });
  
        map.events.add('drawingmodechanged', drawingManager, (e) => {
          var dmLayers = drawingManager.getLayers();
          layersAdded = [unitLayer, unitLines, polygonHoverLayer];
  
          if (e === 'idle') {
            dmLayers.polygonLayer.setOptions({ visible: false });
            dmLayers.polygonOutlineLayer.setOptions({ visible: false });
            map.layers.remove([unitLayer, unitLines, polygonHoverLayer]);
  
            unitLayer = new layer.PolygonLayer(drawingManager.getSource(), 'unitClick', getFillStyles('unit', category));
            unitLines = new layer.LineLayer(drawingManager.getSource(), null, getLineStyles('unit', category));
            polygonHoverLayer = new layer.PolygonLayer(drawingManager.getSource(), null, {
              fillColor: 'rgba(150, 50, 255, 0.2)',
              filter: ['==', ['get', 'id'], '']
            });
  
            map.layers.add([unitLayer, polygonHoverLayer, unitLines], 'roomPolygons');
  
            grabToPointer([unitLayer, polygonHoverLayer], map);
            featureHover(unitLayer, polygonHoverLayer);
            layersAdded = [unitLayer, unitLines, polygonHoverLayer];
          }
          else if (e === 'edit-geometry' || e === 'erase-geometry' || e === 'draw-polygon') {      
            drawingModeChanged(layersAdded); 
            dmLayers.polygonLayer.setOptions({ visible: true });
            dmLayers.polygonOutlineLayer.setOptions({ visible: true });
          }
        });   
  
        currentEditData(map, drawingManager);
      });
    }

    // Cleanup function to remove the map instance when component unmounts or reinitializes
    return () => {
      map.dispose();
    };
  }, [units, levels, footprint, selectedLevel, selectedLayerId, subscriptionKey, geography, language]);

  const handleLevelChange = levelId => {
    setSelectedLevelId(levelId);
  };

  const handleLayerChange = layerId => {
    setSelectedLayerId(layerId);
  };

  return (
    <div>
      <div className={mapTextWrapper}>
        <div className={imdfPreviewMapWrapper}>
          <LevelSelector
            selectedKey={selectedLevelId}
            onChange={handleLevelChange}
            options={levels.features.map(level => ({ key: level.id, text: getFeatureLabel(level, language) }))}
          />

          <div className={layerSelect}>
            <LayerSelector
              selectedKey={selectedLayerId}
              onChange={handleLayerChange}
            />
          </div>

          <MapNotification>Zoom in to see labels and icons.</MapNotification>
          <div id="azure-maps-container" className={imdfPreviewMap} style={style}/>
        </div>

        <div id="panel" className={textWrapper}>
          <textarea id="infoPanel-json" className={textArea}></textarea>
        </div>

      </div>

      <div className={saveButtonWrapper}>
        <DefaultButton className={logsButton}>Save Changes</DefaultButton>
      </div>
      
    </div>
  );
};

export default PlacesPreviewMap;
