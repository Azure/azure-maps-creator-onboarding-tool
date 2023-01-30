import { fireEvent, render, screen } from '@testing-library/react';

import CreateCard from './create-card';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Create Card', () => {
  it('should render component', () => {
    const view = render(<CreateCard />);
    expect(view).toMatchSnapshot();
  });

  it('should navigate to create manifest page', () => {
    render(<CreateCard />);
    const button = screen.getByText('create');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenLastCalledWith('/create-manifest');
  });
});