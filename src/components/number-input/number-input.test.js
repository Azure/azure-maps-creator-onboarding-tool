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
  precision: 8,
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

  it('should allow value with leading plus', () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByPlaceholderText(defaultProps.placeholder);
    fireEvent.change(input, {
      target: {
        value: '+111',
      },
    });
    expect(defaultProps.onChange).toHaveBeenLastCalledWith(111);
  });

  it('should allow value with many decimals and truncate if needed', () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByPlaceholderText(defaultProps.placeholder);
    fireEvent.change(input, {
      target: {
        value: '55.123456789',
      },
    });
    expect(defaultProps.onChange).toHaveBeenLastCalledWith(55.12345678);

    fireEvent.change(input, {
      target: {
        value: '55.756192864197834619823746114916348971623498',
      },
    });
    expect(defaultProps.onChange).toHaveBeenLastCalledWith(55.75619286);

    fireEvent.change(input, {
      target: {
        value: '55.1234',
      },
    });
    expect(defaultProps.onChange).toHaveBeenLastCalledWith(55.1234);
  });
});