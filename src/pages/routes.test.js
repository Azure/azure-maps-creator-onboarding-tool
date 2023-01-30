import { routes } from './routes';

jest.mock('./index/index', () => () => {});
jest.mock('./create-manifest', () => () => {});
jest.mock('./create-manifest/edit-manifest', () => () => {});
jest.mock('./processing', () => () => {});
jest.mock('./georeference', () => () => {});
jest.mock('./layers', () => () => {});
jest.mock('./levels', () => () => {});
jest.mock('components', () => ({ Route: () => {} }));

describe('routes', () => {
  it('should have required attributes', () => {
    routes.forEach(route => {
      expect(route.path).toBeDefined();
      expect(route.name).toBeDefined();
      expect(route.element).toBeDefined();
    });
  });
});