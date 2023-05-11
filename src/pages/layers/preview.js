import { useEffect, useMemo, useState, useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { useTranslation } from 'react-i18next';

import { useLayersStore } from 'common/store';
import {
  previewDropdownStyles,
  previewContainerStyles,
  dropdownContainer,
  previewSelectContainer,
} from './preview.style';

const layersSelector = (s) => [s.dwgLayers, s.getAllValidLayers];
const canvasSide = 500;

const Preview = () => {
  const { t } = useTranslation();
  const [unselectedFeatureClasses, setUnselectedFeatureClasses] = useState([]);
  const [unselectedDrawings, setUnselectedDrawings] = useState([]);
  const [dwgLayers, getAllValidLayers] = useLayersStore(layersSelector, shallow);

  const drawings = useMemo(() => Object.keys(dwgLayers), [dwgLayers]);
  const midPoints = useMemo(() => getMidPointsFromLayers(dwgLayers), [dwgLayers]);
  const allLayers = useMemo(() => Object.keys(dwgLayers).reduce((acc, dwgLayer) => {
    if (unselectedDrawings.includes(dwgLayer)) {
      return acc;
    }
    return acc.concat(dwgLayers[dwgLayer]);
  }, []), [dwgLayers, unselectedDrawings]);
  const selectedDrawings = drawings.filter((drawing) => !unselectedDrawings.includes(drawing));
  const featureClasses = getAllValidLayers();
  const selectedFeatureClasses = featureClasses
    .filter((fClass) => !unselectedFeatureClasses.includes(fClass.id))
    .map((fClass) => fClass.id);
  const dwgLayersToShow = featureClasses
    .filter((fClass) => !unselectedFeatureClasses.includes(fClass.id))
    .reduce((acc, fClass) => acc.concat(fClass.value), []);
  const layers = allLayers.filter((layer) => dwgLayersToShow.includes(layer.name));
  const levelDropdownOptions = useMemo(() => drawings.map((drawing) => ({
    key: drawing,
    text: drawing,
  })), [drawings]);
  const dropdownOptions = useMemo(() => {
    if (featureClasses.length === 0) {
      return [{
        key: null,
        text: t('error.empty.feature.class.dropdown'),
      }];
    }
    return featureClasses.map((ffClass) => ({
      key: ffClass.id,
      text: ffClass.name,
    }));
  }, [featureClasses, t]);

  const onChange = useCallback((e, item) => {
    setUnselectedFeatureClasses(!item.selected ? unselectedFeatureClasses.concat(item.key) : unselectedFeatureClasses.filter((key) => key !== item.key));
  }, [setUnselectedFeatureClasses, unselectedFeatureClasses]);
  const onLevelsChange = useCallback((e, item) => {
    setUnselectedDrawings(!item.selected ? unselectedDrawings.concat(item.key) : unselectedDrawings.filter((key) => key !== item.key));
  }, [setUnselectedDrawings, unselectedDrawings]);

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSide, canvasSide);
    ctx.fillStyle = '#000';

    if (layers.length === 0) {
      return;
    }

    const pointsAndMultiPoints = [];
    const geometries = [];

    layers.forEach((layer) => {
      if (layer.geometry === undefined) {
        return;
      }
      if (layer.geometry.type !== 'GeometryCollection') {
        geometries.push(layer.geometry);
      } else {
        layer.geometry.geometries.forEach((geometry) => {
          geometries.push(geometry);
        });
      }
    });

    const coordinatesFromLinesAndPolygons = geometries.filter((geometry) => {
      if (geometry.type === 'Point') {
        pointsAndMultiPoints.push(geometry.coordinates);
        return false;
      }
      if (geometry.type === 'MultiPoint') {
        pointsAndMultiPoints.push(...geometry.coordinates);
        return false;
      }
      return true;
    }).map((geometry) => getPointsRecursively(geometry.coordinates)).flat();

    if (coordinatesFromLinesAndPolygons.length === 0 && pointsAndMultiPoints.length === 0) {
      return;
    }

    coordinatesFromLinesAndPolygons.forEach((points) => {
      const newPoints = points.map((point) => {
        const distanceX = point[0] - midPoints.midX;
        // starting point of canvas is left top corner, therefore Y coordinate needs to be negated. Same for offset.
        const distanceY = midPoints.midY - point[1];
        const newX = canvasSide/2 + (distanceX * midPoints.multiplier) + midPoints.offsetX;
        const newY = canvasSide/2 + (distanceY * midPoints.multiplier) - midPoints.offsetY;
        return [newX, newY];
      });

      ctx.beginPath();
      ctx.moveTo(newPoints[0][0], newPoints[0][1]);

      for (let i = 1; i < newPoints.length; i++) {
        ctx.lineTo(newPoints[i][0], newPoints[i][1]);
      }

      ctx.closePath();
      ctx.stroke();
    });

    pointsAndMultiPoints.forEach((point) => {
      const distanceX = point[0] - midPoints.midX;
      const distanceY = midPoints.midY - point[1];
      const newX = canvasSide/2 + (distanceX * midPoints.multiplier) + midPoints.offsetX;
      const newY = canvasSide/2 + (distanceY * midPoints.multiplier) - midPoints.offsetY;
      ctx.fillRect(newX, newY,1,1);
    });
  }, [layers, midPoints]);

  return (
    <div className={previewContainerStyles}>
      <div className={dropdownContainer}>
        <div className={previewSelectContainer}>
          {t('levels.preview')}:
          <Dropdown placeholder={t('select.levels.preview')} selectedKeys={selectedDrawings} multiSelect={drawings.length > 1}
                    onChange={onLevelsChange} options={levelDropdownOptions} styles={previewDropdownStyles} />
        </div>
        <div className={previewSelectContainer}>
          {t('layers.preview')}:
          <Dropdown placeholder={t('select.feature.class.preview')} selectedKeys={selectedFeatureClasses} multiSelect={featureClasses.length !== 0}
                    onChange={onChange} options={dropdownOptions} styles={previewDropdownStyles} />
        </div>
      </div>
      <canvas id='canvas' width={canvasSide} height={canvasSide} style={{maxWidth: '100%'}} />
    </div>
  );
};

