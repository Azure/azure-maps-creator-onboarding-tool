import { render } from '@testing-library/react';

import Conversion from './index';

const mockNavigate = jest.fn();

jest.mock('hooks', () => ({
  useCustomNavigate: () => mockNavigate,
  useFeatureFlags: () => ({ isPlacesPreview: false }),
}));

describe('Conversion', () => {
  it('should render component', () => {
    const view = render(<Conversion />);
    expect(view).toMatchSnapshot();
  });
});
