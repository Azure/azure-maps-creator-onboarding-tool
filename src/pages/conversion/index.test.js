import { render } from '@testing-library/react';

import Conversion from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Conversion', () => {
  it('should render component', () => {
    const view = render(<Conversion />);
    expect(view).toMatchSnapshot();
  });
});