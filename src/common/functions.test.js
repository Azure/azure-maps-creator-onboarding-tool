import { getSplitPaths } from './functions';

describe('getSplitPaths()', () => {
  it('should return empty array for invalid path', () => {
    expect(getSplitPaths('')).toEqual([]);
    expect(getSplitPaths(0)).toEqual([]);
    expect(getSplitPaths(true)).toEqual([]);
    expect(getSplitPaths(null)).toEqual([]);
    expect(getSplitPaths(undefined)).toEqual([]);
  });

  it('should return array of paths for valid path', () => {
    expect(getSplitPaths('/')).toEqual(['/']);
    expect(getSplitPaths('/create')).toEqual(['/', '/create']);
    expect(getSplitPaths('/create/nested')).toEqual(['/', '/create', '/create/nested']);
    expect(getSplitPaths('/1/2/3')).toEqual(['/', '/1', '/1/2', '/1/2/3']);
  });
});