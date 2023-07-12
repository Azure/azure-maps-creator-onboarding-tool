import { useState, useEffect, useRef } from 'react';
import { center } from '@turf/turf';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { math } from 'azure-maps-control';

import { useLayersStore } from './layers.store';
import buildWorker from './geometry.store.worker-builder';
import { TRUNCATE_FRACTION_DIGITS } from '../constants';

const getDefaultState = () => ({
  anchorPoint: {
    coordinates: [0, 0],
    angle: 0,
  },
  dwgLayers: [],
  centerToAnchorPointDestination: {},
});

export const useGeometryStore = create(
  (set, get) => ({
    ...getDefaultState(),
    reset: () => set({
      ...getDefaultState(),
    }),
    setDwgLayers: (dwgLayers) => set({
      dwgLayers,
    }),
    setCenterToAnchorPointDestination: (centerToAnchorPointDestination) => set({
      centerToAnchorPointDestination,
    }),
    updateAnchorPointViaMapCenter: (mapCenter) => {
      const anchorPoint = get().anchorPoint;
      const centerToAnchor = get().centerToAnchorPointDestination;
      const newAnchorPointCoordinates = math.getDestination(mapCenter, fixAngle(centerToAnchor.heading + anchorPoint.angle), centerToAnchor.distance, 'meters');
      const newAnchorPointCoordinatesFixed = [
        parseFloat(newAnchorPointCoordinates[0].toFixed(TRUNCATE_FRACTION_DIGITS)),
        parseFloat(newAnchorPointCoordinates[1].toFixed(TRUNCATE_FRACTION_DIGITS))
      ];
      get().safelySetAnchorPoint({
        coordinates: newAnchorPointCoordinatesFixed,
        angle: anchorPoint.angle,
      });
    },
    updateAngle: (angle) => {
      const anchorPoint = get().anchorPoint;
      if (angle === anchorPoint.angle) {
        return;
      }
      const centerToAnchor = get().centerToAnchorPointDestination;
      const anchorToCenterAngle = fixAngle(centerToAnchor.heading + anchorPoint.angle + 180);
      const centerPoint = math.getDestination(anchorPoint.coordinates, anchorToCenterAngle, centerToAnchor.distance, 'meters');
      const newAnchorPointCoordinates = math.getDestination(centerPoint, fixAngle(centerToAnchor.heading + angle), centerToAnchor.distance, 'meters');
      const newAnchorPointCoordinatesFixed = [
        parseFloat(newAnchorPointCoordinates[0].toFixed(TRUNCATE_FRACTION_DIGITS)),
        parseFloat(newAnchorPointCoordinates[1].toFixed(TRUNCATE_FRACTION_DIGITS))
      ];
      get().safelySetAnchorPoint({
        coordinates: newAnchorPointCoordinatesFixed,
        angle,
      });
    },
    updateAnchorPoint: (anchorPoint) => {
      get().safelySetAnchorPoint({
        ...get().anchorPoint,
        ...anchorPoint,
      });
    },
    safelySetAnchorPoint: (anchorPoint) => {
      if (isValidAnchorPoint(anchorPoint)) {
        set({
          anchorPoint,
        });
      }
    },
  })
);

const geometrySelector = (s) => [s.dwgLayers, s.anchorPoint, s.setCenterToAnchorPointDestination];
const layersSelector = (s) => s.polygonLayers;

export const useDissolvedExterior = () => {
  const lastProcessedAnchorPoint = useRef(null);
  const lastProcessedDwgLayers = useRef(null);
  const polygonLayers = useLayersStore(layersSelector);
  const [dwgLayers, anchorPoint, setCenterToAnchorPointDestination] = useGeometryStore(geometrySelector, shallow);
  const [output, setOutput] = useState([null, null]);
  const [worker, setWorker] = useState(null);
  const [calcInProgress, setCalcInProgress] = useState(false);
  const [centerToAnchorHasBeenUpdated, setCenterToAnchorHasBeenUpdated] = useState(false);
  const [mergedMultiPolygons, setMergedMultiPolygons] = useState(null);

  useEffect(() => {
    if (mergedMultiPolygons === null) {
      setOutput([null, null]);
      return;
    }

    const polygon = mergedMultiPolygons[0];
    const anchorPointOfThisPolygon = mergedMultiPolygons[1];
    const fixedAngle = fixAngle(anchorPointOfThisPolygon.angle);
    const rotated = polygon.type === 'Polygon'
      ? polygon.coordinates.map((coordinates) => (
        math.rotatePositions(coordinates, anchorPointOfThisPolygon.coordinates, fixedAngle)
      ))
      : polygon.coordinates.map((coordinates) => (
        coordinates.map((innerCoordinates) => (
          math.rotatePositions(innerCoordinates, anchorPointOfThisPolygon.coordinates, fixedAngle)
        ))
      ));

    const rotatedPolygon = { type: polygon.type, coordinates: rotated };
    const centerPoint = center(rotatedPolygon).geometry.coordinates;

    if (!centerToAnchorHasBeenUpdated) {
      const distance = math.getDistanceTo(centerPoint, anchorPointOfThisPolygon.coordinates, 'meters');
      const heading = math.getHeading(centerPoint, anchorPointOfThisPolygon.coordinates);
      setCenterToAnchorHasBeenUpdated(true);
      setCenterToAnchorPointDestination({distance, heading: heading - anchorPointOfThisPolygon.angle});
    }
    setOutput([centerPoint, rotatedPolygon]);
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
    if (
      worker === null
      || calcInProgress
      || (anchorPoint === lastProcessedAnchorPoint.current && dwgLayers === lastProcessedDwgLayers.current)) {
      return;
    }
    setCalcInProgress(true);
    lastProcessedAnchorPoint.current = anchorPoint;
    lastProcessedDwgLayers.current = dwgLayers;
    worker.postMessage({
      dwgLayers,
      polygonLayers,
      anchorPoint,
    });
    // worker was added to deps here to ensure the initial run after worker was set
  }, [anchorPoint, worker, dwgLayers, calcInProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  return output;
};

export function fixAngle(angle) {
  if (angle === -360 || angle === 0) {
    return 360;
  }
  if (angle < 0) {
    return angle + 360;
  }
  if (angle > 360) {
    return angle % 360;
  }
  return angle;
}

export function isValidAnchorPoint(anchorPoint) {
  const angle = anchorPoint?.angle;
  const coordinates = anchorPoint?.coordinates;

  if (!isValidNumber(angle)) {
    return false;
  }
  if (!Array.isArray(coordinates) || !isValidNumber(coordinates[0]) || !isValidNumber(coordinates[1])) {
    return false;
  }
  return true;
}

function isValidNumber(num) {
  return typeof num === 'number' && !isNaN(num) && Number.isFinite(num);
}