export default Preview;

function getMidPointsFromLayers(dwgLayers) {
  const allLayers = Object.keys(dwgLayers).reduce((acc, dwgLayer) => acc.concat(dwgLayers[dwgLayer]), []);
  let minX = null;
  let maxX = null;
  let minY = null;
  let maxY = null;

  const updateMinMax = (point) => {
    if (maxX === null || point[0] > maxX) {
      maxX = point[0];
    }
    if (minX === null || point[0] < minX) {
      minX = point[0];
    }
    if (maxY === null || point[1] > maxY) {
      maxY = point[1];
    }
    if (minY === null || point[1] < minY) {
      minY = point[1];
    }
  };

  allLayers.forEach((layer) => {
    if (layer.geometry === undefined) {
      return;
    }
    if (layer.geometry.type !== 'GeometryCollection') {
      if (layer.geometry.type === 'Point') {
        updateMinMax(layer.geometry);
        return;
      }
      if (layer.geometry.type === 'MultiPoint') {
        layer.geometry.coordinates.forEach((point) => updateMinMax(point));
        return;
      }
      getPointsRecursively(layer.geometry.coordinates).forEach((pointsArr) => {
        pointsArr.forEach((point) => updateMinMax(point));
      });
    } else {
      layer.geometry.geometries.forEach((geometry) => {
        if (geometry.type === 'Point') {
          updateMinMax(geometry);
          return;
        }
        if (geometry.type === 'MultiPoint') {
          geometry.coordinates.forEach((point) => updateMinMax(point));
          return;
        }
        getPointsRecursively(geometry.coordinates).forEach((pointsArr) => {
          pointsArr.forEach((point) => updateMinMax(point));
        });
      });
    }
  });

  const diffX = maxX - minX;
  const diffY = maxY - minY;
  const diff = diffX > diffY ? diffX : diffY;
  const multiplier = canvasSide / diff;
  const offsetY = diffX > diffY ? (canvasSide - (multiplier * diffY)) / 3 : 0;
  const offsetX = diffX < diffY ? 0 : (canvasSide - (multiplier * diffX)) / 3;

  return {
    multiplier,
    midX: (minX + maxX) / 2,
    midY: (minY + maxY) / 2,
    offsetY,
    offsetX,
  };
}

function getPointsRecursively(coordinates) {
  if (!Array.isArray(coordinates)) {
    return [];
  }
  if (coordinates.length === 0) {
    return [];
  }

  if (isArrayOfPoints(coordinates)) {
    return [coordinates];
  }

  let foundBottom = isCoordinate(coordinates[0][0]);
  let output = [...coordinates];

  while (!foundBottom) {
    if (output.length === 0 || !Array.isArray(output[0])) return [];
    if (isArrayOfPoints(output[0])) {
      foundBottom = true;
    } else {
      output = output.flat();
    }
  }
  return output;
}

function isArrayOfPoints(coordinates) {
  if (coordinates.length === 0) {
    return false;
  }
  return isCoordinate(coordinates[0]);
}

function isCoordinate(coordinate) {
  return coordinate.length === 2 && typeof coordinate[0] === 'number' && typeof coordinate[1] === 'number';
}