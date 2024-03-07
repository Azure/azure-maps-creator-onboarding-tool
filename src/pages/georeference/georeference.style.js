import { css } from '@emotion/css';

import { color, fontSize } from 'common/styles';

export const container = css`
  font-size: ${fontSize.sm};
`;

export const regularContainer = css`
  display: flex;
  flex-flow: wrap;
`;

export const mapContainerStyle = css`
  height: 32rem;
  width: 48rem;
`;

export const textFieldStyle = css`
  width: 18.25rem;
`;

export const textFieldLabelStyle = css`
  width: 13rem;
  max-width: none;
  line-height: 1.5rem;
  height: 1.5rem;
`;

export const textFieldRow = css`
  display: flex;
  margin-bottom: 1.25rem;
  align-items: flex-start;
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

export const dropdownStyles = css`
  max-width: 18.25rem;
  flex-grow: 1;
`;
