import { cx } from '@emotion/css';

import { labelStyle, requiredField } from './field-label.style';

export const FieldLabel = ({ children, className, required }) => (
  <div className={cx(labelStyle, { [requiredField]: required }, className)}>
    {children}
  </div>
);

export default FieldLabel;