import { render } from '@testing-library/react';
import { useResponseStore, LRO_STATUS } from 'common/store/response.store';

import Route from './route';

jest.mock('../bread-crumb-nav/bread-crumb-nav', () => () => <div>BreadCrumbNav</div>);
jest.mock('../footer/footer', () => () => <div>Footer</div>);
jest.mock('../top-bar/top-bar', () => () => <div>TopBar</div>);
jest.mock('../progress-bar/progress-bar', () => () => <div>ProgressBar</div>);

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Route', () => {
  it('should render route', () => {
    const view = render(<Route title='Route 66' component={() => <div>My awesome component</div>} />);
    expect(view).toMatchSnapshot();
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
  });

  it('should redirect when data is required but not provided', () => {
    render(<Route title='Route 66' dataRequired component={() => <div>My awesome component</div>} />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should not redirect when data is required and is provided', () => {
    useResponseStore.setState({
      lroStatus: LRO_STATUS.SUCCEEDED,
    });
    render(<Route title='Route 66' dataRequired component={() => <div>My awesome component</div>} />);
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
  });
});