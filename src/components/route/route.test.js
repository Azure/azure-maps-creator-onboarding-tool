import { render } from '@testing-library/react';

import Route from './route';

jest.mock('../bread-crumb-nav/bread-crumb-nav', () => () => <div>BreadCrumbNav</div>);
jest.mock('../footer/footer', () => () => <div>Footer</div>);
jest.mock('../top-bar/top-bar', () => () => <div>TopBar</div>);
jest.mock('../progress-bar/progress-bar', () => () => <div>ProgressBar</div>);
jest.mock('../review-manifest/', () => () => <div>ReviewManifestPane</div>);

describe('Route', () => {
  it('should render route', () => {
    const view = render(<Route title='Route 66' component={() => <div>My awesome component</div>} />);
    expect(view).toMatchSnapshot();
  });
});