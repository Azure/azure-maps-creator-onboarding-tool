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
  display: flex;
  gap: 0.5rem;
`;

export const iconStyle = css`
  color: ${color.gray};
  font-size: ${fontSize.xl};
  margin-right: 0.5rem;
`;

export const iconCompletedStyle = css`
  color: ${color.greenIcon};
`;

export const iconErrorStyle = css`
  color: ${color.redError};
`;

export const stepStyle = css`
  font-size: ${fontSize.md};
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: 0.3rem;
  transition: background 0.1s ease-in;
  &:hover {
    color: inherit;
    background-color: ${color.lightGray};
  }
`;

export const activeStepStyle = css`
  font-weight: ${fontWeight.semibold};
  &::after {
    position: absolute;
    content: '';
    display: block;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${color.accent.primary};
  }
`;

export const disabledStepStyle = css`
  border-bottom: none;
  opacity: 0.5;
  cursor: not-allowed;
`;
