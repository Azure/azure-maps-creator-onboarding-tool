import { render } from '@testing-library/react';
import { LRO_STATUS, useResponseStore } from 'common/store/response.store';

import Route from './route';

jest.mock('../bread-crumb-nav/bread-crumb-nav', () => () => <div>BreadCrumbNav</div>);
jest.mock('../footer/footer', () => () => <div>Footer</div>);
jest.mock('../top-bar/top-bar', () => () => <div>TopBar</div>);
jest.mock('../progress-bar/progress-bar', () => () => <div>ProgressBar</div>);

const mockNavigate = jest.fn();
let mockPathname = '/';

jest.mock('hooks', () => ({
  useCustomNavigate: () => mockNavigate,
  useFeatureFlags: () => ({ isPlacesPreview: false }),
}));
jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

describe('Route', () => {
  beforeEach(() => {
    mockPathname = '/';
  });

  it('should render route', () => {
    const view = render(<Route title="Route 66" component={() => <div>My awesome component</div>} />);
    expect(view).toMatchSnapshot();
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
  });

  it('should render route with footerPadding', () => {
    mockPathname = '/layers';
    const view = render(<Route title="Route 66" component={() => <div>My awesome component</div>} />);
    expect(view).toMatchSnapshot();
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
  });

  it('should redirect when data is required but not provided', () => {
    render(<Route title="Route 66" dataRequired component={() => <div>My awesome component</div>} />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should not redirect when data is required and is provided', () => {
    useResponseStore.setState({
      lroStatus: LRO_STATUS.SUCCEEDED,
    });
    render(<Route title="Route 66" dataRequired component={() => <div>My awesome component</div>} />);
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
  });
});
