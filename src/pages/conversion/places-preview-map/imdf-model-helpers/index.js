import { getFeatureLabel } from '../utils';

// Sets polygon, line, and symbol layers to invisible
function drawingModeChanged(allLayers) {
    allLayers.forEach(layer => {
        layer.setOptions({ visible:  false });
    });
}

// Displays information of a feature that is being drawn/edited, at time of click
function currentEditData(map, drawingManager, setJsonData) {
    map.events.add('drawingstarted', drawingManager, (f) => {
        if(f?.data) {
            var shapeId = f.data.id;
            var geojsonData = drawingManager.getSource().getShapeById(shapeId).data;
            setJsonData(geojsonData);
        }
    });
}

// Groups features together by category and filters them by levels
function groupAndSort(units, language, selectedLevel) {
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

    return groupedFeatures;
}

// Changes the cursor to be a pointer when a clickable feature is hovered over
function grabToPointer(layerName, hoverLayer, map) {
    map.events.add('mousemove', layerName, function (e) {
        hoverLayer.setOptions({ filter: ['==', ['get', '_azureMapsShapeId'], e.shapes[0].getProperties()['_azureMapsShapeId']] });
        map.getCanvas().style.cursor = 'pointer';
    });

    map.events.add('mouseleave', layerName, function (e) {
        hoverLayer.setOptions({ filter: ['==', ['get', '_azureMapsShapeId'], ''] });
        map.getCanvas().style.cursor = 'grab';
    });

    map.events.add(['mousedown', 'mouseup'], layerName, function (e) {
        map.getCanvas().style.cursor = 'pointer';
    });
}

// Changes cursor between grabbing and grabbing when map is clicked and dragged
function grabAndGrabbing(map) {
    map.events.add('mousedown', () => {
        map.getCanvas().style.cursor = 'grabbing';
    });

    map.events.add('mouseup', () => {
        map.getCanvas().style.cursor = 'grab';
    });
}

function updateSelectedColor(map, unitSelected) {
    if(unitSelected) {
        const lineLayer = map.layers.getLayerById('lineClickLayer');
        try {
            lineLayer.setOptions({strokeColor: 'hsla(0, 0%, 0%, 0)'});
        } catch {
            console.log('No line layer to change color of.')
        }
        const unitLayer = map.layers.getLayerById('unitClickChange');
        try {
            unitLayer.setOptions({fillColor: 'rgba(75, 146, 210, 0.8)'});
        } catch {
            console.log('No unit layer to change color of.')
        }
        } else {
        const polygonLayer = map.layers.getLayerById('lineClickLayer');
        try {
            polygonLayer.setOptions({strokeColor: 'rgba(75, 146, 210, 0.8)'});
        } catch {
            console.log('No unit layer to change color of.')
        }
        const unitLayer = map.layers.getLayerById('unitClickChange');
        try {
            unitLayer.setOptions({fillColor: 'hsla(0, 0%, 0%, 0)'});
        } catch {
            console.log('No unit layer to change color of.')
        }
    }
}

function updateLevels(levels, selectedLevel, newValue) {
    levels.features = levels.features.map(item => 
        item.id === selectedLevel.id ? newValue : item
    );

    return levels;
}

function setFields(feature, selectedLevel) {
    if (!feature.data.properties.name) { 
        feature.data.properties.name = {}; 
        feature.data.properties.name.en = ''; 
    } 

    if(!feature.data.properties.category) { 
        feature.data.properties.category = 'unspecified'; 
    } 

    if(!feature.data.properties.level_id) { 
        feature.data.properties.level_id = selectedLevel.id; 
    } 

    if(!feature.data.properties.display_point) { 
        feature.data.properties.display_point = {}; 
        feature.data.properties.display_point.type = 'Point'; 
        feature.data.properties.display_point.coordinates = []; 
    } 

    if(!feature.data.properties.label) { 
        feature.data.properties.label = ''; 
    } 

    if(feature.data.properties._azureMapsShapeId) { 
        let savedAzureId = feature.data.properties._azureMapsShapeId;
        delete feature.data.properties._azureMapsShapeId;
        feature.data.properties._azureMapsShapeId = savedAzureId;
    }

    if ('bbox' in feature.data.geometry) {
        delete feature.data.geometry.bbox;
    }
}

function deleteUnitPrevEdits(units, selectedLevel) {
    units.features = units.features.filter(item => item.properties.level_id !== selectedLevel.id);
}

export {
    currentEditData,
    groupAndSort,
    drawingModeChanged,
    grabToPointer,
    updateLevels,
    setFields,
    deleteUnitPrevEdits,
    grabAndGrabbing,
    updateSelectedColor
};