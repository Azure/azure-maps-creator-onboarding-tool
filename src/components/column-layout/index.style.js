import { css } from '@emotion/css';

export const columnLayout = css`
  display: flex;
  gap: 2rem;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

export const columnLayoutInRows = css`
  flex-direction: column;
`;

export const columnLayoutItem = css`
  flex: 1;
  max-width: 40rem;

  @media (max-width: 1200px) {
    max-width: unset;
  }
`;
