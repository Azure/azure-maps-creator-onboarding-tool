import { css } from '@emotion/css';
import { fontSize, fontWeight } from 'common/styles';

export const dropdownContainer = css`
  display: flex;
  font-size: ${fontSize.sm};
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

export const previewDropdownStyles = css`
  width: calc((516px - 1rem) / 2);
`;

export const selectContainer = css`
  display: flex;
  gap: 0.25rem;
  flex-direction: column;
`;

export const inlineSelectContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

export const previewTitleWrapper = css`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const previewTitle = css`
  font-weight: ${fontWeight.semibold};
`;
