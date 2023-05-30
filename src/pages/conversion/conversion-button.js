import { useCallback, useState, useEffect } from 'react';
import { cx } from '@emotion/css';
import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { selectedStep as selectedStepStyle, step, stepTimer, stepTitle } from './style';
import Icon from './icon';
import { useConversionStore, conversionSteps } from 'common/store';
import { formatProgressTime } from './format-time';

const conversionStoreSelector = (s) => [s.conversionStepStatus, s.conversionStartTime, s.conversionEndTime, s.setStep, s.selectedStep];
let intervalId = null;

const ConversionButton = () => {
  const { t } = useTranslation();
  const [elapsedTime, setElapsedTime] = useState('');
  const [status, startTime, endTime, setStep, selectedStep] = useConversionStore(conversionStoreSelector, shallow);

  useEffect(() => {
    if (startTime !== null && endTime !== null) {
      setElapsedTime(formatProgressTime(startTime, endTime));
      clearInterval(intervalId);
    } else if (startTime !== null && intervalId === null) {
      intervalId = setInterval(() => {
        setElapsedTime(formatProgressTime(startTime, endTime));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [startTime, endTime]);

  const onClick = useCallback(() => setStep(conversionSteps.conversion), [setStep]);

  return (
    <button className={cx(step, { [selectedStepStyle]: selectedStep === conversionSteps.conversion })} onClick={onClick}
            aria-label={t('select.conversion.step')}>
      <div className={stepTitle}>
        <Icon status={status} />
        {t('package.conversion')}
      </div>
      <span className={stepTimer}>{elapsedTime}</span>
    </button>
  );
};

export default ConversionButton;