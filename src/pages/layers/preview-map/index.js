import { PLACES_PREVIEW } from 'common/constants';
import { useGeometryStore, useLayersStore } from 'common/store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { previewCanvas, previewContainerStyles } from './index.style';
import MapControls from './map-controls';
import MapFilters from './map-filters';
import MapPlaceholder from './map-placeholder';
import useTransformations from './useTransformations';
import { getMidPointsFromLayers, getPointsRecursively } from './utils';

const GeometryTypes = {
  POINT: 'Point',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  GEOMETRY_COLLECTION: 'GeometryCollection',
};

const CustomGeometryTypes = {
  LINE: 'line',
  POLYGON: 'polygon',
};

const canvasPadding = 15;

const PreviewMap = props => {
  const { width = 516, height = 516 } = props;

  const canvasRef = useRef(null);
  const drawRef = useRef(() => {});

  const exteriorLayers = useGeometryStore(s => s.dwgLayers);
  const [
    dwgLayers,
    allUserCreatedFeatureClasses,
    textLayers,
    getLayerNameError,
    previewSingleFeatureClass,
    categoryMap,
    categoryLayer,
  ] = useLayersStore(s => [
    s.dwgLayers,
    s.layers,
    s.textLayers,
    s.getLayerNameError,
    s.previewSingleFeatureClass,
    s.categoryMapping.categoryMap,
    s.categoryLayer,
  ]);

  const [filters, setFilters] = useState({
    displayMappedCategories: false,
    unselectedFeatureClasses: [],
    selectedDrawings: Object.keys(dwgLayers).slice(0, 1),
  });

  const { displayMappedCategories, unselectedFeatureClasses, selectedDrawings } = filters;

  const { isPanning, transformations, controls } = useTransformations({ canvasRef, drawRef });

  const allValidFeatureClasses = useMemo(() => {
    return allUserCreatedFeatureClasses.filter(
      featureClass => !featureClass.isDraft && getLayerNameError(featureClass.name) === null
    );
  }, [allUserCreatedFeatureClasses, getLayerNameError]);

  const drawings = useMemo(() => Object.keys(dwgLayers), [dwgLayers]);

  const midPoints = useMemo(() => getMidPointsFromLayers(dwgLayers, width, height), [dwgLayers, width, height]);

  const allLayers = useMemo(
    () =>
      drawings.reduce((acc, dwgLayer) => {
        if (!selectedDrawings.includes(dwgLayer)) return acc;
        return acc.concat(dwgLayers[dwgLayer]);
      }, []),
    [drawings, dwgLayers, selectedDrawings]
  );

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

  const dwgLayersToShow = useMemo(() => {
    if (previewSingleFeatureClass) {
      return allUserCreatedFeatureClasses.find(fClass => fClass.id === previewSingleFeatureClass)?.value ?? [];
    }
    return featureClasses
      .filter(fClass => !unselectedFeatureClasses.includes(fClass.id))
      .reduce((acc, fClass) => acc.concat(fClass.value), []);
  }, [allUserCreatedFeatureClasses, featureClasses, previewSingleFeatureClass, unselectedFeatureClasses]);

  const allUserCreatedPropertyLayers = useMemo(() => {
    const properties = allValidFeatureClasses
      .filter(fClass => !unselectedFeatureClasses.includes(fClass.id))
      .map(fClass => fClass.props)
      .flat()
      .filter(property => !property.isDraft)
      .map(property => property.value)
      .flat();
    const unique = [...new Set(properties)];

    return unique;
  }, [allValidFeatureClasses, unselectedFeatureClasses]);

  const mergedTextLayer = useMemo(() => {
    const matchedLayers = textLayers.filter(layer => {
      const labelLayers = displayMappedCategories ? [categoryLayer] : allUserCreatedPropertyLayers;
      return labelLayers.includes(layer.name) && selectedDrawings.includes(layer.drawing);
    });

    return matchedLayers.map(layer => layer.textList).flat();
  }, [allUserCreatedPropertyLayers, textLayers, selectedDrawings, displayMappedCategories, categoryLayer]);

  const layers = useMemo(
    () => allLayers.filter(layer => dwgLayersToShow.includes(layer.name)),
    [allLayers, dwgLayersToShow]
  );

  const toRelativePoint = useCallback(
    ([x, y]) => {
      const distanceX = x - midPoints.midX;
      // starting point of canvas is left top corner, therefore Y coordinate needs to be negated. Same for offset.
      const distanceY = midPoints.midY - y;
      const newX = width / 2 + distanceX * midPoints.multiplier;
      const newY = height / 2 + distanceY * midPoints.multiplier;

      const paddedX = canvasPadding + (newX * (width - 2 * canvasPadding)) / width;
      const paddedY = canvasPadding + (newY * (height - 2 * canvasPadding)) / height;
      return [paddedX, paddedY];
    },
    [height, midPoints, width]
  );

  const [pointsAndMultiPoints, coordinatesFromLinesAndPolygons] = useMemo(() => {
    const pointsAndMultiPoints = [];
    const geometries = [];

    layers.forEach(layer => {
      if (layer.geometry === undefined) {
        return;
      }
      if (layer.geometry.type !== GeometryTypes.GEOMETRY_COLLECTION) {
        geometries.push(layer.geometry);
      } else {
        layer.geometry.geometries.forEach(geometry => {
          geometries.push(geometry);
        });
      }
    });

    const coordinatesFromLinesAndPolygons = geometries
      .filter(geometry => {
        if (geometry.type === GeometryTypes.POINT) {
          pointsAndMultiPoints.push(geometry.coordinates);
          return false;
        }
        if (geometry.type === GeometryTypes.MULTI_POINT) {
          pointsAndMultiPoints.push(...geometry.coordinates);
          return false;
        }
        return true;
      })
      .map(geometry => ({
        type:
          geometry.type === GeometryTypes.MULTI_LINE_STRING ? CustomGeometryTypes.LINE : CustomGeometryTypes.POLYGON,
        geometry: getPointsRecursively(geometry.coordinates),
      }));

    return [pointsAndMultiPoints, coordinatesFromLinesAndPolygons];
  }, [layers]);

  const hasData =
    coordinatesFromLinesAndPolygons.length > 0 || pointsAndMultiPoints.length > 0 || mergedTextLayer.length > 0;

  const draw = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = midPoints.multiplier * 0.1;
    ctx.save();

    ctx.translate(transformations.x, transformations.y);
    ctx.scale(transformations.zoom, transformations.zoom);

    coordinatesFromLinesAndPolygons.forEach(({ type, geometry }) => {
      geometry.forEach(points => {
        if (points.length === 0) return;

        const newPoints = points.map(point => toRelativePoint(point));

        ctx.beginPath();
        ctx.moveTo(newPoints[0][0], newPoints[0][1]);

        for (let i = 1; i < newPoints.length; i++) {
          ctx.lineTo(newPoints[i][0], newPoints[i][1]);
        }

        if (type === CustomGeometryTypes.POLYGON) ctx.closePath();

        ctx.stroke();
      });
    });

    pointsAndMultiPoints.forEach(point => {
      const [x, y] = toRelativePoint(point);
      ctx.fillRect(x, y, 1, 1);
    });

    mergedTextLayer.forEach(layer => {
      const [x, y] = toRelativePoint(layer.displayPoint);

      ctx.font = `${midPoints.multiplier * 0.2}px Arial`;
      ctx.fillStyle = '#0068b7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let value = layer.value;

      if (displayMappedCategories) {
        value = categoryMap[layer.value.toLowerCase().trim()] || PLACES_PREVIEW.DEFAULT_IMDF_CATEGORY;

        ctx.fillStyle = '#F5AC72';
        ctx.font = `italic ${midPoints.multiplier * 0.2}px Arial`;
      }

      ctx.fillText(value, x, y);
    });

    ctx.restore();
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pointsAndMultiPoints,
    coordinatesFromLinesAndPolygons,
    mergedTextLayer,
    toRelativePoint,
    width,
    height,
    displayMappedCategories,
    categoryMap,
  ]);

  drawRef.current = draw;

  return (
    <div className={previewContainerStyles}>
      <MapFilters featureClasses={featureClasses} filters={filters} setFilters={setFilters} />
      <div style={{ position: 'relative', width, height }}>
        {exteriorLayers.length === 0 && !hasData && <MapPlaceholder />}
        <MapControls controls={controls} />
        <canvas
          ref={canvasRef}
          className={previewCanvas}
          width={width}
          height={height}
          style={{
            cursor: isPanning ? 'grabbing' : 'grab',
          }}
        />
      </div>
    </div>
  );
};

export default PreviewMap;
