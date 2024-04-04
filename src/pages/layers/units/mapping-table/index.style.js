import { css } from '@emotion/css';
import { color } from 'common/styles';

export const emptyTableContent = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
  color: ${color.granite};
  max-width: 360px;
  margin: 4rem auto;
  text-align: center;
`;

export const emptyTableIcon = css`
  font-size: 50px;
  line-height: 50px;
  color: ${color.darkGray};
`;
