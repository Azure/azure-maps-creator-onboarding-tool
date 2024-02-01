import { css } from '@emotion/css';
import { color, fontSize } from 'common/styles';
import img from './icon.png';

export const dropdownButton = css`
  font-size: ${fontSize.sm};
  color: black;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const dropdownOption = {
  fontSize: `${fontSize.sm}`,
  color: 'black',
};

export const dropdownStyleObj = {
  borderRadius: 2,
  border: `1px solid ${color.granite}`,
  fontSize: fontSize.sm,
  height: '1.5rem',
  lineHeight: '1.5rem',
  width: '100%',
};

export const filterInputStyle = css`
  height: 1.625rem;
  margin: 0.3125rem;
  padding: 0 0.625rem;
  box-sizing: border-box;
  line-height: 1.625rem;
  border: 1px solid #ccc;
  border-radius: 2px;
  background-image: url(${img});
  background-size: 0.75rem 0.75rem;
  background-repeat: no-repeat;
  background-position: 0.375rem 0.375rem;
  padding-left: 1.5rem;
`;

// this input was added to bring back focus to dropdown and make it work properly.
// Without this it was either closing prematurely or not closing at all sometimes.
// So this is the best way to fix is i found so far.
export const hackInputStyle = css`
  position: fixed;
  top: -99999px;
  left: -99999px;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: 0;
`;

export const errorContainer = css`
  margin: 0px;
  padding-top: 5px;
  display: flex;
  align-items: center;
  color: ${color.redError};
`;
