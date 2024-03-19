import { render } from '@testing-library/react';

import { useGeometryStore } from 'common/store';
import Georeference from './georeference';

jest.mock('./checked-map', () => () => <div>it's map</div>);
jest.mock('hooks', () => ({
  useFeatureFlags: () => ({ isPlacesPreview: false }),
  useEventListener: () => {},
}));

describe('Georeference', () => {
  beforeEach(() => {
    useGeometryStore.setState({
      anchorPoint: {
        coordinates: [40, 60],
        angle: 89,
      },
    });
  });

  it('should render georeference page', () => {
    const view = render(<Georeference />);
    expect(view).toMatchSnapshot();
  });
});
