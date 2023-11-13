import { Icon } from '@fluentui/react/lib/Icon';

import { errorContainer, fieldErrorIconStyle } from './field-error.style';

const FieldError = ({ text }) => {
  if (!text) {
    return null;
  }
  return (
    <span className={errorContainer}>
      <Icon iconName='StatusErrorFull' className={fieldErrorIconStyle} />
      {text}
    </span>
  );
};

export default FieldError;
