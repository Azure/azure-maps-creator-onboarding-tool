import { css, keyframes } from '@emotion/css';

import { color, fontSize, fontWeight } from 'common/styles';

export const container = css`
  display: flex;
  flex: 1;
  font-size: ${fontSize.sm};
  border-top: 1px solid ${color.gray};
`;

export const stepsContainer = css`
  width: 15rem;
  border-right: 1px solid ${color.gray};
  @media (max-width: 600px) {
    width: 9rem;
  }
`;

export const step = css`
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  cursor: pointer;
  border: none;
  width: 100%;
  
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

const spin = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`;

export const inProgressIcon = css`
  margin-right: 0.5rem;
  color: ${color.blueIcon};
  animation: ${spin} 2s linear infinite;
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

export const content = css`
  padding: 0 1rem;
  width: calc(100% - 18rem);
  @media (max-width: 600px) {
    width: calc(100% - 9rem);
  }
`;

export const logsContainer = css`
  overflow-x: auto;
`;

export const diagnosticDescription = css`
  margin: 0.5rem 0;
`;

export const mapContainer = css`
  width: 100%;
  height: 500px;
`;