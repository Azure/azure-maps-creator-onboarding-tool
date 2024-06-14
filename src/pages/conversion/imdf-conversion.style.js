import { css } from '@emotion/css';

export const actionButtonsWrapper = css`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;

export const actionButtonsLeft = css`
  display: flex;
  gap: 1rem;
`;

export const actionButtonsRight = css`
  ${actionButtonsLeft}
`;

export const messageWrapper = css`
  margin-top: 1rem;
  max-width: 40rem;
`;
