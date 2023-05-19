import { render } from '@testing-library/react';

import Conversion from './conversion';

describe('Conversion', () => {
  it('should render component', () => {
    const view = render(<Conversion />);
    expect(view).toMatchSnapshot();
  });
});