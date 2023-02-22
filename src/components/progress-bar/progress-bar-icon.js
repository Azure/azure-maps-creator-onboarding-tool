import PropTypes from 'prop-types';
import { cx } from '@emotion/css';
import { Icon } from '@fluentui/react/lib/Icon';

import { iconCompletedStyle, iconErrorStyle, iconStyle } from './progress-bar.style';
import { useProgressBarStore } from 'common/store';

const progressBarSelector = (s) => s.isErrorShown;

const ProgressBarIcon = ({isCompletedStep, label}) => {
  const isProgressBarErrorShown = useProgressBarStore(progressBarSelector);

  if (isProgressBarErrorShown && !isCompletedStep) {
    return (
      <Icon iconName='ErrorBadge' ariaLabel={label} className={cx(iconStyle, iconErrorStyle)} />
    );
  }

  return (
    <Icon iconName='SkypeCircleCheck' ariaLabel={label}
          className={cx(iconStyle, { [iconCompletedStyle]: isCompletedStep })}
    />
  );
};

ProgressBarIcon.propTypes = {
  isCompletedStep: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default ProgressBarIcon;