import { getDomain } from './user.store';

describe('getDomain', () => {
  it('should throw an error when invalid domain is passed', () => {
    expect(() => getDomain('asd')).toThrow("Cannot read properties of undefined (reading 'URL')");
  });

  it('should return US domain', () => {
    expect(getDomain('US')).toBe('us.atlas.microsoft.com');
  });

  it('should return EU domain', () => {
    expect(getDomain('EU')).toBe('eu.atlas.microsoft.com');
  });
});
