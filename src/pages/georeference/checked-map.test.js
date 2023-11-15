import { render } from '@testing-library/react';

import CheckedMap from './checked-map';
import { useLayersStore } from 'common/store';
import { mockPolygonLayers } from 'common/store/geometry.store.mock';

describe('CheckedMap', () => {
  it('should render nothing', () => {
    const view = render(<CheckedMap />);
    expect(view).toMatchSnapshot();
  });

  it('should render map', () => {
    useLayersStore.setState({
      polygonLayers: mockPolygonLayers,
      layers: [{ id: 0, value: ['OUTLINE'] }],
    });
    const view = render(<CheckedMap />);
    expect(view).toMatchSnapshot();
  });
});
