import { Map, layer, source, control, HtmlMarker } from 'azure-maps-control';
import { control as draw_control, drawing } from 'azure-maps-drawing-tools';
import { getDomain, useConversionStore, useLevelsStore, useUserStore } from 'common/store';
import { useEffect, useMemo, useState, useRef } from 'react';
import { imdfPreviewMap, imdfPreviewMapWrapper, layerSelect, textWrapper, mapTextWrapper, buttonStyle, idk } from './indes.style';
import LevelSelector from './level-selector';
import LayerSelector from './layer-selector';
import MapNotification from './map-notification';
import { calculateBoundingBox, getFeatureLabel, getFillStyles, getLineStyles, getTextStyle, processZip } from './utils';
import { currentEditData, groupAndSort, drawingModeChanged, updateLevels, setFields, deleteUnitPrevEdits, grabAndGrabbing, grabToPointer, updateSelectedColor } from './imdf-model-helpers';
import { JsonEditor } from 'json-edit-react'
import { SlActionUndo } from 'react-icons/sl';
import 'azure-maps-drawing-tools/dist/atlas-drawing.min.css';
import 'azure-maps-control/dist/atlas.min.css';


const PlacesPreviewMap = ({ style, unitsChanged, levelsChanged, footprintChanged, buildingChanged }) => {
  const [geography, subscriptionKey] = useUserStore(s => [s.geography, s.subscriptionKey]);
  const [imdfPackageLocation] = useConversionStore(s => [s.imdfPackageLocation]);
  const [language] = useLevelsStore(s => [s.language]);

  const [units, setUnits] = useState({ features: [], type: 'FeatureCollection' });
  const [levels, setLevels] = useState({ features: [] });
  const [building, setBuilding] = useState({ features: [] });
  const [footprint, setFootprint] = useState({ features: [] });

  const [jsonData, setJsonData] = useState({});
  const newDataRef = useRef(false);
  // const [copyData, setCopyData] = useState({});

  const [prevStates, setPrevStates] = useState([]); // Tracking previous changes for Undo feature

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
        setBuilding(buildingFile.content);
        setFootprint(footprintFile.content);
      }
    });
  }, [imdfPackageLocation]);

  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [drawNotif, setDrawNotif] = useState(false); // Triggers drawing tip if true

  const selectedLevel = useMemo(() => {
    const level = levels.features.find(item => item.id === selectedLevelId) || levels.features[0] || {};
    setSelectedLevelId(level.id);
    return level;
  }, [levels, selectedLevelId]);

  useEffect(() => {
    var drawingManager;

    const map = new Map('azure-maps-container', {
      bounds: calculateBoundingBox(levels),
      subscriptionKey: subscriptionKey,
      language: 'en-US', 
      domain: getDomain(geography),
      staticAssetsDomain: getDomain(geography),
      style: 'dark',
    });

    map.controls.add([new control.ZoomControl()], {
      position: 'top-right',
    });

    map.events.add('ready', () => {
      var drawingToolbar;
      setJsonData({});

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
      } else if(selectedLayerId === 'buildingButton') {
        buildingInteractions(building, map);
      } else {
        fullViewInteractions(units, levels, map);
      }

      if(selectedLayerId !== 'buildingButton') {
        var layers = drawingManager.getLayers();
        map.events.add('mousedown', layers.polygonLayer, handleDeletion);
        map.events.add('touchstart', layers.polygonLayer, handleDeletion);
        map.events.add('click', layers.polygonLayer, handleDeletion);
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
      else if(selectedLayerId === 'buildingButton') {

      }
      else
        features = map.layers.getRenderedShapes(e.position, ['unitClick', 'levelClick']);

      if(selectedLayerId !== 'buildingButton') {
        features.forEach(function (feature) {
            const newData = feature.data || {};
            setJsonData(newData);
        }); 
      }
    });

    grabAndGrabbing(map);

    if(prevStates.length < 2) {
      document.getElementById('undoButton').disabled = true; 
    }
    else {
      document.getElementById('undoButton').disabled = false;
    }

    // Shows change in corresponding feature color when mouse hovers over OR clicks on that feature
    let selectedFeatureID = null;
    function featureHoverClick(layerName, hoverLayer, clickLayer, unitSelected=false) {
      grabToPointer(layerName, hoverLayer, map);

      map.events.add('click', layerName, function (e) {
        const clickedFeatureID = e.shapes[0].getProperties()['_azureMapsShapeId'];
        map.getCanvas().style.cursor = 'pointer';

        if (selectedFeatureID !== clickedFeatureID) {
          // If feature is clicked, change color of feature
          selectedFeatureID = clickedFeatureID;
          clickLayer.setOptions({
              filter: ['==', ['get', '_azureMapsShapeId'], clickedFeatureID]
          });
          
          // Handles the change in color of the feature when clicked (for full view)
          updateSelectedColor(map, unitSelected)

          var features;
          if(selectedLayerId === 'unitButton')
            features = map.layers.getRenderedShapes(e.position, 'unitClick');
          else if(selectedLayerId === 'levelButton')
            features = map.layers.getRenderedShapes(e.position, 'levelFill');
          else if(selectedLayerId === 'footprintButton')
            features = map.layers.getRenderedShapes(e.position, 'footprintClick');
          else
            features = map.layers.getRenderedShapes(e.position, ['unitClick', 'levelClick']);
    
          features.forEach(function (feature) {
              const newData = feature.data || {};
              setJsonData(newData);
          }); 
        }
        else {
          // If feature clicked is currently chosen OR it is another feature, change color of feature back to original
          selectedFeatureID = null;
          clickLayer.setOptions({
            filter: ['==', ['get', '_azureMapsShapeId'], '']
          });
          setJsonData({});
        }
      });
    }

    function handleDeletion(e) {
      let window_msg = 'Do you want to proceed with removing feature '
      let feature_name = `${e.shapes[0].data.properties.name.en}`;
      if (drawingManager.getOptions().mode === 'erase-geometry') {
        if (window.confirm(window_msg + feature_name + '?')) {
            drawingManager.getSource().remove(e.shapes[0]);
        } 
      }
    }
 
    // Entry point when "unit.geojson" is pressed; the following code should be refactored due to redundancy
    function unitInteractions(units, drawingManager, map) {  
      // Update the units state with the edited features (for updating zip)
      let element = document.getElementById('undoButton');
      element.removeAttribute('hidden');
      unitsChanged(units);

      var unitLayer, unitLines, polygonHoverLayer, polygonClickLayer, unitSymbols;  
      var layersAdded = [unitLayer, unitLines, polygonHoverLayer, polygonClickLayer, unitSymbols]; 
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
          fillColor: 'rgba(135, 206, 250, 0.8)', 
          filter: ['==', ['get', 'id'], ''],
          cursor: 'pointer !important', 
        }); 

        polygonClickLayer = new layer.PolygonLayer(dataSource, 'unitClickChange', { 
          fillColor: 'rgba(75, 146, 210, 0.8)', 
          filter: ['==', ['get', 'id'], ''] ,
          cursor: 'pointer !important',
        }); 

        unitSymbols = new layer.SymbolLayer(dataSource, null, getTextStyle(category)); 
        map.layers.add([unitLayer, polygonHoverLayer, unitLines, polygonClickLayer, unitSymbols], 'roomPolygons'); 
        featureHoverClick(unitLayer, polygonHoverLayer, polygonClickLayer, true); 

        var drawingSource = drawingManager.getSource(); 
        drawingSource.add(features); 

        let dmLayers = drawingManager.getLayers(); 
        dmLayers.polygonLayer.setOptions({ visible: false }); 
        dmLayers.polygonOutlineLayer.setOptions({ visible: false }); 
        layersAdded = [unitLayer, unitLines, polygonHoverLayer, polygonClickLayer, unitSymbols]; 

        // Saving previous states for undo functionality
        if(prevStates.length === 0 || JSON.stringify(units.features) !== JSON.stringify(prevStates[prevStates.length - 1].features)) {
          setPrevStates(prev => [...prev, {...units}]);
        }
   
        map.events.add('drawingmodechanged', drawingManager, (e) => { 
          let dmLayers = drawingManager.getLayers(); 
          layersAdded = [unitLayer, unitLines, polygonHoverLayer, polygonClickLayer, unitSymbols]; 

          if (e === 'idle') { 
            let element = document.getElementById('undoButton');
            element.removeAttribute('hidden');
            setDrawNotif(false);
            let updatedFeatures = drawingManager.getSource().shapes; 

            deleteUnitPrevEdits(units, selectedLevel);

            const newFeatures = updatedFeatures.reduce((acc, feature) => {
              if (isNaN(feature.data.properties.ordinal)) {
                  setFields(feature, selectedLevel);
                  acc.push(feature.data); 
              }
              return acc;
            }, []);

            setUnits(prevUnits => ({
              features: [...prevUnits.features, ...newFeatures],
            }));
          } 
          else if (e === 'edit-geometry' || e === 'erase-geometry' || e === 'draw-polygon') {       
            drawingModeChanged(layersAdded);  
            dmLayers.polygonLayer.setOptions({ visible: true }); 
            dmLayers.polygonOutlineLayer.setOptions({ visible: true }); 
            
            let element = document.getElementById('undoButton');
            element.setAttribute('hidden', 'hidden');
          

            if(e === 'draw-polygon') {
              setDrawNotif(true);
              map.events.add('mousedown', function (e) {
                map.getCanvas().style.cursor = 'crosshair';
              });
          
              map.events.add('mouseup', function (e) {
                map.getCanvas().style.cursor = 'crosshair';
              });
            }
            if(e === 'edit-geometry') {
              currentEditData(map, drawingManager, setJsonData);
            }
          } 
          else { 
            // This will eventually be a visible pop-up 
            console.log('Not a valid drawing toolbar option.'); 
          } 
        });    
      }); 
    } 

    // Entry point when "level.geojson" is pressed; the following code should be refactored due to redundancy
    function levelInteractions(levels, drawingManager, map) {
      let element = document.getElementById('undoButton');
      element.setAttribute('hidden', 'hidden');
      // Retrieve information about the level currently chosen by user
      levelsChanged(levels);
      const selectedLevelDetails = levels.features.filter(item => item.id === selectedLevel.id);
      var lineLayer, lineHoverLayer, lineClickLayer, linePolygonLayer;
      var layersAdded = [lineLayer, lineHoverLayer, lineClickLayer, linePolygonLayer];

      const dataSource = new source.DataSource();
      map.sources.add(dataSource);
      dataSource.add(selectedLevelDetails);
      
      // Displays outline of level + change in color when cursor is hovering
      lineLayer = new layer.LineLayer(dataSource, 'levelClick', getLineStyles('level', 'walkway'));
      linePolygonLayer = new layer.PolygonLayer(dataSource, 'levelFill', getFillStyles('level', 'unspecified'));
      lineHoverLayer = new layer.PolygonLayer(dataSource, null, {
        fillColor: 'rgba(135, 206, 250, 0.8)',
        filter: ['==', ['get', '_azureMapsShapeId'], '']
      });

      lineClickLayer = new layer.PolygonLayer(dataSource, 'lineClickLayer', { 
        fillColor: 'rgba(75, 146, 210, 0.8)', 
        filter: ['==', ['get', 'id'], ''] 
      }); 
    
      map.layers.add([lineLayer, linePolygonLayer, lineHoverLayer, lineClickLayer], 'walkwayPolygons');
      layersAdded = [lineLayer, lineHoverLayer, lineClickLayer, linePolygonLayer];
      featureHoverClick(linePolygonLayer, lineHoverLayer, lineClickLayer);

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
          linePolygonLayer = new layer.PolygonLayer(drawingManager.getSource(), 'levelFill', getFillStyles('level', 'unspecified'));
          lineHoverLayer = new layer.PolygonLayer(drawingManager.getSource(), null, {
            fillColor: 'rgba(135, 206, 250, 0.8)',
            filter: ['==', ['get', '_azureMapsShapeId'], '']
          });
    
          lineClickLayer = new layer.PolygonLayer(drawingManager.getSource(), 'lineClickLayer', { 
            fillColor: 'rgba(75, 146, 210, 0.8)', 
            filter: ['==', ['get', 'id'], ''] 
          }); 
        
          map.layers.add([lineLayer, lineHoverLayer, lineClickLayer, linePolygonLayer], 'walkwayPolygons');
          layersAdded = [lineLayer, lineHoverLayer, lineClickLayer, linePolygonLayer];
          featureHoverClick(linePolygonLayer, lineHoverLayer, lineClickLayer);

          let updatedFeatures = drawingManager.getSource().shapes;
          setLevels(prevLevels => updateLevels(prevLevels, selectedLevel, (updatedFeatures[0]).data));

          // Update the levels state with the edited features (for updating zip)
          levelsChanged(levels);
        }
        else if (e === 'edit-geometry') {    
          drawingModeChanged(layersAdded);  
          dmLayers.polygonOutlineLayer.setOptions({ visible: true });
          dmLayers.polygonLayer.setOptions({ visible: true });

          currentEditData(map, drawingManager, setJsonData);

          document.addEventListener('keydown', function (e) {
            // Check if the delete or backspace key is pressed
            if (e.key === 'Delete' || e.key === 'Backspace') {
              drawingManager.setOptions({ mode: 'idle' });
            }
        });
        }
        else {
          // This will eventually be a visible pop-up
          console.log('Not a valid drawing toolbar option.');
        }
      });
    }

    // Entry point when "footprint.geojson" is pressed; the following code should be refactored due to redundancy
    function footprintInteractions(footprint, drawingManager, map) {
      let element = document.getElementById('undoButton');
      element.setAttribute('hidden', 'hidden');

      footprintChanged(footprint);
      var footprintLayer, footprintLines, footprintHoverLayer, footprintClickLayer; 
      var layersAdded = [footprintLayer, footprintLines, footprintHoverLayer, footprintClickLayer];

      const groupedFeatures = {};
      const keys = Object.keys(groupedFeatures);

      const dataSource = new source.DataSource();
      map.sources.add(dataSource);
      dataSource.add(footprint);

      // Displays outline of footprint + change in color when cursor is hovering
      footprintLines = new layer.LineLayer(dataSource, null, getLineStyles('footprint', 'walkway'));
      footprintLayer = new layer.PolygonLayer(dataSource, 'footprintClick', getFillStyles('footprint', keys.category));
      footprintHoverLayer = new layer.PolygonLayer(dataSource, null, {
        fillColor: 'rgba(135, 206, 250, 0.8)',
        filter: ['==', ['get', '_azureMapsShapeId'], '']
      });

      footprintClickLayer = new layer.PolygonLayer(dataSource, null, { 
        fillColor: 'rgba(75, 146, 210, 0.8)', 
        filter: ['==', ['get', 'id'], ''] 
      }); 

      map.layers.add([footprintLayer, footprintHoverLayer, footprintLines, footprintClickLayer], 'roomPolygons');
      featureHoverClick(footprintLayer, footprintHoverLayer, footprintClickLayer);
      layersAdded = [footprintLayer, footprintLines, footprintHoverLayer, footprintClickLayer];

      
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
            fillColor: 'rgba(135, 206, 250, 0.8)',
            filter: ['==', ['get', '_azureMapsShapeId'], '']
          });
          footprintClickLayer = new layer.PolygonLayer(drawingManager.getSource(), null, { 
            fillColor: 'rgba(75, 146, 210, 0.8)', 
            filter: ['==', ['get', 'id'], ''] 
          }); 

          map.layers.add([footprintLayer, footprintHoverLayer, footprintLines, footprintClickLayer], 'roomPolygons');
          featureHoverClick(footprintLayer, footprintHoverLayer, footprintClickLayer);
          layersAdded = [footprintLayer, footprintLines, footprintHoverLayer, footprintClickLayer];

          let updatedFeatures = drawingManager.getSource().shapes;
          footprint.features[0] = updatedFeatures[0].data;

          // Update the footprint state with the edited features (for updating zip)
          footprintChanged(footprint);
        }
        else if (e === 'edit-geometry') {    
          drawingModeChanged(layersAdded);  
          dmLayers.polygonLayer.setOptions({ visible: true });
          dmLayers.polygonOutlineLayer.setOptions({ visible: true });

          currentEditData(map, drawingManager, setJsonData);
        }
        else {
          // This will eventually be a visible pop-up
          console.log('Not a valid drawing toolbar option.');
        }
      });
    }

    function buildingInteractions(building, map) {
      let element = document.getElementById('undoButton');
      element.setAttribute('hidden', 'hidden');
      
      var buildingLayer = new HtmlMarker({ 
        position: building.features[0].properties.display_point.coordinates, 
      });
      map.events.add('click', buildingLayer, highlight);
      map.markers.add(buildingLayer);

      function highlight(e) {
        setJsonData(building.features[0]);
      }

      map.setCamera({
        zoom: 12
      });
    }

    // Entry point when "full view" is pressed; the following code may need to be changed to allow fill color of units while editing
    function fullViewInteractions(units, levels, map) {
      unitsChanged(units);
      levelsChanged(levels);

      var unitLayer, unitLines, polygonHoverLayer, polygonClickLayer, unitSymbols, lineLayer, lineHoverLayer, lineClickLayer;  
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
          fillColor: 'rgba(135, 206, 250, 0.8)', 
          filter: ['==', ['get', 'id'], ''],
          cursor: 'pointer !important', 
        }); 

        polygonClickLayer = new layer.PolygonLayer(dataSource, 'unitClickChange', { 
          fillColor: 'rgba(75, 146, 210, 0.8)', 
          filter: ['==', ['get', 'id'], ''] ,
          cursor: 'pointer !important',
        }); 

        unitSymbols = new layer.SymbolLayer(dataSource, null, getTextStyle(category)); 
        map.layers.add([unitLayer, polygonHoverLayer, unitLines, polygonClickLayer, unitSymbols], 'roomPolygons'); 
        featureHoverClick(unitLayer, polygonHoverLayer, polygonClickLayer, true); 
      });

      const selectedLevelDetails = levels.features.filter(item => item.id === selectedLevel.id);
      const dataSource = new source.DataSource();
      map.sources.add(dataSource);
      dataSource.add(selectedLevelDetails);
      
      // Displays outline of level + change in color when cursor is hovering
      lineLayer = new layer.LineLayer(dataSource, 'levelClick', getLineStyles('level', 'walkway'));
      lineHoverLayer = new layer.LineLayer(dataSource, null, {
        strokeColor: 'rgba(135, 206, 250, 0.8)',
        filter: ['==', ['get', '_azureMapsShapeId'], '']
      });
      lineClickLayer = new layer.LineLayer(dataSource, 'lineClickLayer', { 
        strokeColor: 'rgba(75, 146, 210, 0.8)', 
        filter: ['==', ['get', 'id'], ''] 
      }); 

      map.layers.add([lineLayer, lineHoverLayer, lineClickLayer], 'walkwayPolygons');
      featureHoverClick(lineLayer, lineHoverLayer, lineClickLayer, false);
    }

    // Cleanup function to remove the map instance when component unmounts or reinitializes
    return () => {
      map.dispose();
    };
  }, [ units, levels, footprint, building, selectedLevel, selectedLayerId, subscriptionKey, geography, language, imdfPackageLocation, unitsChanged, levelsChanged, footprintChanged, prevStates ]);

  const handleLevelChange = levelId => {
    setSelectedLevelId(levelId);
  }

  const handleLayerChange = layerId => {
    setSelectedLayerId(layerId);
  };

  const updateJsonData = (newData) => {
    setJsonData(newData);
  };

  // Handles updates when a property is changed in the JSON editor
  const handleUpdate = ({ newData, currentData, newValue, currentValue, name, path }) => {
    if(newData.feature_type === 'building') {
      // Building
      building.features = [newData];
      buildingChanged(building);
    }
    else if (newData.properties.name && isNaN(newData.properties.ordinal)) { 
      // Unit
      let editedIndex = units.features.findIndex(unit => unit.id === currentData.id);
      if (editedIndex !== -1) {
        // Replace the old data with the new data for specific feature, then save to zip
        const updatedFeatures = [...units.features];
        updatedFeatures[editedIndex] = {
          ...newData,
          properties: {
            ...newData.properties,
            label: newData.properties.name.en,
          },
        };

        setUnits({ features: updatedFeatures }); // To update state to trigger map refresh
        unitsChanged(units); // To update zip
        newDataRef.current = true;
      }
      else {
        console.log('Invalid property change.');
      }
    } 
    else if (newData.properties.name) { 
      // Level
      let editedIndex = levels.features.findIndex(level => level.id === currentData.id);
      if (editedIndex !== -1) {
        // Replace the old data with the new data for specific feature, then save to zip
        levels.features[editedIndex] = newData;
        levelsChanged(levels);
      }
      else {
        console.log('Invalid property change.');
      }
    }
    
    return true;
  };

  // Triggered when Undo button is pressed 
  const handleUndo = () => { 
    if (prevStates.length > 0) { 
      // Get the last state
      const newArray = prevStates.slice(0, -1);
      setPrevStates(newArray); // Update the prevStates state
      
      const lastState = newArray[newArray.length - 1]; 
      
      // Revert to the last state
      units.features = [...lastState.features];
      setUnits(prevUnits => ({ 
        features: [...lastState.features], 
      })); 
    } 
  }; 

  useEffect(() => {
    // Perform actions based on the updated state
  }, [prevStates]);
  
  

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

          <div className={idk}><button id="undoButton" onClick={handleUndo} className={buttonStyle}><SlActionUndo/></button></div>

          <MapNotification>Zoom in to see labels and icons.</MapNotification>
          {drawNotif && <MapNotification>Click to draw a point. To connect the final lines of current drawing, press 'c'.</MapNotification>}
          <div id="azure-maps-container" className={imdfPreviewMap} style={style}/>

        </div>

        <div id="panel" className={textWrapper} style={{ maxHeight: '30rem', overflowY: 'auto' }}>
          <JsonEditor 
            data={jsonData}          
            setData={updateJsonData} 
            rootName="" 
            showCollectionCount={false}
            restrictDelete={true}
            restrictAdd={true}
            restrictEdit={({ path }) => {
              const allowedFields = [
                'properties.name.en',
                'properties.category'
              ];
              return !allowedFields.includes(path.join('.'));
            }}
            restrictTypeSelection={ ({ path, value }) => {
              if (typeof value === 'string') 
                return ['string'];
              else
                return ['string', 'number', 'boolean', 'array', 'object'];
            }}
            rootFontSize={12}
            indent={2}
            theme="githubLight"
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>  
  );
};

export default PlacesPreviewMap;
