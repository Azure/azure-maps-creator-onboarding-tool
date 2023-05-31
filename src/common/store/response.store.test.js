import { errorResponseMock } from './response.store.mock';
import { getFirstMeaningfulError, parseManifestJson } from './response.store';

describe('getFirstMeaningfulError', () => {
  it('should return first meaningful error', () => {
    const error = getFirstMeaningfulError(errorResponseMock);
    expect(error.code).toEqual('dwgError');
    expect(error.message).toEqual(errorResponseMock.error.details[0].details[2].message);
  });

  it('should return first meaningful error 2', () => {
    errorResponseMock.error.details[0].details[1].code = 'packagingError';
    const error = getFirstMeaningfulError(errorResponseMock);
    expect(error.code).toEqual('packagingError');
    expect(error.message).toEqual(errorResponseMock.error.details[0].details[1].message);
  });

  it('should return first meaningful error 3', () => {
    errorResponseMock.error.details[0].details[0].code = 'invalidArchiveFormat';
    const error = getFirstMeaningfulError(errorResponseMock);
    expect(error.code).toEqual('invalidArchiveFormat');
    expect(error.message).toEqual(errorResponseMock.error.details[0].details[0].message);
  });
});

describe('parseManifestJson', () => {
  const validJson = {
    facilityName: '',
    buildingLevels: {
      dwgLayers: [],
      levels: [],
    },
    featureClasses: [],
    georeference: {
      lat: 1,
      lon: 2,
      angle: 3,
    }
  };

  it('should return null when json is not valid', () => {
    expect(parseManifestJson(null)).toBe(null);
    expect(parseManifestJson(undefined)).toBe(null);
    expect(parseManifestJson(NaN)).toBe(null);
    expect(parseManifestJson(Infinity)).toBe(null);
    expect(parseManifestJson('')).toBe(null);
    expect(parseManifestJson()).toBe(null);
    expect(parseManifestJson([])).toBe(null);
    expect(parseManifestJson(123)).toBe(null);
    expect(parseManifestJson('123')).toBe(null);
    expect(parseManifestJson({})).toBe(null);
    expect(parseManifestJson({
      ...validJson,
      facilityName: 123,
    })).toBe(null);
    expect(parseManifestJson({
      ...validJson,
      buildingLevels: {
        ...validJson.buildingLevels,
        dwgLayers: new Set(),
      }
    })).toBe(null);
    expect(parseManifestJson({
      ...validJson,
      featureClasses: new Set(),
    })).toBe(null);
    expect(parseManifestJson({
      ...validJson,
      georeference: {
        ...validJson.georeference,
        lat: '1',
      }
    })).toBe(null);
    expect(parseManifestJson({
      ...validJson,
      georeference: {
        ...validJson.georeference,
        angle: '1',
      }
    })).toBe(null);
  });

  it('should return true when json is valid', () => {
    expect(parseManifestJson(validJson)).toEqual({
      dwgLayers: [],
      facilityName: '',
      featureClasses: [],
      georeference: { angle: 3, lat: 1, lon: 2 },
      levels: [],
    });
  });
});