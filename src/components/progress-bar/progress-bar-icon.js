import { cx } from '@emotion/css';
import { Icon } from '@fluentui/react/lib/Icon';
import { useProgressBarStore } from 'common/store';
import PropTypes from 'prop-types';
import { iconCompletedStyle, iconErrorStyle, iconStyle } from './progress-bar.style';

const progressBarSelector = s => s.isMissingDataErrorShown;

const ProgressBarIcon = ({ isCompletedStep, label, iconName }) => {
  const isProgressBarErrorShown = useProgressBarStore(progressBarSelector);

  if (isProgressBarErrorShown && !isCompletedStep) {
    return <Icon iconName={iconName ?? 'ErrorBadge'} ariaLabel={label} className={cx(iconStyle, iconErrorStyle)} />;
  }

  return (
    <Icon
      iconName={iconName ?? 'SkypeCircleCheck'}
      ariaLabel={label}
      className={cx(iconStyle, { [iconCompletedStyle]: isCompletedStep })}
    />
  );
};

ProgressBarIcon.propTypes = {
  isCompletedStep: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default ProgressBarIcon;
