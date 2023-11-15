import { css } from '@emotion/css';

import { color, fontSize } from 'common/styles';

export const footerContainerStyle = css`
  position: fixed;
  width: 100%;
  bottom: 0;
  border-top: 1px solid ${color.darkGray};
  background-color: white;
  padding: 1rem 1.25rem;
`;

export const buttonStyle = css`
  margin-right: 0.625rem;
  height: 1.5rem;
  font-size: ${fontSize.sm};
`;
