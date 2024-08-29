import { render } from '@testing-library/react';
import * as azMapsControl from 'azure-maps-control';
import TilesetMap from './tileset-map';

jest.mock('azure-maps-control', () => ({
  control: {
    StyleControl: function () {},
    ZoomControl: function () {},
  },
  Map: jest.fn(),
}));
jest.mock('common/store', () => ({
  useConversionStore: () => ['map-config-id', [0, 1, 2, 3]],
  useUserStore: () => ['US', 'key-subscription'],
  getDomain: () => 'us.atlas.microsoft.com',
}));

describe('Tileset map', () => {
  beforeEach(() => {
    azMapsControl.Map.mockImplementation(() => ({
      controls: {
        add: () => {},
      },
      events: {
        add: () => {},
      },
    }));
  });
  it('should render map', () => {
    render(<TilesetMap />);
    const constructorSpy = jest.spyOn(azMapsControl, 'Map');
    expect(constructorSpy).toBeCalledWith('azure-maps-container', {
      bounds: [0, 1, 2, 3],
      domain: 'us.atlas.microsoft.com',
      language: 'en-US',
      mapConfiguration: 'map-config-id',
      staticAssetsDomain: 'us.atlas.microsoft.com',
      styleAPIVersion: '2023-03-01-preview',
      subscriptionKey: 'key-subscription',
    });
  });
});
