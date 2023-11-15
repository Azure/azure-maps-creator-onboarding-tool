import { css } from '@emotion/css';
import { mergeStyles } from '@fluentui/react/lib/Styling';

import { color, fontSize, fontWeight } from 'common/styles';

export const controls = css`
  background-color: white;
  font-size: ${fontSize.sm};
`;

export const hiddenControls = css`
  display: none;
`;

export const controlContainer = css`
  position: relative;
`;

export const controlHeader = css`
  font-weight: ${fontWeight.semibold};
  padding: 0.3125rem 0.5rem 0.3125rem 0.875rem;
  border-bottom: 1px solid ${color.lightGray};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const controlCoordinatesContainer = css`
  display: flex;
  justify-content: space-between;
`;

export const searchAddressContainer = css`
  padding: 0.7rem 0.875rem;
  border-bottom: 1px solid ${color.lightGray};
  display: flex;
  flex-direction: column;
`;

export const radioButtonsContainer = css`
  padding-top: 0;
`;

export const searchAddressInput = {
  fieldGroup: [
    {
      height: '1.5rem',
      fontSize: fontSize.sm,
      width: '100%',
    },
  ],
};

export const sectionTitle = css`
  margin-bottom: 0.2rem;
`;

export const controlSliderSection = css`
  padding: 0.7rem 0.875rem;
`;

export const controlInputStyles = css`
  width: 6rem;
`;

export const angleInputStyles = css`
  width: 3rem;
  margin-left: 0.25rem;
  text-align: center;
`;

export const sliderContainerOuter = css`
  display: flex;
`;

export const sliderContainerInner = css`
  width: 10rem;
  height: 1.5rem;
`;

export const toggleButton = css`
  width: 2rem;
  height: 2rem;
  background-color: white;
  color: black;
  border: none;
  border-radius: 2px;
  box-shadow: rgb(0 0 0 / 16%) 0 0 4px;
  cursor: pointer;
  &:hover {
    background-color: white;
    color: black;
  }
  &:active {
    background-color: #f1f1f1;
    color: black;
  }
`;

export const iconClass = mergeStyles({
  fontSize: 16,
  height: 16,
  width: 16,
});

export const collapseButton = css`
  border: none;
  background: none;
  cursor: pointer;
  color: black;
  &:hover {
    background-color: white;
    color: black;
  }
  &:active {
    background-color: #f1f1f1;
    color: black;
  }
`;

export const buttonStyle = css`
  margin-top: 0.5rem;
  height: 1.5rem;
  font-size: ${fontSize.sm};
  align-self: flex-end;
`;

export const buttonDisabledStyles = {
  labelDisabled: {
    color: '#666', // added this cause default color does not provide enough contrast for accessibility (4.5)
  },
};
