import { css } from '@emotion/css';

import { color, fontSize } from 'common/styles';

export const fieldLabelContainer = css`
  display: flex;
  align-items: center;
  font-size: ${fontSize.sm};
`;

export const labelStyle = css`
  height: 1.5rem;
  line-height: 1.5rem;
  max-width: 15rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

export const requiredField = css`
  &:after {
    content: " *";
    color: ${color.darkRed};
    white-space: pre;
  }
`;

export const toolTipContainer = css`
  cursor: pointer;
  margin-left: 5px;
  margin-top: 3px;
`;