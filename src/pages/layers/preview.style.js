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
  margin-bottom: 1rem;
  gap: 1rem;
  width: 100%;
`;

export const previewDropdownStyles = {
  ...dropdownStyles,
  root: {
    maxWidth: '15rem',
  },
};

export const previewSelectContainer = css`
  width: 50%;
`;