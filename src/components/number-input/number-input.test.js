import { fireEvent, render, screen } from '@testing-library/react';

import NumberInput from './number-input';

const defaultProps = {
  onChange: jest.fn(),
  value: 123,
  placeholder: 'hola',
  onKeyPress: () => {},
  max: 150,
  min: 50,
  className: 'qwe',
};

describe('Number input component', () => {
  it('should render component', () => {
    const view = render(<NumberInput {...defaultProps} />);
    expect(view).toMatchSnapshot();
  });

  it('should only allow numbers', async () => {
    render(<NumberInput {...defaultProps} />);
    const input = await screen.findByPlaceholderText(defaultProps.placeholder);
    expect(input.value).toBe('123');

    fireEvent.change(input, {
      target: {
        value: 'qwe',
      },
    });
    fireEvent.change(input, {
      target: {
        value: '123qwe',
      },
    });
    fireEvent.change(input, {
      target: {
        value: Infinity,
      },
    });
    fireEvent.change(input, {
      target: {
        value: '123,123',
      },
    });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });
});