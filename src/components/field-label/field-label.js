import { TooltipHost } from '@fluentui/react';
import { cx } from '@emotion/css';
import { Icon } from '@fluentui/react/lib/Icon';

import { labelStyle, requiredField, toolTipContainer } from './field-label.style';

export const FieldLabel = ({ children, className, required, tooltip }) => (
  <div className={cx(labelStyle, { [requiredField]: required }, className)}>
    {children}
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