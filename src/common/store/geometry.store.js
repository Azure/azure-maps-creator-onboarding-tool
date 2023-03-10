import { useState, useEffect } from 'react';
import { center } from '@turf/turf';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { math } from 'azure-maps-control';
import { useThrottle } from '@react-hook/throttle';

import { useLayersStore } from './layers.store';
import buildWorker from './geometry.store.worker-builder';
import { TRUNCATE_FRACTION_DIGITS } from '../constants';

export const useGeometryStore = create(
  (set, get) => ({
    dwgLayers: [],
    addDwgLayer: (dwgLayer) => set({
      dwgLayers: [...get().dwgLayers, dwgLayer],
    }),
    removeDwgLayer: (dwgLayer) => set({
      dwgLayers: get().dwgLayers.filter((layer) => layer !== dwgLayer),
    }),
    anchorPoint: {
      coordinates: [0,0],
      angle: 0,
    },
    reset: () => set({
      anchorPoint: {
        coordinates: [0,0],
        angle: 0,
      },
    }),
    centerToAnchorPointDestination: {},
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
      set({
        anchorPoint: {
          coordinates: newAnchorPointCoordinatesFixed,
          angle: anchorPoint.angle,
        },
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
      set({
        anchorPoint: {
          coordinates: newAnchorPointCoordinatesFixed,
          angle,
        },
      });
    },
    updateAnchorPoint: (anchorPoint) => set((state) => ({
      anchorPoint: {
        ...state.anchorPoint,
        ...anchorPoint,
      },
    })),
  })
);

const geometrySelector = (s) => [s.dwgLayers, s.anchorPoint, s.setCenterToAnchorPointDestination];
const layersSelector = (s) => s.polygonLayers;

export const useDissolvedExterior = () => {
  const polygonLayers = useLayersStore(layersSelector);
  const [dwgLayers, anchorPoint, setCenterToAnchorPointDestination] = useGeometryStore(geometrySelector, shallow);
  const [output, setOutput] = useState([null, null]);
  const [worker, setWorker] = useState(null);
  const [centerToAnchorHasBeenUpdated, setCenterToAnchorHasBeenUpdated] = useState(false);
  const [mergedMultiPolygons, setMergedMultiPolygons] = useState(null);
  const [anchorPointForRendering, setAnchorPointForRendering] = useThrottle(null);

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
      setMergedMultiPolygons(message.data);
    };
  }, []);

  useEffect(() => {
    if (anchorPointForRendering === null || worker === null) {
      return;
    }
    worker.postMessage({
      dwgLayers,
      polygonLayers,
      anchorPoint: anchorPointForRendering,
    });
  }, [anchorPointForRendering, dwgLayers]); // eslint-disable-line react-hooks/exhaustive-deps

  // this was added to utilize throttling and prevent coordinates from re-calculating too often
  useEffect(() => {
    setAnchorPointForRendering(anchorPoint);
  // worker was added to deps here to ensure the initial run after worker was set
  }, [anchorPoint, worker, setAnchorPointForRendering]);

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