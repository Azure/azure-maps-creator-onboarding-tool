import { getSplitPaths, isNumeric, isVerticalExtentEmpty } from './functions';

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

describe('isNumeric', () => {
  it('should return true', () => {
    expect(isNumeric('1')).toBe(true);
    expect(isNumeric('-1.')).toBe(true);
    expect(isNumeric('0')).toBe(true);
    expect(isNumeric('-0')).toBe(true);
    expect(isNumeric('-0.')).toBe(true);
    expect(isNumeric('-0.0')).toBe(true);
    expect(isNumeric('-0.00000000000')).toBe(true);
    expect(isNumeric('0.00000000000')).toBe(true);
    expect(isNumeric('123.123')).toBe(true);
    expect(isNumeric('-123.123')).toBe(true);
  });

  it('should return false', () => {
    expect(isNumeric('')).toBe(false);
    expect(isNumeric('-')).toBe(false);
    expect(isNumeric('null')).toBe(false);
    expect(isNumeric('NaN')).toBe(false);
    expect(isNumeric('Infinity')).toBe(false);
    expect(isNumeric('-Infinity')).toBe(false);
    expect(isNumeric('123q')).toBe(false);
    expect(isNumeric('q123')).toBe(false);
    expect(isNumeric('=123')).toBe(false);
    expect(isNumeric('--123')).toBe(false);
    expect(isNumeric('++123')).toBe(false);
    expect(isNumeric('-123-')).toBe(false);
    expect(isNumeric('123!')).toBe(false);
    expect(isNumeric('undefined')).toBe(false);
    expect(isNumeric('1+1')).toBe(false);
    expect(isNumeric('1-1')).toBe(false);
  });
});

describe('isVerticalExtentEmpty', () => {
  it('should return true', () => {
    expect(isVerticalExtentEmpty('')).toBe(true);
    expect(isVerticalExtentEmpty('-')).toBe(true);
  });

  it('should return false', () => {
    expect(isVerticalExtentEmpty('empty')).toBe(false);
    expect(isVerticalExtentEmpty('qwer')).toBe(false);
    expect(isVerticalExtentEmpty('null')).toBe(false);
    expect(isVerticalExtentEmpty('1.12')).toBe(false);
    expect(isVerticalExtentEmpty('-1.12')).toBe(false);
    expect(isVerticalExtentEmpty('0')).toBe(false);
  });
});
