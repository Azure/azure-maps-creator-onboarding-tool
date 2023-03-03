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