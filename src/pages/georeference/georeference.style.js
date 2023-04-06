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

export const dropdownStyles = {
  dropdown: {
    height: '1.5rem',
    fontSize: fontSize.sm,
  },
  root: {
    maxWidth: '18.25rem',
    flexGrow: 1,
  },
  title: {
    height: '1.5rem',
    lineHeight: '1.5rem',
  },
  dropdownItem: {
    height: '1.5rem',
    lineHeight: '1.5rem',
    minHeight: 'auto',
  },
  dropdownOptionText: {
    fontSize: fontSize.sm,
  },
  dropdownItemSelected: {
    height: '1.5rem',
    lineHeight: '1.5rem',
    minHeight: 'auto',
  },
  caretDownWrapper: {
    height: '1.5rem',
    lineHeight: '1.5rem',
  },
};