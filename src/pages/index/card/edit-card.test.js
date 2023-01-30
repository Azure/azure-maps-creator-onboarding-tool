import { fireEvent, render, screen } from '@testing-library/react';

import EditCard from './edit-card';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Edit Card', () => {
  it('should render component', () => {
    const view = render(<EditCard />);
    expect(view).toMatchSnapshot();
  });

  it('should navigate to edit manifest page', () => {
    render(<EditCard />);
    const button = screen.getByText('edit');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenLastCalledWith('/edit-manifest');
  });
});