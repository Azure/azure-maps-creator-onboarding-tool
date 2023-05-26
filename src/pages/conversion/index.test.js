import { render } from '@testing-library/react';

import Conversion from './index';

describe('Conversion', () => {
  it('should render component', () => {
    const view = render(<Conversion />);
    expect(view).toMatchSnapshot();
  });
});