import { css } from '@emotion/css';
import { fontSize } from 'common/styles';

export const layersWrapper = css``;

export const layerRow = css`
  width: 100%;
  padding: 1rem 0;
  border-top: 1px solid #bbb;

  &:first-child {
    border-top: none;
    padding-top: 0;
  }
`;

export const categoryLayerRow = css`
  ${layerRow}
  margin-top: 1rem;
  padding-bottom: 0;
`;

export const categoryMappingPanel = css`
  width: 100%;
  padding: 1rem 0;
`;

export const propertyRow = css`
  display: flex;
  width: calc(100% - 2rem);
  margin-top: 0.5rem;
  padding-left: 2rem;
`;

export const singlePropertyRow = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const featureClassRow = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  width: calc(50% - 1.5rem);
  margin-right: 1.25rem;
`;

export const readOnlyFieldLabel = css`
  width: 50%;
  margin-right: 1.25rem;
`;

export const mappingToggle = css`
  margin: 0;
`;

export const propertyFieldLabel = css`
  width: calc(50% - 2.5rem);
  margin-right: 1.25rem;
`;

export const dropdownStyles = css`
  align-self: baseline;
  width: calc(50% - 1.5rem);
`;

export const wideDropdownStyles = css`
  align-self: baseline;
  width: 100%;
`;

export const propertyDropdownStyles = css`
  ${dropdownStyles};
  width: calc(50% - 0.5rem);
`;

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
  },
};

export const layerIcon = css`
  color: black;
  font-size: ${fontSize.sm};
  width: 1.5rem;
  height: 1.5rem;
  &:hover {
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
