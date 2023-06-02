import { useCallback, useState, useEffect, useRef } from 'react';
import { cx } from '@emotion/css';
import { shallow } from 'zustand/shallow';

import { selectedStep as selectedStepStyle, step as stepStyle, stepTimer, stepTitle } from './style';
import Icon from './icon';
import { useConversionStore } from 'common/store';
import { formatProgressTime } from './format-time';

const conversionStoreSelector = (s) => [s.setStep, s.selectedStep];

const StepButton = ({ endTime, label, status, startTime, step, title }) => {
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
    <button className={cx(stepStyle, { [selectedStepStyle]: selectedStep === step })} onClick={onClick}
            aria-label={label}>
      <div className={stepTitle}>
        <Icon status={status} />
        {title}
      </div>
      <span className={stepTimer}>{elapsedTime}</span>
    </button>
  );
};

export default StepButton;