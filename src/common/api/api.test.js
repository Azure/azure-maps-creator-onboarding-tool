import { useUserStore } from '../store';
import { deleteFromLocation, fetchAddress, fetchFromLocation, uploadManifestPackage } from './index';

describe('api', () => {
  beforeEach(() => {
    useUserStore.setState({
      geography: 'EU',
      subscriptionKey: 'subKeeeeeeey',
    });
  });

  it('should call uploadFile request', () => {
    uploadManifestPackage('myFile');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/manifest?api-version=2.0&subscription-key=subKeeeeeeey',
      { body: 'myFile', headers: { 'Content-Type': 'application/zip' }, method: 'POST' }
    );
  });

  it('should call fetchAddress request', () => {
    global.fetch.mockReturnValue(Promise.resolve({ json: () => {} }));
    fetchAddress('Rose Alley, Big Blue Building next to the old oak');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/search/address/json?subscription-key=subKeeeeeeey&api-version=1.0&query=Rose Alley, Big Blue Building next to the old oak&limit=1'
    );
  });

  it('should call deleteFromLocation request', () => {
    deleteFromLocation('https://www.msft.com/fetch/manifest/data');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.msft.com/fetch/manifest/data&subscription-key=subKeeeeeeey',
      { method: 'DELETE' }
    );
  });

  it('should call fetchFromLocation request', () => {
    fetchFromLocation('operation-1-location-2');
    expect(global.fetch).toHaveBeenCalledWith('operation-1-location-2&subscription-key=subKeeeeeeey', {
      method: 'GET',
    });
  });
});
