import { css } from '@emotion/css';
import { color, fontSize } from 'common/styles';

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
};