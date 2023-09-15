import { css } from '@emotion/css';

import { fontSize, fontWeight } from 'common/styles';

export const containerStyle = css`
  max-width: 45.5rem;
  width: 100%;
  align-self: center;
  font-size: ${fontSize.sm};
  margin-top: 1rem;
`;

export const descriptionStyle = css`
  margin: 0 0 1.5rem 0;
`;

export const headerStyle = css`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const formRowStyle = css`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const fieldStyle = css`
  width: 30rem;
  display: flex;
`;

export const textFieldStyle = css`
  width: 100%;
`;

export const inputStyles = {
  fieldGroup: [{
    height: '1.5rem',
  }],
  revealButton: [{
    height: 'calc(1.5rem - 2px)', // 2px is border top and bottom, otherwise it overlays input border
  }],
  field: [{
    fontSize: fontSize.sm,
  }]
};

export const dropdownStyle = css`
  width: 30rem;
`;

export const primaryButtonStyle = css`
  margin-right: 1rem;
  height: 1.5rem;
  line-height: 1.5rem;
  font-size: ${fontSize.sm};
`;

export const primaryButtonDisabledStyles = {
  labelDisabled: {
    color: '#666', // added this cause default color does not provide enough contrast for accessibility (4.5)
  },
};

export const fileInputStyle = css`
  display: none;
`;

// these styles copied from fluent ui default button
export const browseButtonStyle = css`
  outline: transparent;
  position: relative;
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.normal};
  box-sizing: border-box;
  border: 1px solid rgb(138, 136, 134);
  display: inline-block;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  padding: 0 1rem;
  border-radius: 2px;
  min-width: 5rem;
  height: 1.5rem;
  background-color: rgb(255, 255, 255);
  color: rgb(50, 49, 48);
  user-select: none;
  margin-left: 1rem;

  &:hover {
    background-color: rgb(243, 242, 241);
    color: rgb(32, 31, 30);
  }
`;

export const browseButtonContentStyle = css`
  display: flex;
  height: 100%;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  font-weight: ${fontWeight.semibold};
`;

export const errorBannerStyle = css`
  min-height: 3.125rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const errorBannerHidden = css`
  visibility: hidden;
`;

export const conversionsLink = css`
  color: initial;
  cursor: pointer;
`;

export const disabledConversionsLinks = css`
  color: grey;
  cursor: text;
`;