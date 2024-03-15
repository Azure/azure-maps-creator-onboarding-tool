import { css } from '@emotion/css';

export const classPanel = css`
  margin: 2rem 0 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

export const panelHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const panelTitle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const previewTag = css`
  background-color: #f4f4f4;
  color: #525252;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.6rem;
  text-transform: uppercase;
`;

export const addInput = css`
  display: flex;
  gap: 4px;
`;

export const mutedText = css`
  color: #777;
  margin-top: 1rem;
`;
