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
  bottom: -55%;
`;


export const textWrapper = css `
  flex: 1 1 5rem; 
  position: relative;
  display: inline;
`;

export const toolbar = css `
  backgroundColor: #f0f0f0,
  border: 2px solid #0078d4,
  color: #0078d4,
  cursor: not-allowed,
  pointerEvents: none
`;

export const buttonStyle = css `
  color: #323130;
  fill: #323130;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.16) 0 0 4px;
  background-size: 12px 12px;
  position: relative;
  user-select: none;
  margin: 0;
  padding: 0;
  border: none;
  border-collapse: collapse;
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  text-align: center;
  cursor: pointer;
  line-height: 32px;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;

  &:hover {
    color: #31acce;
  }

  &:disabled,
  buttonStyle[disabled]{
  background-color: #e5e5e5;
  color: #6c757d;
  cursor: not-allowed;
  }
`;

export const undoStyle = css `
  position: absolute;
  right: 1%;
  bottom: 20%;
  z-index: 2;
`;

