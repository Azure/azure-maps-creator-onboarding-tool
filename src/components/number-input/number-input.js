import { useCallback, useEffect, useMemo, useState } from 'react';
import { TextField } from '@fluentui/react';
import PropTypes from 'prop-types';

import { inputStyles, inputStylesCentered } from './number-input.style';

const allowedKeys = ['Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Minus', 'Period'];
const enterKeyCode = 'Enter';
const decimalNumber = /^-?\d{1,}(\.\d{0,})?$/;

const NumberInput = ({ value, onChange, placeholder, onSubmit, max, min, className, ariaLabel, errorMessage, precision, align }) => {
  const positiveOnly = useMemo(() => min !== undefined && min >= 0, [min]);
  const [stringVal, setStringVal] = useState('');

  useEffect(() => {
    if (value !== null && value !== undefined) {
      setStringVal(value.toString());
    } else {
      setStringVal('');
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps -- only want this effect to run when value changes

  const updateStringValue = useCallback((e) => {
    const value = e.target.value;

    if (value === '' || (value === '-' && !positiveOnly)) {
      setStringVal(value);
      onChange(null);
      return;
    }

    const pattern = precision ? new RegExp(`^-?\\d{1,}(\\.\\d{0,${precision}})?$`) : decimalNumber;
    const num = parseFloat(value);

    if (isNaN(num) || !value.match(pattern)) {
      return;
    }
    if (max !== undefined && num > max) {
      return;
    }
    if (min !== undefined && num < min) {
      return;
    }

    setStringVal(value);
    onChange(num);
  }, [positiveOnly, min, max, onChange, precision]);

  const onKeyPress = useCallback((e) => {
    if (e.code === enterKeyCode && onSubmit) {
      onSubmit(e);
    }
    if (!allowedKeys.includes(e.code)) {
      e.preventDefault();
    }
  }, [onSubmit]);

  const fieldStyles = useMemo(() => {
    if (align === 'center') {
      return inputStylesCentered;
    }
    return inputStyles;
  }, [align]);

  return (
    <TextField value={stringVal} autoComplete='off' onKeyPress={onKeyPress} onChange={updateStringValue}
               placeholder={placeholder} className={className} styles={fieldStyles}
               ariaLabel={ariaLabel} errorMessage={errorMessage} />
  );
};

NumberInput.propTypes = {
  ariaLabel: PropTypes.string,
  align: PropTypes.oneOf(['default', 'center']),
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
  precision: PropTypes.number,
  value: PropTypes.number,
};

NumberInput.defaultProps = {
  align: 'default',
  errorMessage: '',
  value: null,
};

export default NumberInput;