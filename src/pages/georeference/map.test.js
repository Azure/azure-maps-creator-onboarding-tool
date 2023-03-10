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
  const geometryStore = useGeometryStore.getState();
  const spy = jest.spyOn(geometryStore, 'check');

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render map with multipolygon', () => {
    expect(spy).not.toHaveBeenCalled();
    const view = render(<Map exteriorCenter={exteriorCenter} dissolvedExterior={multiPolygon} {...defaultProps} />);
    expect(view).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
  });

  it('should render map with polygon', () => {
    expect(spy).not.toHaveBeenCalled();
    const view = render(<Map exteriorCenter={exteriorCenter} dissolvedExterior={polygon} {...defaultProps} />);
    expect(view).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
  });
});