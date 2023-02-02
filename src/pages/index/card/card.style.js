import { css } from '@emotion/css';

import { fontSize } from 'common/styles';

export const buttonStyle = css`
  margin: 0.5rem 0;
  font-size: ${fontSize.sm};
  height: 1.5rem;
  line-height: 1.5rem;
  min-width: auto;
`;

export const buttonLabelStyle = {
  label: {
    lineHeight: 'unset',
  },
};

export const imageStyle = css`
  margin: 0.75rem 0 1.125rem 0;
`;

export const paneStyle = css`
  flex-direction: column;
  max-width: 300px;
`;