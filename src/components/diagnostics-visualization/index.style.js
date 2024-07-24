import { css } from '@emotion/css';

export const diagnosticVisualizationWrapper = css`
  z-index: 1;
  display: flex;
  height: 100%;
  width: 100%;
`;

export const mapWrapper = css`
  flex: 1 1 50%;

  height: 100%;
  background: #e9ebee;
`;

export const contentWrapper = css`
  flex: 1 1 50%;
  overflow: hidden;
`;
