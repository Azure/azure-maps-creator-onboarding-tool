import { css } from '@emotion/css';
import { color, fontSize, fontWeight } from 'common/styles';

export const barStyle = css`
  background: ${color.accent.primary};
  color: white;
  height: 2.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 0.625rem ${color.shadow};
`;

export const msftAzureTextStyle = css`
  font-weight: ${fontWeight.semibold};
  font-size: ${fontSize.lg};
  margin: 0.625rem;
`;

export const splitterStyle = css`
  width: 1px;
  height: 1.25rem;
  background: white;
`;

export const azMapsCreatorTextStyle = css`
  font-size: ${fontSize.md};
  margin: 0.625rem;
`;