import { useCallback, useMemo } from 'react';
import { ActionButton } from '@fluentui/react';
import PropTypes from 'prop-types';
import { cx } from '@emotion/css';
import { Icon } from '@fluentui/react/lib/Icon';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useCompletedSteps } from 'common/store';
import { activeStepStyle, iconCompletedStyle, iconStyle, stepStyle } from './progress-bar.style';

const ProgressBarButton = ({ step }) => {
  const completedSteps = useCompletedSteps();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActiveStep = useMemo(() => (
    pathname === step.href
  ), [pathname, step]);
  const isCompletedStep = useMemo(() => (
    completedSteps.includes(step.key)
  ), [completedSteps, step]);
  const onClick = useCallback(() => {
    navigate(step.href);
  }, [navigate, step]);

  return (
    <ActionButton className={cx(stepStyle, { [activeStepStyle]: isActiveStep })}
                  key={step.key} disabled={isActiveStep} onClick={onClick}>
      <Icon iconName='SkypeCircleCheck' ariaLabel={t(step.name)}
            className={cx(iconStyle, { [iconCompletedStyle]: isCompletedStep })}
      />
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