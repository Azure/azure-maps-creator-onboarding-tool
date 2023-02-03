import { css } from '@emotion/css';

import { color, fontSize } from 'common/styles';

export const container = css`
  display: flex;
  font-size: ${fontSize.sm};
  flex-flow: wrap;
`;

export const mapContainerStyle = css`
  height: 32.5rem;
  width: 48.75rem;
`;

export const textFieldStyle = css`
  width: 15.625rem;
`;

export const textFieldLabelStyle = css`
  width: 15.625rem;
  max-width: none;
  line-height: 1.5rem;
  height: 1.5rem;
`;

export const textFieldRow = css`
  display: flex;
  margin-bottom: 1.25rem;
`;

export const textFieldColumn = css`
  margin-right: 1.25rem;
  max-width: 100%;
`;

export const textInputStyles = {
  fieldGroup: [
    {
      height: '1.5rem',
      fontSize: fontSize.sm,
      borderColor: `${color.grayBorder}`,
    },
  ],
};

export const errorContainer = css`
  width: 100%;
  max-width: 31.25rem;
  margin-bottom: 1rem;
`;