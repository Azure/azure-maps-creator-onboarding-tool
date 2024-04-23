import { css } from '@emotion/css';
import { color } from 'common/styles';

export const previewCanvas = css`
  cursor: grab;
  max-width: 100%;
  background-color: ${color.grayBg};
`;

export const previewContainerStyles = css`
  display: flex;
  flex-direction: column;
`;
