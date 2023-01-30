import { render } from '@testing-library/react';

import FieldError from './field-error';

describe('Field Error', () => {
  it('should render nothing when text is not provided', () => {
    const view = render(<FieldError />);
    expect(view.container).toBeEmptyDOMElement();
  });

  it('should render nothing when text is empty', () => {
    const view = render(<FieldError text={''} />);
    expect(view.container).toBeEmptyDOMElement();
  });

  it('should render component when text is provided', () => {
    const view = render(<FieldError text={'Sweden has 267,570 islands, the most of any country in the world.'} />);
    expect(view.container).toMatchSnapshot();
  });
});