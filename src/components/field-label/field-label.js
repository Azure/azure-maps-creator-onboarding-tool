import { TooltipHost } from '@fluentui/react';
import { cx } from '@emotion/css';
import { Icon } from '@fluentui/react/lib/Icon';

import { fieldLabelContainer, labelStyle, requiredField, toolTipContainer } from './field-label.style';

export const FieldLabel = ({ children, className, required, tooltip }) => (
  <div className={fieldLabelContainer}>
    <div className={cx(labelStyle, { [requiredField]: required }, className)}>
      {children}
    </div>
    {tooltip && (
      <span className={toolTipContainer}>
        <TooltipHost content={tooltip}>
          <Icon aria-label='Tooltip' iconName='Info' />
        </TooltipHost>
      </span>
    )}
  </div>
);

export default FieldLabel;