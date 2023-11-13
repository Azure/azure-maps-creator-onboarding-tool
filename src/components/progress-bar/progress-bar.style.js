import { css } from '@emotion/css';

import { color, fontSize, fontWeight } from 'common/styles';

export const errorContainer = css`
  max-width: 31.25rem;
  margin: 0.9375rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const progressBarContainer = css`
  margin-bottom: 1rem;
`;

export const iconStyle = css`
  color: ${color.gray};
  font-size: ${fontSize.xl};
  margin-right: 0.5rem;
`;

export const iconCompletedStyle = css`
  color: ${color.green};
`;

export const iconErrorStyle = css`
  color: ${color.redError};
`;

export const stepStyle = css`
  font-size: ${fontSize.md};
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
  text-decoration: none;
  color: inherit;
  &:hover {
    color: inherit;
  }
`;

export const activeStepStyle = css`
  font-weight: ${fontWeight.semibold};
  border-bottom: 2px solid ${color.accent.primary};
`;
