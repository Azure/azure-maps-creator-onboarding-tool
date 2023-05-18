import { fetchAddress, fetchStatus, uploadFile, fetchManifestData, deleteManifestData } from './index';

describe('api', () => {
  it('should call uploadFile request', () => {
    uploadFile('myFile', 'EU', 'subKeeeeeeey');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/manifest?api-version=2.0&subscription-key=subKeeeeeeey',
      {'body': 'myFile', 'headers': {'Content-Type': 'application/zip'}, 'method': 'POST'},
    );
  });

  it('should call fetchAddress request', () => {
    global.fetch.mockReturnValue(Promise.resolve({ json: () => {} }));
    fetchAddress('Rose Alley, Big Blue Building next to the old oak', 'EU', 'hola');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/search/address/json?subscription-key=hola&api-version=1.0&query=Rose Alley, Big Blue Building next to the old oak&limit=1'
    );
  });

  it('should call fetchStatus request', () => {
    fetchStatus('operation-1-location-2', 'uno-dos-tres');
    expect(global.fetch).toHaveBeenCalledWith(
      'operation-1-location-2&subscription-key=uno-dos-tres',
      {'method': 'GET'},
    );
  });

  it('should call fetchManifestData request', () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => {} }));
    fetchManifestData('https://www.msft.com/fetch/manifest/data', 'uno-dos-tres');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.msft.com/fetch/manifest/data&subscription-key=uno-dos-tres',
      {'method': 'GET'},
    );
  });

  it('should call deleteManifestData request', () => {
    deleteManifestData('https://www.msft.com/fetch/manifest/data', 'uno-dos-tres');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.msft.com/fetch/manifest/data&subscription-key=uno-dos-tres',
      {'method': 'DELETE'},
    );
  });
});