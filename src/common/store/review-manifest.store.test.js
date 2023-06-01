import { renderHook } from '@testing-library/react-hooks';

import { createPackageWithJson, useReviewManifestJson } from './review-manifest.store';

import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useGeometryStore } from './geometry.store';

jest.mock( '@zip.js/zip.js', () => ({
  BlobWriter: class {},
  BlobReader: class {
    constructor(originalPackage) {
      this.originalPackage = originalPackage;
    }

    toString() {
      return this.originalPackage;
    }
  },
  ZipWriter: class {
    add(filename, content) {
      if (this.files === undefined) {
        this.files = [];
      }
      this.files.push([filename, content.toString()]);
      return Promise.resolve();
    }
    close() {
      return Promise.resolve(this.files);
    }
  },
  ZipReader: class {
    constructor(blobReader) {
      this.originalPackage = blobReader.originalPackage;
    }
    getEntries() {
      return Promise.resolve([
        { filename: `${this.originalPackage}qwe.dwg`, getData: () => Promise.resolve('file1') },
        { filename: `${this.originalPackage}qwe.exe`, getData: () => Promise.resolve('file2') },
        { filename: `${this.originalPackage}ASDZXCZXC.dwg`, getData: () => Promise.resolve('file3') },
      ]);
    }
  },
}));

describe('useReviewManifestJson', () => {
  beforeEach(() => {
    useGeometryStore.setState({
      dwgLayers: ['exteriorLayer1', 'exteriorLayer2'],
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
          verticalExtent: -1.55,
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
        dwgLayers: ['exteriorLayer1', 'exteriorLayer2'],
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
      featureClasses: [
        {
          featureClassName: 'first layer',
          dwgLayers: ['val 1','val 2'],
          featureClassProperties: [
            {
              featureClassPropertyName: 'first prop',
              dwgLayers: [ 'prop val 1', 'prop val N' ],
            },
            {
              dwgLayers: ['Crows often hold grudges against specific people.'],
              featureClassPropertyName: 'second prop',
            },
          ],
        },
        {
          featureClassName: 'last layer',
          dwgLayers: ['val val val','lav lav lav'],
        }
      ],
    });
  });

  describe('createPackageWithJson', () => {
    let originalBlob = global.blob;
    beforeAll(() => {
      global.Blob = function(content, type) {
        this.stringContent = JSON.stringify({
          content,
          type,
        });
      };
    });

    afterAll(() => {
      global.blob = originalBlob;
    });

    it('createPackageWithJson', async () => {
      const out = await createPackageWithJson('blee-bloo-blah', { foo: 'bar' });
      expect(out).toEqual([
        ['manifest.json', {
          stringContent: '{"content":["{\\n  \\"foo\\": \\"bar\\"\\n}"],"type":{"type":"application/json"}}',
        }],
        ['blee-bloo-blahqwe.dwg', 'file1'],
        ['blee-bloo-blahASDZXCZXC.dwg', 'file3'],
      ]);
    });
  });
});