import { css } from '@emotion/css';

import { color, fontSize } from 'common/styles';

export const labelStyle = css`
  height: 1.5rem;
  line-height: 1.5rem;
  min-width: 7rem;
  max-width: 15rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-size: ${fontSize.sm};
`;

export const requiredField = css`
  &:after {
    content: " *";
    color: ${color.darkRed};
    white-space: pre;
  }
`;