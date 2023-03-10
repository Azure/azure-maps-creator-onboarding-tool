import { truncateCoordinates, convertLayersFromManifestJson, getDefaultState } from './layers.store';
import { polygonLayers, polygonLayersWithTruncatedCoordinates, layers } from './layers.store.mock';

describe('layers store', () => {
  it('truncateCoordinates', () => {
    const res = truncateCoordinates(polygonLayers);
    expect(res).toEqual(polygonLayersWithTruncatedCoordinates);
  });

  it('convertLayersFromManifestJson', () => {
    const res = convertLayersFromManifestJson(
      layers,
      ['AK-FLOR-EXTR', 'AK-WALL'],
      ['0', 'RM$TXT', 'A-FURN-SYTM-EXST', 'A-EQPM-EXST'],
      ['A-EQPM-EXST', 'AK-ROOM']);
    expect(res).toEqual({
      'convertedLayers': [
        {'isDraft': false, 'id': 0, 'name': 'exterior', 'props': [{'id': 2, 'name': 'ffff', 'value': ['0', 'RM$TXT']}], 'required': true, 'value': ['AK-FLOR-EXTR', 'AK-WALL']},
        {'isDraft': false, 'id': 3, 'name': 'qwe', 'props': [{'id': 4, 'isDraft': true, 'name': '', 'value': []}], 'required': false, 'value': ['A-EQPM-EXST']},
        {'isDraft': false, 'id': 5, 'name': 'asd', 'props': [{'id': 7, 'name': 'zzz', 'value': ['A-FURN-SYTM-EXST', 'A-EQPM-EXST']}, {'id': 6, 'isDraft': true, 'name': '', 'value': []}], 'required': false, 'value': ['AK-ROOM']},
        {'isDraft': true, 'id': 1, 'name': '', 'props': [], 'required': false, 'value': []},
      ],
      'newLayerIdCounter': 8,
    });
  });

  it('should return default state', () => {
    expect(getDefaultState()).toEqual({
      newLayerIdCounter: 2,
      layerNames: [],
      polygonLayers: [],
      polygonLayerNames: [],
      textLayerNames: [],
      layers: [{
        id: 0,
        name: 'exterior',
        value: [],
        props: [],
        required: true,
        isDraft: false,
      }, {
        id: 1,
        isDraft: true,
        name: '',
        props: [],
        required: false,
        value: [],
      }],
    });
  });
});