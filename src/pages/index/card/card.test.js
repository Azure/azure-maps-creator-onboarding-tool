import { render } from '@testing-library/react';

import Card from './card';

jest.mock('./create-card', () => () => <div>Create Card</div>);
jest.mock('./edit-card', () => () => <div>Edit Card</div>);

describe('Card', () => {
  it('should render create card', () => {
    const view = render(<Card type='create' />);
    expect(view).toMatchSnapshot();
  });

  it('should render edit card', () => {
    const view = render(<Card type='edit' />);
    expect(view).toMatchSnapshot();
  });
});