export function getMidPointsFromLayers(dwgLayers, width, height) {
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
  const multiplier = Math.min(width / diffX, height / diffY);

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  return {
    multiplier,
    midX,
    midY,
  };
}

export function getPointsRecursively(coordinates) {
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

export function isArrayOfPoints(coordinates) {
  if (coordinates.length === 0) {
    return false;
  }
  return isCoordinate(coordinates[0]);
}

export function isCoordinate(coordinate) {
  return coordinate.length === 2 && typeof coordinate[0] === 'number' && typeof coordinate[1] === 'number';
}
