import { css, keyframes } from '@emotion/css';

import { color, fontSize, fontWeight } from 'common/styles';

export const container = css`
  position: fixed;
  top: 5.5rem;
  height: calc(100% - 5.5rem - 2px);
  width: calc(100% - 2.5rem);
  left: 1.25rem;
  display: flex;
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
  border: none;
  width: 100%;
`;

export const enabledStep = css`
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
  line-height: ${fontSize.xxs};
`;

export const content = css`
  padding: 0 1rem;
  overflow: auto;
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
  height: 100%;
`;

export const contentContainer = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const metaInfoContainer = css`
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

export const logContainer = css`
  overflow: auto;
`;

export const downloadLogsContainer = css`
  margin: 1rem 0;
`;

export const logsButton = css`
  padding: 0 1.5rem;
  height: 1.75rem;
  margin: 1rem 0;
`;

export const failedLogsButton = css`
  border-color: #d61d28;
  background-color: #d61d28;

  &:hover {
    background-color: #c11b26;
    border-color: #c11b26;
  }
  &:active {
    background-color: #ab1822;
    border-color: #ab1822;
  }
`;

export const boldHeader = css`
  font-weight: 600;
`;

export const copyIcon = css`
  opacity: 0.5;
  font-size: ${fontSize.xs};
  cursor: pointer;
  margin: 0 0.5rem;
  &:hover {
    opacity: 0.75;
  }
`;
