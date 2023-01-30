import { fireEvent, render, screen } from '@testing-library/react';

import { ProgressBar } from './progress-bar';

const mockNavigate = jest.fn();
let mockCurrentPath;

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: mockCurrentPath,
  }),
  useNavigate: () => mockNavigate,
}));

describe('Progress Bar component', () => {
  beforeEach(() => {
    mockCurrentPath = '/levels';
  });

  it('should not render component', () => {
    mockCurrentPath = '/another/one/bites/the/dust';
    const view = render(<ProgressBar />);
    expect(view).toMatchSnapshot();
  });

  it('should render component', () => {
    const view = render(<ProgressBar />);
    expect(view).toMatchSnapshot();
  });

  it('should navigate to /layers when button is clicked', () => {
    render(<ProgressBar />);
    const button = screen.getByText('dwg.layers');

    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/layers');
  });
});