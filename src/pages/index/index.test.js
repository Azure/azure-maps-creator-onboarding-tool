import { screen, render, fireEvent } from '@testing-library/react';
import Index from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('Index', () => {
  it('should match snapshot', () => {
    const view = render(<Index />);
    expect(view).toMatchSnapshot();
  });

  it('should navigate to create manifest page', () => {
    render(<Index />);
    const button = screen.getByText('create');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenLastCalledWith('/create-manifest');
  });

  it('should navigate to edit manifest page', () => {
    render(<Index />);
    const button = screen.getByText('edit');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenLastCalledWith('/edit-manifest');
  });
});