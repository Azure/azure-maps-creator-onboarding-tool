import { css } from '@emotion/css';

export const mapTextWrapper = css `
  display: flex;
  gap: 2rem;
`

export const imdfPreviewMapWrapper = css`
  position: relative;
  width: 100%;
  flex: 5 1 4rem;                              
`;

export const imdfPreviewMap = css`
  width: 100%;
  height: 30rem;
`;

export const layerSelect = css `
  position: relative;
  top: 65%;
`;

export const textWrapper = css `
  flex: 1 1 4rem; 
  position: relative;
  display: inline;
  margin-top: 1%;
`;

export const textArea = css `
  width: 95%;
  height: 95%;
  white-space: nowrap;
  resize: none;
`;

export const saveButtonWrapper = css `
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
