import { uploadConversion, startConversion, startDataset, startTileset } from './conversion';

jest.mock('../store/user.store', () => ({
  useUserStore: {
    getState: () => ({
      geography: 'EU',
      subscriptionKey: 'subKeeeeeeey',
    }),
  },
}));

describe('conversion api', () => {
  it('should call uploadConversion request', () => {
    uploadConversion('myFile');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/mapData?dataFormat=dwgzippackage&api-version=2.0&subscription-key=subKeeeeeeey&description=',
      { body: 'myFile', headers: { 'Content-Type': 'application/octet-stream' }, method: 'POST' }
    );
  });

  it('should call startConversion request', () => {
    startConversion('yuuu-deee-iii-deeee');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/conversions?udid=yuuu-deee-iii-deeee&outputOntology=facility-2.0&api-version=2023-03-01-preview&subscription-key=subKeeeeeeey&dwgPackageVersion=2.0&description=',
      { method: 'POST' }
    );
  });

  it('should call startDataset request', () => {
    startDataset('con-ver-sion-id');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/datasets?api-version=2.0&conversionId=con-ver-sion-id&subscription-key=subKeeeeeeey&description=',
      { method: 'POST' }
    );
  });

  it('should call startTileset request', () => {
    startTileset('da-ta-set-id');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/tilesets?api-version=2023-03-01-preview&datasetId=da-ta-set-id&subscription-key=subKeeeeeeey&description=',
      { method: 'POST' }
    );
  });
});
