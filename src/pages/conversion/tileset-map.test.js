import { render } from '@testing-library/react';
import * as azMapsControl from 'azure-maps-control';
import TilesetMap from './tileset-map';

jest.mock('azure-maps-control', () => ({
  control: {
    StyleControl: function() {},
    ZoomControl: function() {},
  },
  Map: jest.fn(),
}));
jest.mock('common/store', () => ({
  useUserStore: () => ['US', 'key-subscription'],
}));

describe('Tileset map', () => {
  beforeEach(() => {
    azMapsControl.Map.mockImplementation(() => ({
      controls: {
        add: () => {},
      }
    }));
  });
  it('should render map', () => {
    render(<TilesetMap mapConfigurationId='map-config-id' bbox={[0, 1, 2, 3]} />);
    const constructorSpy = jest.spyOn(azMapsControl, 'Map');
    expect(constructorSpy).toBeCalledWith(
      'azure-maps-container',
      {
        bounds: [0, 1, 2, 3],
        domain: 'https://us.atlas.microsoft.com',
        language: 'en-US',
        mapConfiguration: 'map-config-id',
        staticAssetsDomain: 'https://us.atlas.microsoft.com',
        styleAPIVersion: '2023-03-01-preview',
        subscriptionKey: 'key-subscription',
      });
  });
});