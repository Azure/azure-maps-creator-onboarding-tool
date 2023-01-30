import { errorResponseMock } from './response.store.mock';
import { getFirstMeaningfulError } from './response.store';

describe('Response Store', () => {
  it('should return first meaningful error', () => {
    const error = getFirstMeaningfulError(errorResponseMock);
    expect(error.code).toEqual('dwgError');
    expect(error.message).toEqual(errorResponseMock.error.details[0].details[2].message);
  });

  it('should return first meaningful error 2', () => {
    errorResponseMock.error.details[0].details[1].code = 'packagingError';
    const error = getFirstMeaningfulError(errorResponseMock);
    expect(error.code).toEqual('packagingError');
    expect(error.message).toEqual(errorResponseMock.error.details[0].details[1].message);
  });

  it('should return first meaningful error 3', () => {
    errorResponseMock.error.details[0].details[0].code = 'invalidArchiveFormat';
    const error = getFirstMeaningfulError(errorResponseMock);
    expect(error.code).toEqual('invalidArchiveFormat');
    expect(error.message).toEqual(errorResponseMock.error.details[0].details[0].message);
  });
});