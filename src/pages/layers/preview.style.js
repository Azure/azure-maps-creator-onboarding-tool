import { css } from '@emotion/css';

import { dropdownStyles } from './layers.style';
import { fontSize } from 'common/styles';

export const previewContainerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 100%;
`;

export const dropdownContainer = css`
  display: flex;
  font-size: ${fontSize.sm};
  align-items: center;
  height: 1.5rem;
  margin-bottom: 1rem;
  gap: 1rem;
`;

export const previewDropdownStyles = {
  ...dropdownStyles,
  root: {
    width: '15rem',
  },
};