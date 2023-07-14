import { useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { cx } from '@emotion/css';
import { shallow } from 'zustand/shallow';

import { enabledStep, selectedStep as selectedStepStyle, step as stepStyle, stepTimer, stepTitle } from './style';
import Icon from './icon';
import { useConversionStore } from 'common/store';
import { formatProgressTime } from './format-time';

const conversionStoreSelector = (s) => [s.setStep, s.selectedStep];

const StepButton = ({ endTime, label, status, startTime, step, title, disabled }) => {
  const [elapsedTime, setElapsedTime] = useState('');
  const intervalRef = useRef(null);
  const [setStep, selectedStep] = useConversionStore(conversionStoreSelector, shallow);

  useEffect(() => {
    if (startTime !== null && endTime !== null) {
      setElapsedTime(formatProgressTime(startTime, endTime));
      clearInterval(intervalRef.current);
    } else if (startTime !== null && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(formatProgressTime(startTime, endTime));
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [startTime, endTime]);

  const onClick = useCallback(() => setStep(step), [setStep, step]);

  return (
    <button className={cx(stepStyle, { [selectedStepStyle]: selectedStep === step, [enabledStep]: !disabled })}
            onClick={onClick} aria-label={label} disabled={disabled}>
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