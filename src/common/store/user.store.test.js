import { getDomain } from './user.store';

describe('getDomain', () => {
  it('should throw an error when invalid domain is passed', () => {
    expect(() => getDomain('asd')).toThrow("Cannot read properties of undefined (reading 'URL')");
  });

  it('should return US domain', () => {
    expect(getDomain('US')).toBe('https://us.atlas.microsoft.com');
  });

  it('should return EU domain', () => {
    expect(getDomain('EU')).toBe('https://eu.atlas.microsoft.com');
  });
});
