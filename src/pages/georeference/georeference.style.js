import { css } from '@emotion/css';
import { color, fontSize } from 'common/styles';

export const mapContainerStyle = css`
  height: 32rem;
  width: 48rem;
`;

export const textFieldStyle = css`
  flex-grow: 1;
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
