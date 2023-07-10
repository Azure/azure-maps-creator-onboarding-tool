import {
  truncateCoordinates,
  convertLayersFromManifestJson,
  getDefaultState,
  checkIfLayersValid,
} from './layers.store';
import { polygonLayers, polygonLayersWithTruncatedCoordinates, layers } from './layers.store.mock';

describe('layers store', () => {
  it('truncateCoordinates', () => {
    const res = truncateCoordinates(polygonLayers);
    expect(res).toEqual(polygonLayersWithTruncatedCoordinates);
  });

  it('convertLayersFromManifestJson', () => {
    const res = convertLayersFromManifestJson(
      layers,
      ['0', 'RM$TXT', 'A-FURN-SYTM-EXST', 'A-EQPM-EXST'],
      ['A-EQPM-EXST', 'AK-ROOM']);
    expect(res).toEqual([
      {'isDraft': false, 'id': 'id2', 'name': 'qwe', 'props': [{'id': 'id3', 'isDraft': true, 'name': '', 'value': []}], 'value': ['A-EQPM-EXST']},
      {'isDraft': false, 'id': 'id4', 'name': 'asd', 'props': [{'id': 'id5', 'name': 'zzz', 'value': ['A-FURN-SYTM-EXST', 'A-EQPM-EXST'], 'isDraft': false}, {'id': 'id6', 'isDraft': true, 'name': '', 'value': []}], 'value': ['AK-ROOM']},
      {'isDraft': true, 'id': 'id7', 'name': '', 'props': [], 'value': []},
    ]);
  });

  it('should return default state', () => {
    expect(getDefaultState()).toEqual({
      dwgLayers: {},
      layerNames: [],
      polygonLayers: [],
      polygonLayerNames: [],
      textLayerNames: [],
      visited: false,
      layers: [{
        id: 'id8',
        isDraft: true,
        name: '',
        props: [],
        value: [],
      }],
    });
  });
});

describe('checkIfLayersValid', () => {
  it('should return false layers is not an array', () => {
    expect(checkIfLayersValid(1)).toBe(false);
    expect(checkIfLayersValid('qwe')).toBe(false);
    expect(checkIfLayersValid({})).toBe(false);
    expect(checkIfLayersValid(null)).toBe(false);
    expect(checkIfLayersValid(undefined)).toBe(false);
    expect(checkIfLayersValid(Infinity)).toBe(false);
    expect(checkIfLayersValid(NaN)).toBe(false);
    expect(checkIfLayersValid(new Set())).toBe(false);
    expect(checkIfLayersValid(new Map())).toBe(false);
  });

  it('should return false when layers contains invalid data', () => {
    expect(checkIfLayersValid([{foo: 'bar'}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 123, dwgLayers: []}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: {}}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name'}])).toBe(false);
    expect(checkIfLayersValid([{dwgLayers: []}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: 1}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: {}}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: null}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: new Set()}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: [{
        featureClassPropertyName: 1,
        dwgLayers: [],
      }]}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: [{
        featureClassPropertyName: 'name',
        dwgLayers: new Set(),
      }]}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: [{
        featureClassPropertyName: 'name',
        dwgLayers: null,
      }]}])).toBe(false);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: [{
        featureClassPropertyName: null,
        dwgLayers: [],
      }]}])).toBe(false);
  });

  it('should return true when layers is valid', () => {
    expect(checkIfLayersValid([])).toBe(true);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: []}])).toBe(true);
    expect(checkIfLayersValid([{featureClassName: 'name', dwgLayers: [], featureClassProperties: [{
        featureClassPropertyName: 'qwe',
        dwgLayers: [],
      }]}])).toBe(true);
  });
});