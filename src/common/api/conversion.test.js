import { uploadConversion, fetchUploadStatus, fetchMetaData } from './conversion';

describe('conversion api', () => {
  it('should call uploadConversion request', () => {
    uploadConversion('myFile', 'EU', 'subKeeeeeeey');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/mapData?dataFormat=dwgzippackage&api-version=2.0&subscription-key=subKeeeeeeey',
      { 'body': 'myFile', 'headers': { 'Content-Type': 'application/octet-stream' }, 'method': 'POST' },
    );
  });

  it('should call fetchUploadStatus request', () => {
    fetchUploadStatus('operation-1-location-2', 'hola');
    expect(global.fetch).toHaveBeenCalledWith(
      'operation-1-location-2&subscription-key=hola',
      { 'method': 'GET' },
    );
  });

  it('should call fetchMetaData request', () => {
    fetchMetaData('operation-2-location-3', 'gamarjoba');
    expect(global.fetch).toHaveBeenCalledWith(
      'operation-2-location-3&subscription-key=gamarjoba',
      { 'method': 'GET' },
    );
  });
});