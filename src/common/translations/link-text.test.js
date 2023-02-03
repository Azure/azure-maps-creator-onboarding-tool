import { render } from '@testing-library/react';

import LinkText from './link-text';

describe('LinkText', () => {
  it('should render component', () => {
    const view = render(<LinkText href='https://www.pure-truth.com/'>I am a nobody. Nobody is perfect. Therefore, I am perfect.</LinkText>);
    expect(view.container).toMatchSnapshot();
  });
});