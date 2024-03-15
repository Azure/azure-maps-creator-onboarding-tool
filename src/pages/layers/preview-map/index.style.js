import { css } from '@emotion/css';
import { color, fontSize, fontWeight } from 'common/styles';

export const previewContainerStyles = css`
  display: flex;
  flex-direction: column;
`;

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

export const previewDescription = css`
  margin-left: 0.4em;
  font-style: italic;
  color: ${color.shadow};
  font-size: 0.8rem;
`;

export const previewSelectTitle = css`
  // margin-bottom: 0.25rem;
`;

export const previewCanvas = css`
  cursor: grab;
  max-width: 100%;
  background-color: ${color.grayBg};
`;
