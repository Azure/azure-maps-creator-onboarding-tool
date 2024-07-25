import { css } from '@emotion/css';

export const layerSelectorWrapper = css`
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 0.5rem;
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

export const buttonStyle = css`
  color: #47494b;
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
`;

export const selectedButtonStyle = css`
  background-color: #f0f0f0;
  color: #31acce;
`;


