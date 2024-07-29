import { getFeatureLabel } from '../utils';

// Sets polygon, line, and symbol layers to invisible
function drawingModeChanged(allLayers) {
    allLayers.forEach(layer => {
        layer.setOptions({ visible:  false });
    });
}

// Displays information of a feature that is being drawn/edited, at time of click
function currentEditData(map, drawingManager) {
    map.events.add('drawingstarted', drawingManager, (f) => {
        if(f?.data) {
        var shapeId = f.data.id;
        var geojsonData = drawingManager.getSource().getShapeById(shapeId).data;
        document.getElementById('infoPanel-json').value = JSON.stringify(geojsonData, null, 2);
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

function writeToInfoPanel(geojsonData) {
    const { map, ...obj } = geojsonData;
    document.getElementById('infoPanel-json').value = JSON.stringify(obj, null, 2);
}

// Changes the cursor to be a pointer when a clickable feature is hovered over
function grabToPointer(layerName, map) {
    map.events.add('mouseover', layerName, function () {
        map.getCanvasContainer().style.cursor = 'pointer';
    });

    map.events.add('mouseout', layerName, function () {
        map.getCanvasContainer().style.cursor = 'grab';
    });
}

export {
    currentEditData,
    groupAndSort,
    drawingModeChanged,
    writeToInfoPanel,
    grabToPointer
};