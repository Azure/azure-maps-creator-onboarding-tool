import { useState, useEffect } from 'react';
import { center } from '@turf/turf';
import { create } from 'zustand';
import { shallow } from'zustand/shallow';
import { math } from 'azure-maps-control';

import { useLayersStore } from './layers.store';
import buildWorker from './geometry.store.worker-builder';

export const useGeometryStore = create(
  (set) => ({
    anchorPoint: {
      coordinates: [0,0],
      angle: 0,
    },
    reset: () => set({
      anchorPoint: {
        coordinates: [0,0],
        angle: 0,
      },
      checkedByUser: false,
    }),
    updateAnchorPoint: (anchorPoint) => set((state) => ({
      anchorPoint: {
        ...state.anchorPoint,
        ...anchorPoint,
      },
    })),
    checkedByUser: false,
    check: () => set({
      checkedByUser: true,
    }),
  })
);

const geometrySelector = (s) => s.anchorPoint;
const layersSelector = (s) => [s.layers.find((layer) => layer.id === 0), s.polygonLayers];

export const useDissolvedExterior = () => {
  const [exteriorLayer, polygonLayers] = useLayersStore(layersSelector, shallow);
  const anchorPoint = useGeometryStore(geometrySelector, shallow);
  const [anchorPointWasUpdated, setAnchorPointWasUpdated] = useState(false);
  const [calcInProgress, setCalcInProgress] = useState(false);
  const [output, setOutput] = useState([null, null, null]);
  const [worker, setWorker] = useState(null);
  const [centerToAnchorPointDestination, setCenterToAnchorPointDestination] = useState(null);
  const [mergedMultiPolygons, setMergedMultiPolygons] = useState(null);

  useEffect(() => {
    if (mergedMultiPolygons === null) return;

    const centerPoint = center(mergedMultiPolygons).geometry.coordinates;
    const fixedAngle = anchorPoint.angle > 0 ? anchorPoint.angle : 360;
    const rotated = mergedMultiPolygons.type === 'Polygon'
      ? mergedMultiPolygons.coordinates.map((coordinates) => (
        math.rotatePositions(coordinates, centerPoint, fixedAngle)
      ))
      : mergedMultiPolygons.coordinates.map((coordinates) => (
        coordinates.map((innerCoordinates) => (
          math.rotatePositions(innerCoordinates, centerPoint, fixedAngle)
        ))
      ));

    if (centerToAnchorPointDestination === null) {
      const distance = math.getDistanceTo(centerPoint, anchorPoint.coordinates, 'meters');
      const heading = math.getHeading(centerPoint, anchorPoint.coordinates);
      setCenterToAnchorPointDestination([distance, heading]);
      setOutput([
        centerPoint,
        { type: mergedMultiPolygons.type, coordinates: rotated },
        [distance, heading],
      ]);
    } else {
      setOutput([
        centerPoint,
        { type: mergedMultiPolygons.type, coordinates: rotated },
        centerToAnchorPointDestination,
      ]);
    }
  }, [mergedMultiPolygons]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const newWorker = buildWorker();
    setWorker(newWorker);
    newWorker.onmessage = (message) => {
      setCalcInProgress(false);
      setMergedMultiPolygons(message.data);
    };
  }, []);

  useEffect(() => {
    setAnchorPointWasUpdated(true);
  }, [anchorPoint]);

  useEffect(() => {
    if (calcInProgress || !anchorPointWasUpdated) {
      return;
    }

    setAnchorPointWasUpdated(false);
    setCalcInProgress(true);

    worker.postMessage({
      exteriorLayer, polygonLayers, anchorPoint,
    });
  }, [anchorPointWasUpdated, calcInProgress, anchorPoint]); // eslint-disable-line react-hooks/exhaustive-deps

  return output;
};