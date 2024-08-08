import { Map, layer, source, control } from 'azure-maps-control';
import { control as draw_control, drawing } from 'azure-maps-drawing-tools';
import { getDomain, useConversionStore, useLevelsStore, useUserStore } from 'common/store';
import { useEffect, useMemo, useState } from 'react';
import { imdfPreviewMap, imdfPreviewMapWrapper, layerSelect, textWrapper, textArea, mapTextWrapper, saveButtonWrapper } from './indes.style';
import LevelSelector from './level-selector';
import LayerSelector from './layer-selector';
import MapNotification from './map-notification';
import { calculateBoundingBox, getFeatureLabel, getFillStyles, getLineStyles, getTextStyle, processZip } from './utils';
import { currentEditData, groupAndSort, drawingModeChanged, writeToInfoPanel, grabToPointer, updateLevels, setFields, deleteUnitPrevEdits } from './imdf-model-helpers';
// import { JsonEditor } from 'json-edit-react'
import { DownloadEditsButton } from './download-edits-button';
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
      var drawingToolbar;
      document.getElementById('infoPanel-json').value = '';
      if(selectedLayerId === 'unitButton') {
        drawingToolbar = new draw_control.DrawingToolbar({ 
          position: 'bottom-right', 
          style: 'light', 
          buttons: ['edit-geometry', 'erase-geometry', 'draw-polygon'] 
        });  
        drawingManager = new drawing.DrawingManager(map, {
          toolbar: drawingToolbar
        });

        unitInteractions(units, drawingManager, map);
      } else if(selectedLayerId === 'levelButton') {  
          drawingToolbar = new draw_control.DrawingToolbar({ 
            position: 'bottom-right', 
            style: 'light', 
            buttons: ['edit-geometry'] 
          });   
          drawingManager = new drawing.DrawingManager(map, {
            toolbar: drawingToolbar
          });
          
          levelInteractions(levels, drawingManager, map);
      } else if(selectedLayerId === 'footprintButton') {
        drawingToolbar = new draw_control.DrawingToolbar({ 
          position: 'bottom-right', 
          style: 'light', 
          buttons: ['edit-geometry'] 
        });   

        drawingManager = new drawing.DrawingManager(map, {
          toolbar: drawingToolbar
        });

        footprintInteractions(footprint, drawingManager, map);
      } else {
        drawingToolbar = new draw_control.DrawingToolbar({ 
          position: 'bottom-right', 
          style: 'light', 
          buttons: ['edit-geometry'] 
        });   

        drawingManager = new drawing.DrawingManager(map, {
          toolbar: drawingToolbar
        });

        fullViewInteractions(units, levels, drawingManager, map);
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
      var unitLayer, unitLines, polygonHoverLayer, unitSymbols;  
      var layersAdded = [unitLayer, unitLines, polygonHoverLayer, unitSymbols]; 
      const groupedFeatures = groupAndSort(units, language, selectedLevel); 
      const keys = Object.keys(groupedFeatures); 

      keys.forEach(category => { 
        var features = groupedFeatures[category].features; 
        const dataSource = new source.DataSource(); 
        map.sources.add(dataSource); 
        dataSource.add(features); 

        unitLayer = new layer.PolygonLayer(dataSource, 'unitClick', getFillStyles('unit', category)); 
        unitLines = new layer.LineLayer(dataSource, null, getLineStyles('unit', category)); 
        polygonHoverLayer = new layer.PolygonLayer(dataSource, null, { 
          fillColor: 'rgba(150, 50, 255, 0.2)', 
          filter: ['==', ['get', 'id'], ''] 
        }); 

        unitSymbols = new layer.SymbolLayer(dataSource, null, getTextStyle(category)); 
        map.layers.add([unitLayer, polygonHoverLayer, unitLines, unitSymbols], 'roomPolygons'); 
        grabToPointer([unitLayer, polygonHoverLayer], map); 
        featureHover(unitLayer, polygonHoverLayer); 

        var drawingSource = drawingManager.getSource(); 
        drawingSource.add(features); 

        let dmLayers = drawingManager.getLayers(); 
        dmLayers.polygonLayer.setOptions({ visible: false }); 
        dmLayers.polygonOutlineLayer.setOptions({ visible: false }); 
        layersAdded = [unitLayer, unitLines, polygonHoverLayer, unitSymbols]; 
   
        map.events.add('drawingmodechanged', drawingManager, (e) => { 
          let dmLayers = drawingManager.getLayers(); 
          layersAdded = [unitLayer, unitLines, polygonHoverLayer, unitSymbols]; 

          if (e === 'idle') { 
            let updatedFeatures = drawingManager.getSource().shapes; 

            deleteUnitPrevEdits(units, selectedLevel);
            updatedFeatures.forEach((feature, index) => { 
              if(isNaN(feature.data.properties.ordinal)) {
                setFields(feature, selectedLevel);
                units.features.push(feature.data);
              }
            });

            dmLayers.polygonLayer.setOptions({ visible: false }); 
            dmLayers.polygonOutlineLayer.setOptions({ visible: false }); 
            map.layers.remove([unitLayer, unitLines, polygonHoverLayer]); 

            unitLayer = new layer.PolygonLayer(drawingManager.getSource(), 'unitClick', getFillStyles('unit', category)); 
            unitLines = new layer.LineLayer(drawingManager.getSource(), null, getLineStyles('unit', category)); 
            polygonHoverLayer = new layer.PolygonLayer(drawingManager.getSource(), null, { 
              fillColor: 'rgba(150, 50, 255, 0.2)', 
              filter: ['==', ['get', 'id'], ''] 
            }); 
            unitSymbols = new layer.SymbolLayer(drawingManager.getSource(), null, getTextStyle(category)); 

            map.layers.add([unitLayer, polygonHoverLayer, unitLines, unitSymbols], 'roomPolygons'); 
            grabToPointer([unitLayer, polygonHoverLayer], map); 
            featureHover(unitLayer, polygonHoverLayer); 
            layersAdded = [unitLayer, unitLines, polygonHoverLayer, unitSymbols];  
          } 
          else if (e === 'edit-geometry' || e === 'erase-geometry' || e === 'draw-polygon') {       
            drawingModeChanged(layersAdded);  
            dmLayers.polygonLayer.setOptions({ visible: true }); 
            dmLayers.polygonOutlineLayer.setOptions({ visible: true }); 
          } 
          else { 
            // This will eventually be a visible pop-up 
            console.log('Not a valid drawing toolbar option.'); 
          } 

        });    
        currentEditData(map, drawingManager); 
      }); 
    } 

    // Entry point when "level.geojson" is pressed; the following code should be refactored due to redundancy
    function levelInteractions(levels, drawingManager, map) {
      // Retrieve information about the level currently chosen by user
      const selectedLevelDetails = levels.features.filter(item => item.id === selectedLevel.id);
      var lineLayer, lineHoverLayer;
      var layersAdded = [lineLayer, lineHoverLayer];

      const dataSource = new source.DataSource();
      map.sources.add(dataSource);
      dataSource.add(selectedLevelDetails);
      
      // Displays outline of level + change in color when cursor is hovering
      lineLayer = new layer.LineLayer(dataSource, 'levelClick', getLineStyles('level', 'walkway'));
      lineHoverLayer = new layer.LineLayer(dataSource, null, {
        fillColor: 'rgba(150, 50, 255, 0.2)',
        filter: ['==', ['get', '_azureMapsShapeId'], '']
      });

      map.layers.add([lineLayer, lineHoverLayer], 'walkwayPolygons');
      grabToPointer([lineLayer, lineHoverLayer], map);
      layersAdded = [lineLayer, lineHoverLayer];
      featureHover(lineLayer, lineHoverLayer);

      var drawingSource = drawingManager.getSource();
      drawingSource.add(selectedLevelDetails);

      let dmLayers = drawingManager.getLayers();
      dmLayers.polygonLayer.setOptions({ visible: false });
      dmLayers.polygonOutlineLayer.setOptions({visible: false});

      map.events.add('drawingmodechanged', drawingManager, (e) => {
        let dmLayers = drawingManager.getLayers();
        if (e === 'idle') {
          dmLayers.polygonLayer.setOptions({ visible: false });
          dmLayers.polygonOutlineLayer.setOptions({ visible: false });

          var lineLayer = new layer.LineLayer(drawingManager.getSource(), 'levelClick', getLineStyles('level', 'walkway'));
          lineHoverLayer = new layer.LineLayer(drawingManager.getSource(), null, {
            fillColor: 'rgba(150, 50, 255, 0.2)',
            filter: ['==', ['get', '_azureMapsShapeId'], '']
          });

          map.layers.add([lineLayer, lineHoverLayer], 'walkwayPolygons');
          grabToPointer([lineLayer, lineHoverLayer], map);
          layersAdded = [lineLayer, lineHoverLayer];
          featureHover(lineLayer, lineHoverLayer);

          let updatedFeatures = drawingManager.getSource().shapes;

          setLevels(prevLevels => updateLevels(prevLevels, selectedLevel, (updatedFeatures[0]).data));
        }
        else if (e === 'edit-geometry' || e === 'erase-geometry' || e === 'draw-polygon') {    
          drawingModeChanged(layersAdded);  
          dmLayers.polygonOutlineLayer.setOptions({ visible: true });
          dmLayers.polygonLayer.setOptions({ visible: false });
        }
        else {
          // This will eventually be a visible pop-up
          console.log('Not a valid drawing toolbar option.');
        }
      });
      
      currentEditData(map, drawingManager);
    }

    // Entry point when "footprint.geojson" is pressed; the following code should be refactored due to redundancy
    function footprintInteractions(footprint, drawingManager, map) {
      var footprintLayer, footprintLines, footprintHoverLayer; 
      var layersAdded = [footprintLayer, footprintLines, footprintHoverLayer];

      const groupedFeatures = {};
      const keys = Object.keys(groupedFeatures);

      const dataSource = new source.DataSource();
      map.sources.add(dataSource);
      dataSource.add(footprint);

      // Displays outline of footprint + change in color when cursor is hovering
      footprintLines = new layer.LineLayer(dataSource, null, getLineStyles('footprint', 'walkway'));
      footprintLayer = new layer.PolygonLayer(dataSource, 'footprintClick', getFillStyles('footprint', keys.category));
      footprintHoverLayer = new layer.PolygonLayer(dataSource, null, {
        fillColor: 'rgba(150, 50, 255, 0.2)',
        filter: ['==', ['get', '_azureMapsShapeId'], '']
      });

      map.layers.add([footprintLayer, footprintHoverLayer, footprintLines], 'roomPolygons');
      grabToPointer([footprintLayer, footprintHoverLayer], map);
      featureHover(footprintLayer, footprintHoverLayer);
      layersAdded = [footprintLayer, footprintLines, footprintHoverLayer];

      
      var drawingSource = drawingManager.getSource();
      drawingSource.add(footprint);

      let dmLayers = drawingManager.getLayers();
      dmLayers.polygonLayer.setOptions({ visible: false });
      dmLayers.polygonOutlineLayer.setOptions({visible: false});

      map.events.add('drawingmodechanged', drawingManager, (e) => {
        let dmLayers = drawingManager.getLayers();
        if (e === 'idle') {
          dmLayers.polygonLayer.setOptions({ visible: false });
          dmLayers.polygonOutlineLayer.setOptions({ visible: false });

          footprintLines = new layer.LineLayer(drawingManager.getSource(), null, getLineStyles('footprint', 'walkway'));
          footprintLayer = new layer.PolygonLayer(drawingManager.getSource(), 'footprintClick', getFillStyles('footprint', keys.category));
          footprintHoverLayer = new layer.PolygonLayer(drawingManager.getSource(), null, {
            fillColor: 'rgba(150, 50, 255, 0.2)',
            filter: ['==', ['get', '_azureMapsShapeId'], '']
          });

          map.layers.add([footprintLayer, footprintHoverLayer, footprintLines], 'roomPolygons');
          grabToPointer([footprintLayer, footprintHoverLayer], map);
          featureHover(footprintLayer, footprintHoverLayer);
          layersAdded = [footprintLayer, footprintLines, footprintHoverLayer];

          let updatedFeatures = drawingManager.getSource().shapes;
          footprint.features[0] = updatedFeatures[0].data;
        }
        else if (e === 'edit-geometry' || e === 'erase-geometry' || e === 'draw-polygon') {    
          drawingModeChanged(layersAdded);  
          dmLayers.polygonLayer.setOptions({ visible: true });
          dmLayers.polygonOutlineLayer.setOptions({ visible: true });
        }
        else {
          // This will eventually be a visible pop-up
          console.log('Not a valid drawing toolbar option.');
        }
      });
      
      currentEditData(map, drawingManager);
    }

    // Entry point when "full view" is pressed; the following code may need to be changed to allow fill color of units while editing
    function fullViewInteractions(units, levels, drawingManager, map) {
      levelInteractions(levels, drawingManager, map);
      unitInteractions(units, drawingManager, map);
    }

    // Cleanup function to remove the map instance when component unmounts or reinitializes
    return () => {
      map.dispose();
    };
  }, [units, levels, footprint, selectedLevel, selectedLayerId, subscriptionKey, geography, language, imdfPackageLocation]);

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
        <DownloadEditsButton imdfPackageLocation={imdfPackageLocation} units={units} levels={levels} footprint={footprint} />
      </div>
    </div>  
  );
};

export default PlacesPreviewMap;
