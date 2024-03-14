import { css } from '@emotion/css';
import { color, fontSize } from 'common/styles';

export const fileContainer = css`
  border-bottom: 1px solid ${color.darkGray};
  margin-bottom: 1rem;
  &:last-child {
    border-bottom: none;
  }
`;

export const fieldsRow = css`
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
`;

export const fieldLabel = css`
  width: 15.625rem;
  display: flex;
`;

export const inputClass = css`
  width: 100%;
`;

export const inputStyles = {
  fieldGroup: [{ height: '1.5rem' }],
  field: [{ fontSize: fontSize.sm }],
};

export const readOnlyInput = {
  fieldGroup: [{ height: '1.5rem', borderColor: `${color.grayBorder}` }],
  field: [{ fontSize: fontSize.sm }],
};
