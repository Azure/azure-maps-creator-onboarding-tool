import { css, keyframes } from '@emotion/css';

import { color, fontSize } from 'common/styles';

export const crossIcon = css`
  color: ${color.redError};
`;

export const checkIcon = css`
  color: ${color.greenIcon};
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const inProgressIcon = css`
  color: ${color.blueIcon};
  animation: ${spin} 2s linear infinite;
`;

export const iconsContainer = css`
  display: flex;
  gap: 2px;
`;

export const nameFilterContainer = css`
  width: 300px;
  margin-top: 1rem;
  border-color: red;
`;

export const filterInputStyles = {
  fieldGroup: [
    {
      height: '1.5rem',
      borderColor: color.grayBorder,
    },
  ],
  field: [
    {
      fontSize: fontSize.sm,
    },
  ],
};
