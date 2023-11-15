import { css } from '@emotion/css';

export const routeStyle = css`
  margin: 0.5rem 1.25rem 0 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const footerPadding = css`
  padding-bottom: 4rem; // this was added to make sure footer never overlaps content, especially on small mobile screens
`;
