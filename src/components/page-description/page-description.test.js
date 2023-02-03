import { render } from '@testing-library/react';

import PageDescription from './page-description';

// added this mock cause for some reason MessageBar component was not rendering in the snapshot correctly
jest.mock('@fluentui/react', () => ({
  MessageBarType: {
    info: 'info-type',
  },
  MessageBar: (props) => JSON.stringify(props),
}));

describe('PageDescription', () => {
  it('should render component', () => {
    const view = render(<PageDescription description='Before the invention of color TV, 75% of people said they dreamed in black and white. Today, only 12% do.' />);
    expect(view).toMatchSnapshot();
  });
});