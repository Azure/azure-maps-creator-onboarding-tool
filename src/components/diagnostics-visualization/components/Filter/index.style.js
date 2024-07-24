import { css } from '@emotion/css';

export const filterBarStyle = css`
  background: white;
  margin: 2px 15px 16px 11px;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const placeholderStyle = css`
  color: rgb(50, 49, 48);
`;

export const textBoxStyle = css`
  height: 1.5rem;
  width: 100%;
  border: 1px solid rgb(96, 94, 92);
`;

export const dropdownStyle = css`
  min-width: 160px;
  & > div {
    min-width: unset;
  }
`;
