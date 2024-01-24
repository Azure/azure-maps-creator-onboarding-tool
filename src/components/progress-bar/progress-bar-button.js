import { cx } from '@emotion/css';
import { ActionButton } from '@fluentui/react';
import { useCompletedSteps } from 'common/store';
import { useCustomNavigate } from 'hooks';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ProgressBarIcon from './progress-bar-icon';
import { activeStepStyle, disabledStepStyle, stepStyle } from './progress-bar.style';

const ProgressBarButton = ({ step }) => {
  const completedSteps = useCompletedSteps();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useCustomNavigate();

  const isActiveStep = useMemo(() => pathname === step.href, [pathname, step]);
  const isCompletedStep = useMemo(() => completedSteps.includes(step.key), [completedSteps, step]);
  const isDisabledStep = step.disabled;

  const onClick = useCallback(() => {
    navigate(step.href);
  }, [navigate, step]);

  return (
    <ActionButton
      className={cx(stepStyle, { [activeStepStyle]: isActiveStep, [disabledStepStyle]: isDisabledStep })}
      key={step.key}
      disabled={isActiveStep || isDisabledStep}
      onClick={onClick}
    >
      <ProgressBarIcon label={t(step.name)} isCompletedStep={isCompletedStep} iconName={step.icon} />
      {t(step.name)}
    </ActionButton>
  );
};

ProgressBarButton.propTypes = {
  step: PropTypes.shape({
    href: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProgressBarButton;
