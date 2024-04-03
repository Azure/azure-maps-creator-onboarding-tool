import { cx } from '@emotion/css';
import { useGeometryStore, useLayersStore } from 'common/store';
import Dropdown, { selectAllId } from 'components/dropdown';
import { useFeatureFlags } from 'hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  dropdownContainer,
  inlineSelectContainer,
  previewCanvas,
  previewContainerStyles,
  previewDescription,
  previewDropdownStyles,
  previewTitle,
  previewTitleWrapper,
  selectContainer,
} from './index.style';
import MapControls from './map-controls';
import useTransformations from './useTransformations';
import { getMidPointsFromLayers, getPointsRecursively } from './utils';

const betaFeature = false;

const canvasPadding = 15;

const Preview = props => {
  const { width = 516, height = 516 } = props;

  const canvasRef = useRef(null);
  const drawRef = useRef(() => {});

  const { t } = useTranslation();
  const exteriorLayers = useGeometryStore(s => s.dwgLayers);
  const [dwgLayers, allUserCreatedFeatureClasses, textLayers, getLayerNameError, previewSingleFeatureClass] =
    useLayersStore(s => [s.dwgLayers, s.layers, s.textLayers, s.getLayerNameError, s.previewSingleFeatureClass]);

  const [unselectedFeatureClasses, setUnselectedFeatureClasses] = useState([]);
  const [selectedDrawings, setSelectedDrawings] = useState(Object.keys(dwgLayers).slice(0, 1));

  const { isPlacesPreview } = useFeatureFlags();

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
  const selectedDrawingsOptions = useMemo(() => {
    if (selectedDrawings.length !== Object.keys(dwgLayers).length) return selectedDrawings;
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

  const selectedFeatureClassesOptions = useMemo(() => {
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
    const matchedLayers = textLayers.filter(
      layer => allUserCreatedPropertyLayers.includes(layer.name) && selectedDrawings.includes(layer.drawing)
    );

    return matchedLayers.map(layer => layer.textList).flat();
  }, [allUserCreatedPropertyLayers, textLayers, selectedDrawings]);

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

  const onLevelsDropdownChange = (e, item) => {
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
    ctx.clearRect(0, 0, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

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

    const toRelativePoint = (x, y) => {
      const distanceX = x - midPoints.midX;
      // starting point of canvas is left top corner, therefore Y coordinate needs to be negated. Same for offset.
      const distanceY = midPoints.midY - y;
      const newX = width / 2 + distanceX * midPoints.multiplier + midPoints.offsetX;
      const newY = height / 2 + distanceY * midPoints.multiplier - midPoints.offsetY;

      const paddedX = canvasPadding + (newX * (width - 2 * canvasPadding)) / width;
      const paddedY = canvasPadding + (newY * (height - 2 * canvasPadding)) / height;
      return [paddedX, paddedY];
    };

    coordinatesFromLinesAndPolygons.forEach(points => {
      if (points.length === 0) {
        return;
      }

      const newPoints = points.map(point => {
        return toRelativePoint(...point);
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
      const [x, y] = toRelativePoint(...point);
      ctx.fillRect(x, y, 1, 1);
    });

    mergedTextLayer.forEach(layer => {
      const [x, y] = toRelativePoint(...layer.displayPoint);

      ctx.font = '1.6px Arial';
      ctx.fillStyle = '#0068b7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(layer.value, x, y);
    });

    ctx.restore();
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, midPoints, width, height, mergedTextLayer]);

  drawRef.current = draw;

  return (
    <div className={previewContainerStyles}>
      <div className={previewTitleWrapper}>
        <span className={previewTitle}>Preview</span>
        {betaFeature && <span className={previewDescription}>displays polygonal entities only</span>}
      </div>

      <div className={dropdownContainer}>
        <div className={cx(selectContainer, { [inlineSelectContainer]: isPlacesPreview })}>
          <div>Level</div>
          <Dropdown
            onOptionSelect={onLevelsDropdownChange}
            className={previewDropdownStyles}
            optionGroups={levelDropdownOptions}
            multiselect
            selectedOptions={selectedDrawingsOptions}
          >
            {selectedDrawings.length ? selectedDrawings.join(', ') : t('select.levels.preview')}
          </Dropdown>
        </div>
        {!isPlacesPreview && (
          <div className={selectContainer}>
            <div>Feature Class</div>
            <Dropdown
              onOptionSelect={onLayerDropdownChange}
              className={previewDropdownStyles}
              selectedOptions={selectedFeatureClassesOptions}
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
      <div style={{ position: 'relative', width, height }}>
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

export default Preview;
