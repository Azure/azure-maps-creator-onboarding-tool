import { css, keyframes } from '@emotion/css';

import { color } from 'common/styles';

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