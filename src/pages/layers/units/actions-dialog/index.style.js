import { css } from '@emotion/css';
import { fontSize } from 'common/styles';

export const dialogStyle = css`
  border-radius: 2px !important;
`;

export const buttonStyle = css`
  height: 1.5rem;
  font-size: ${fontSize.sm};
`;

export const infoButtonStyle = css`
  ${buttonStyle}
  display: block;
  min-width: 0;
  padding: 0 0.5rem;
  span {
    width: 1.4rem;
  }
`;

export const exampleFileContentStyle = css`
  font-size: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  font-family: monospace;
  padding: 0.5rem 1rem;
  border-radius: 2px;
  background-color: #f9f9f9;
`;

export const bold = css`
  font-weight: bold;
`;

export const list = css`
  margin: 0.2rem 0 1rem;
`;
