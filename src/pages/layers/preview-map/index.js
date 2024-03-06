import { useGeometryStore, useLayersStore } from 'common/store';
import Dropdown, { selectAllId } from 'components/dropdown';
import { useFeatureFlags } from 'hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  dropdownContainer,
  previewCanvas,
  previewContainerStyles,
  previewDropdownStyles,
  previewSelectContainer,
  previewSelectTitle,
  previewTitle,
} from './index.style';
import MapControls from './map-controls';
import useTransformations from './useTransformations';

const geometrySelector = s => s.dwgLayers;
const layersSelector = s => [s.dwgLayers, s.layers, s.getLayerNameError, s.previewSingleFeatureClass];
const canvasSide = 500;
const canvasPadding = 15;

const Preview = () => {
  const canvasRef = useRef(null);
  const drawRef = useRef(() => {});

  const { t } = useTranslation();
  const exteriorLayers = useGeometryStore(geometrySelector);
  const [unselectedFeatureClasses, setUnselectedFeatureClasses] = useState([]);
  const [dwgLayers, allUserCreatedFeatureClasses, getLayerNameError, previewSingleFeatureClass] =
    useLayersStore(layersSelector);

  const [selectedDrawings, setSelectedDrawings] = useState(Object.keys(dwgLayers));

  const { isPlacesPreview } = useFeatureFlags();

  const { isPanning, transformations, controls } = useTransformations({ canvasRef, drawRef });

  const allValidFeatureClasses = useMemo(
    () =>
      allUserCreatedFeatureClasses.filter(
        featureClass => !featureClass.isDraft && getLayerNameError(featureClass.name) === null
      ),
    [allUserCreatedFeatureClasses, getLayerNameError]
  );

  const drawings = useMemo(() => Object.keys(dwgLayers), [dwgLayers]);

  const midPoints = useMemo(() => getMidPointsFromLayers(dwgLayers), [dwgLayers]);

  const allLayers = useMemo(
    () =>
      drawings.reduce((acc, dwgLayer) => {
        if (!selectedDrawings.includes(dwgLayer)) {
          return acc;
        }
        return acc.concat(dwgLayers[dwgLayer]);
      }, []),
    [drawings, dwgLayers, selectedDrawings]
  );
  const selectedDrawingsOptions = useMemo(() => {
    if (selectedDrawings.length !== Object.keys(dwgLayers).length) {
      return selectedDrawings;
    }
    return [selectAllId, ...selectedDrawings];
  }, [dwgLayers, selectedDrawings]);

  const featureClasses = useMemo(
    () => [
      ...(exteriorLayers.length > 0
        ? [
            {
              id: 'exterior',
              name: 'Exterior',
              value: exteriorLayers,
            },
          ]
        : []),
      ...allValidFeatureClasses,
    ],
    [exteriorLayers, allValidFeatureClasses]
  );

  const selectedFeatureClassesNames = featureClasses
    .filter(fClass => !unselectedFeatureClasses.includes(fClass.id))
    .map(fClass => fClass.name);

  const selectedFeatureClassesIds = featureClasses
    .filter(fClass => !unselectedFeatureClasses.includes(fClass.id))
    .map(fClass => fClass.id);

  const selectedFeatureClasses = useMemo(() => {
    if (selectedFeatureClassesIds.length !== featureClasses.length) {
      return selectedFeatureClassesIds;
    }
    return [selectAllId, ...selectedFeatureClassesIds];
  }, [featureClasses, selectedFeatureClassesIds]);

  const dwgLayersToShow = useMemo(() => {
    if (previewSingleFeatureClass) {
      return allUserCreatedFeatureClasses.find(fClass => fClass.id === previewSingleFeatureClass)?.value ?? [];
    }
    return featureClasses
      .filter(fClass => !unselectedFeatureClasses.includes(fClass.id))
      .reduce((acc, fClass) => acc.concat(fClass.value), []);
  }, [allUserCreatedFeatureClasses, featureClasses, previewSingleFeatureClass, unselectedFeatureClasses]);

  const layers = useMemo(
    () => allLayers.filter(layer => dwgLayersToShow.includes(layer.name)),
    [allLayers, dwgLayersToShow]
  );

  const levelDropdownOptions = useMemo(() => {
    const options = drawings.map(drawing => ({
      key: drawing,
      text: drawing,
    }));
    if (options.length === 1) {
      return [options];
    }
    return [
      [
        {
          key: selectAllId,
          text: t('select.all'),
        },
      ],
      options,
    ];
  }, [drawings, t]);

  const featureClassDropdownOptions = useMemo(() => {
    if (featureClasses.length === 0) {
      return [
        [
          {
            key: null,
            text: t('error.empty.feature.class.dropdown'),
          },
        ],
      ];
    }
    const options = featureClasses.map(ffClass => ({
      key: ffClass.id,
      text: ffClass.name,
    }));
    if (options.length === 1) {
      return [options];
    }
    return [
      [
        {
          key: selectAllId,
          text: t('select.all'),
        },
      ],
      options,
    ];
  }, [featureClasses, t]);

  const onLayerDropdownChange = (e, item) => {
    if (featureClasses.length === 0) {
      return;
    }
    if (item.optionValue === selectAllId) {
      if (item.selectedOptions.includes(selectAllId)) {
        setUnselectedFeatureClasses([]);
      } else {
        setUnselectedFeatureClasses(featureClasses.map(fClass => fClass.id));
      }
    } else {
      setUnselectedFeatureClasses(
        featureClasses.filter(fClass => !item.selectedOptions.includes(fClass.id)).map(fClass => fClass.id)
      );
    }
  };

  const onLevelsChange = (e, item) => {
    if (item.optionValue === selectAllId) {
      if (item.selectedOptions.includes(selectAllId)) {
        setSelectedDrawings(Object.keys(dwgLayers));
      } else {
        setSelectedDrawings([]);
      }
    } else {
      setSelectedDrawings(item.selectedOptions.filter(option => option !== selectAllId));
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSide, canvasSide);
    ctx.strokeStyle = '#333';
    ctx.save();

    ctx.translate(transformations.x, transformations.y);
    ctx.scale(transformations.zoom, transformations.zoom);

    if (layers.length === 0) return;

    const pointsAndMultiPoints = [];
    const geometries = [];

    layers.forEach(layer => {
      if (layer.geometry === undefined) {
        return;
      }
      if (layer.geometry.type !== 'GeometryCollection') {
        geometries.push(layer.geometry);
      } else {
        layer.geometry.geometries.forEach(geometry => {
          geometries.push(geometry);
        });
      }
    });

    const coordinatesFromLinesAndPolygons = geometries
      .filter(geometry => {
        if (geometry.type === 'Point') {
          pointsAndMultiPoints.push(geometry.coordinates);
          return false;
        }
        if (geometry.type === 'MultiPoint') {
          pointsAndMultiPoints.push(...geometry.coordinates);
          return false;
        }
        return true;
      })
      .map(geometry => getPointsRecursively(geometry.coordinates))
      .flat();

    if (coordinatesFromLinesAndPolygons.length === 0 && pointsAndMultiPoints.length === 0) {
      return;
    }

    const applyPointPadding = (x, y) => {
      return [
        canvasPadding + (x * (canvasSide - 2 * canvasPadding)) / canvasSide,
        canvasPadding + (y * (canvasSide - 2 * canvasPadding)) / canvasSide,
      ];
    };

    coordinatesFromLinesAndPolygons.forEach(points => {
      if (points.length === 0) {
        return;
      }

      const newPoints = points.map(point => {
        const distanceX = point[0] - midPoints.midX;
        // starting point of canvas is left top corner, therefore Y coordinate needs to be negated. Same for offset.
        const distanceY = midPoints.midY - point[1];
        const newX = canvasSide / 2 + distanceX * midPoints.multiplier + midPoints.offsetX;
        const newY = canvasSide / 2 + distanceY * midPoints.multiplier - midPoints.offsetY;
        return applyPointPadding(newX, newY);
      });

      ctx.beginPath();
      ctx.moveTo(newPoints[0][0], newPoints[0][1]);

      for (let i = 1; i < newPoints.length; i++) {
        ctx.lineTo(newPoints[i][0], newPoints[i][1]);
      }

      ctx.closePath();
      ctx.stroke();
    });

    pointsAndMultiPoints.forEach(point => {
      const distanceX = point[0] - midPoints.midX;
      const distanceY = midPoints.midY - point[1];
      const newX = canvasSide / 2 + distanceX * midPoints.multiplier + midPoints.offsetX;
      const newY = canvasSide / 2 + distanceY * midPoints.multiplier - midPoints.offsetY;
      ctx.fillRect(...applyPointPadding(newX, newY), 1, 1);
    });

    ctx.restore();
  };

  useEffect(() => {
    controls.reset();
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, midPoints]);

  drawRef.current = draw;

  return (
    <div className={previewContainerStyles}>
      <div className={previewTitle}>Preview</div>
      <div className={dropdownContainer}>
        <div className={previewSelectContainer}>
          <div className={previewSelectTitle}>Level</div>
          <Dropdown
            onOptionSelect={onLevelsChange}
            className={previewDropdownStyles}
            optionGroups={levelDropdownOptions}
            multiselect
            selectedOptions={selectedDrawingsOptions}
          >
            {selectedDrawings.length ? selectedDrawings.join(', ') : t('select.levels.preview')}
          </Dropdown>
        </div>
        {!isPlacesPreview && (
          <div className={previewSelectContainer}>
            <div className={previewSelectTitle}>Feature Class</div>
            <Dropdown
              onOptionSelect={onLayerDropdownChange}
              className={previewDropdownStyles}
              selectedOptions={selectedFeatureClasses}
              optionGroups={featureClassDropdownOptions}
              multiselect={featureClasses.length !== 0}
            >
              {selectedFeatureClassesNames.length
                ? selectedFeatureClassesNames.join(', ')
                : t('select.feature.class.preview')}
            </Dropdown>
          </div>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <MapControls controls={controls} />
        <canvas
          ref={canvasRef}
          className={previewCanvas}
          width={canvasSide}
          height={canvasSide}
          style={{
            display: selectedFeatureClassesIds.length ? 'block' : 'none',
            cursor: isPanning ? 'grabbing' : 'grab',
          }}
        />
      </div>
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

  const updateMinMax = point => {
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

  allLayers.forEach(layer => {
    if (layer.geometry === undefined) {
      return;
    }
    if (layer.geometry.type !== 'GeometryCollection') {
      if (layer.geometry.type === 'Point') {
        updateMinMax(layer.geometry);
        return;
      }
      if (layer.geometry.type === 'MultiPoint') {
        layer.geometry.coordinates.forEach(point => updateMinMax(point));
        return;
      }
      getPointsRecursively(layer.geometry.coordinates).forEach(pointsArr => {
        pointsArr.forEach(point => updateMinMax(point));
      });
    } else {
      layer.geometry.geometries.forEach(geometry => {
        if (geometry.type === 'Point') {
          updateMinMax(geometry);
          return;
        }
        if (geometry.type === 'MultiPoint') {
          geometry.coordinates.forEach(point => updateMinMax(point));
          return;
        }
        getPointsRecursively(geometry.coordinates).forEach(pointsArr => {
          pointsArr.forEach(point => updateMinMax(point));
        });
      });
    }
  });

  const diffX = maxX - minX;
  const diffY = maxY - minY;
  const diff = diffX > diffY ? diffX : diffY;
  const multiplier = canvasSide / diff;
  const offsetY = diffX > diffY ? (canvasSide - multiplier * diffY) / 3 : 0;
  const offsetX = diffX < diffY ? 0 : (canvasSide - multiplier * diffX) / 3;

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
