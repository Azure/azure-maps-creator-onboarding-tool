import { css } from '@emotion/css';

import { color, fontSize, fontWeight } from 'common/styles';

export const conversionContainer = css`
  display: flex;
  flex: 1;
  font-size: ${fontSize.sm};
  border-top: 1px solid ${color.gray};
`;

export const stepsContainer = css`
  width: 15rem;
  border-right: 1px solid ${color.gray};
`;

export const step = css`
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  cursor: pointer;
  
  &:hover {
    color: ${color.accent.primary};
    background-color: ${color.lightGray};
  }
`;

export const selectedStep = css`
  background-color: ${color.gray};
  font-weight: ${fontWeight.bold};
`;

export const stepTitle = css`
  display: flex;
  align-items: center;
`;

export const successIcon = css`
  margin-right: 0.5rem;
  color: ${color.greenIcon};
`;

export const inProgressIcon = css`
  margin-right: 0.5rem;
  color: ${color.blueIcon};
`;

export const defaultIcon = css`
  margin-right: 0.5rem;
`;

export const failedIcon = css`
  margin-right: 0.5rem;
  color: ${color.redError};
`;

export const stepTimer = css`
  color: ${color.granite};
  font-size: ${fontSize.xxs};
`;

export const logsContainer = css`
  padding: 0 1rem;
`;