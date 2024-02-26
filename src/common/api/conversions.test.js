import { clearCloudStorageData, deleteConversion, deleteUploads, getExistingConversions } from './conversions';

jest.mock('../store/user.store', () => ({
  useUserStore: {
    getState: () => ({
      geography: 'EU',
      subscriptionKey: 'subKeeeeeeey',
    }),
  },
}));

describe('API utility functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url, options) =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ mapDataList: [], conversions: [] }),
      })
    );
  });

  it('should call deleteUploads with correct URL and method', async () => {
    const id = 'uploadId';
    await deleteUploads(id);
    expect(global.fetch).toHaveBeenCalledWith(
      `https://eu.atlas.microsoft.com/mapData/${id}?api-version=2.0&subscription-key=subKeeeeeeey`,
      { method: 'DELETE' }
    );
  });

  it('should call deleteConversion with correct URL and method', async () => {
    const id = 'conversionId';
    await deleteConversion(id);
    expect(global.fetch).toHaveBeenCalledWith(
      `https://eu.atlas.microsoft.com/conversions/${id}?api-version=2.0&subscription-key=subKeeeeeeey`,
      { method: 'DELETE' }
    );
  });

  it('should handle getExistingConversions correctly', async () => {
    const result = await getExistingConversions();
    expect(result.error).toBeFalsy();
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('should handle clearCloudStorageData correctly', async () => {
    await clearCloudStorageData();
    expect(fetch).toHaveBeenCalled();
  });
});
