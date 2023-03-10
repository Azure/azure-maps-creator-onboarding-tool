import { renderHook } from '@testing-library/react-hooks';

import { useReviewManifestJson } from './review-manifest.store';

import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useGeometryStore } from './geometry.store';

describe('useReviewManifestJson', () => {
  beforeEach(() => {
    useGeometryStore.setState({
      anchorPoint: {
        angle: 150,
        coordinates: [50, 100],
      },
    });
    useLevelsStore.setState({
      levels: [
        {
          filename: 'file 1.dwg',
          levelName: 'level 1',
          ordinal: 11,
        },
        {
          filename: 'file 222.dwg',
          levelName: 'last level',
          ordinal: 99,
        }
      ],
    });
    useLayersStore.setState({
      layers: [
        {
          name: 'first layer',
          value: ['val 1', 'val 2'],
          props: [
            {
              name: 'first prop',
              value: ['prop val 1', 'prop val N'],
            },
            {
              name: 'second prop',
              value: ['Crows often hold grudges against specific people.'],
            },
          ],
        },
        {
          name: 'last layer',
          value: ['val val val', 'lav lav lav'],
          props: [],
        }
      ],
    });
  });

  it('should return manifest.json', () => {
    const { result } = renderHook(() => useReviewManifestJson());

    expect(result.current).toEqual({
      version:'2.0',
      buildingLevels: {
        levels: [
          { filename: 'file 1.dwg', levelName: 'level 1', ordinal: 11 },
          { filename: 'file 222.dwg', levelName: 'last level', ordinal: 99 },
        ],
      },
      georeference: {
        lat: 100,
        lon: 50,
        angle: 150,
      },
      featureClasses: {
        'first layer': {
          dwgLayers: ['val 1','val 2'],
          'first prop': ['prop val 1','prop val N'],
          'second prop': ['Crows often hold grudges against specific people.'],
        },
        'last layer': {
          dwgLayers: ['val val val','lav lav lav'],
        },
      },
    });
  });
});