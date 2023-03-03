import { render } from '@testing-library/react';

import { useGeometryStore } from 'common/store';
import Map from './map';
import { multiPolygon, polygon } from './georeference.mock';

const exteriorCenter = [12, 21];

const defaultProps = {
  anchorPointHeading: 54,
  anchorPointDistance: 113,
};

describe('Map', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render map with multipolygon', () => {
    const view = render(<Map exteriorCenter={exteriorCenter} dissolvedExterior={multiPolygon} {...defaultProps} />);
    expect(view).toMatchSnapshot();
  });

  it('should render map with polygon', () => {
    const view = render(<Map exteriorCenter={exteriorCenter} dissolvedExterior={polygon} {...defaultProps} />);
    expect(view).toMatchSnapshot();
  });
});