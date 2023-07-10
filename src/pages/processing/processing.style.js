import { css } from '@emotion/css';

export const containerStyle = css`
  position: fixed;
  width: 100%;
  align-self: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const progressIndicatorStyles = css`
  display: block;
  min-width: min(500px, 90%);
  max-width: 500px;
`;

export const progressIndicatorLabel = {
  itemName: {
    whiteSpace: 'normal',
  },
};