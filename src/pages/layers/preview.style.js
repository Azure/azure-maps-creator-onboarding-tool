import { css } from '@emotion/css';

import { dropdownStyles } from './layers.style';
import { fontSize, fontWeight } from 'common/styles';

export const previewContainerStyles = css`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: 500px;
`;

export const dropdownContainer = css`
  display: flex;
  font-size: ${fontSize.sm};
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  width: 100%;
`;

export const previewDropdownStyles = css`
  ${dropdownStyles};
  max-width: 15rem;
`;

export const previewSelectContainer = css`
  width: calc(50% - 0.5rem);
`;

export const previewTitle = css`
  font-weight: ${fontWeight.semibold};
  margin-bottom: 0.5rem;
`;

export const previewSelectTitle = css`
  margin-bottom: 0.25rem;
`;
