import { css } from '@emotion/css';
import { fontSize, fontWeight } from 'common/styles';

export const buttonStyle = css`
  height: 1.5rem;
  font-weight: ${fontWeight.semibold};
  font-size: ${fontSize.md};

  i {
    margin-right: 0.5rem;
    font-size: 12px;
  }
`;
