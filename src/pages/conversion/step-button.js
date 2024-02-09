import { cx } from '@emotion/css';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatProgressTime } from './format-time';
import Icon from './icon';
import { enabledStep, selectedStep as selectedStepStyle, step as stepStyle, stepTimer, stepTitle } from './style';

const StepButton = props => {
  const { endTime, label, status, startTime, step, title, disabled, setStep, selectedStep } = props;

  const [elapsedTime, setElapsedTime] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    const clearTimer = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    if (startTime === null) {
      setElapsedTime('');
    } else if (startTime !== null && endTime !== null) {
      setElapsedTime(formatProgressTime(startTime, endTime));
      clearTimer();
    } else if (startTime !== null && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(formatProgressTime(startTime, endTime));
      }, 1000);
    }

    return () => clearTimer();
  }, [startTime, endTime]);

  const onClick = useCallback(() => setStep(step), [setStep, step]);

  return (
    <button
      className={cx(stepStyle, { [selectedStepStyle]: selectedStep === step, [enabledStep]: !disabled })}
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      <div className={stepTitle}>
        <Icon status={status} />
        {title}
      </div>
      <span className={stepTimer}>{elapsedTime}</span>
    </button>
  );
};

StepButton.propTypes = {
  endTime: PropTypes.number,
  label: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  startTime: PropTypes.number,
  step: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

StepButton.defaultProps = {
  endTime: null,
  startTime: null,
  disabled: false,
};

export default StepButton;
