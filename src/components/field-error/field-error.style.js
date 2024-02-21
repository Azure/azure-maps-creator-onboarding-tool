import { css } from '@emotion/css';
import { color, fontSize } from 'common/styles';

export const errorContainer = css`
  display: flex;
  align-items: center;
  font-size: ${fontSize.sm};
  color: ${color.redError};
`;

export const fieldErrorIconStyle = css`
  margin-right: 0.25rem;
  font-size: ${fontSize.sm};
`;
