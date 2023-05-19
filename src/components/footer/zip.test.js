import { createPackageWithJson } from './zip';

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