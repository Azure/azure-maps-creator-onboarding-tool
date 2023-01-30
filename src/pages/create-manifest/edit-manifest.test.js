import { render } from '@testing-library/react';

import EditManifest from './edit-manifest';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('EditManifest', () => {
  it('should render component', () => {
    const view = render(<EditManifest />);
    expect(view).toMatchSnapshot();
  });
});