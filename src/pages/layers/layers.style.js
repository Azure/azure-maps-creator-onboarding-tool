import { css } from '@emotion/css';

import { fontSize } from 'common/styles';

export const layerRow = css`
  width: 100%;
  max-width: 47rem;
  border-top: 1px solid #bbb;
  padding: 1rem 0;
`;

export const propertyRow = css`
  display: flex;
  width: 100%;
  max-width: 47rem;
  margin-top: 0.5rem;
  padding-left: 2rem;
`;

export const flexContainer = css`
  display: flex;
`;

export const newPropContainer = css`
  margin-top: 0.5rem;
  padding-left: 3.5rem;
  display: flex;
  font-size: ${fontSize.sm};
  line-height: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const addNewPropText = css`
  font-style: italic;
`;

export const fieldLabel = css`
  min-width: 6rem;
  flex-grow: 1;
  max-width: calc(50% - 2rem);
  margin-right: 1.25rem;
`;

export const propertyFieldLabel = css`
  ${fieldLabel}
  max-width: calc(50% - 4rem);
  padding-left: 0.5rem;
`;

export const dropdownStyles = {
  dropdown: {
    height: '1.5rem',
    fontSize: fontSize.sm,
  },
  root: {
    maxWidth: 'calc(50% - 1.5rem)',
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

export const addLayerRow = css`
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
`;

export const addLayerInput = {
  fieldGroup: [
    {
      height: '1.5rem',
      fontSize: fontSize.sm,
      maxWidth: '10rem',
    },
  ],
  errorMessage: {
    maxWidth: '10rem',
  }
};

export const layerIcon = css`
  color: black;
  font-size: ${fontSize.sm};
  width: 1.5rem;
  height: 1.5rem;
  &:hover{
    color: black;
  }
`;

export const deleteIconContainer = css`
  width: 1.5rem;
  margin-left: 0.25rem;
`;

export const layerNameInputStyles = {
  fieldGroup: [{ height: '1.5rem' }],
  field: [{ fontSize: fontSize.sm }],
};