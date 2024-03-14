import { css } from '@emotion/css';
import { render, screen } from '@testing-library/react';

import FieldLabel from './field-label';

const myClassName = css`
  color: red;
`;

describe('FieldLabel', () => {
  it('should render default', () => {
    const view = render(
      <FieldLabel>The oldest "your mom" joke was discovered on a 3,500-year-old Babylonian tablet.</FieldLabel>
    );
    expect(view).toMatchSnapshot();
  });

  it('should attach passed classname', () => {
    render(
      <FieldLabel data-testid="field-label" className={myClassName}>
        Cherophobia is the irrational fear of fun or happiness.
      </FieldLabel>
    );
    const elem = screen.getByTestId('field-label');
    expect(elem).toHaveStyle('color: red;');
  });
});
