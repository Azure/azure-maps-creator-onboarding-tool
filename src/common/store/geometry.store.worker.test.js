import { onMessage, translateCoordinateInMetersIntoDegrees, truncateNumber } from './geometry.store.worker';
import { workerMockData, workerMockDataResult, workerMockData2, workerMockData2Result } from './geometry.store.mock';
import proj4 from 'proj4';

describe('Geometry Worker', () => {
  it('should return merged (multi)polygon', () => {
    const res = onMessage(workerMockData);
    expect(res).toEqual(workerMockDataResult);
  });

  it('should return merged (multi)polygon 2', () => {
    const res = onMessage(workerMockData2);
    expect(res).toEqual(workerMockData2Result);
  });

  it('calculated coordinates should match the original proj4 function result', () => {
    const iterations = 1000;
    let allResultsMatch = true;

    for (let i = 0; i < iterations; i++) {
      const lon = getRandomArbitrary(-180, 180);
      const lat = getRandomArbitrary(-90, 90);
      const x = getRandomArbitrary(10, 10000);
      const y = getRandomArbitrary(10, 10000);
      const res1 = translateCoordinateInMetersIntoDegrees(lon, lat, [x, y]);
      const res2 = translateCoordinateInMetersIntoDegreesOrig(lon, lat, [x, y]);

      if (res1[0] !== res2[0] || res1[1] !== res2[1]) {
        allResultsMatch = false;
        break;
      }
    }

    expect(allResultsMatch).toBe(true);
  });
});

function translateCoordinateInMetersIntoDegreesOrig(lon, lat, coordinateInMeters) {
  const firstProjection =
    'PROJCS["ProjLocalCS", GEOGCS["WGS 84", DATUM["World Geodetic System 1984", SPHEROID["WGS 84", 6378137, 298.257223563, AUTHORITY["EPSG", "7030"]], AUTHORITY["EPSG", "6326"]], PRIMEM["Greenwich", 0, AUTHORITY["EPSG", "8901"]], UNIT["degree", 0.0174532925199433, AUTHORITY["EPSG", "9102"]], AUTHORITY["EPSG", "4326"]], UNIT["metre", 1, AUTHORITY["EPSG", "9001"]], PROJECTION["Transverse Mercator"], PARAMETER["central_meridian",' +
    lon +
    '], PARAMETER["latitude_of_origin",' +
    lat +
    '], PARAMETER["false_easting", 0], PARAMETER["false_northing", 0], AXIS["Lon", EAST], AXIS["Lat", NORTH]]';
  const secondProjection = proj4.WGS84;
  const adjustedCoordinates = proj4(firstProjection, secondProjection, coordinateInMeters);
  return [truncateNumber(adjustedCoordinates[0]), truncateNumber(adjustedCoordinates[1])];
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
