import { css } from '@emotion/css';
import { fontSize, fontWeight } from 'common/styles';

export const tableActions = css`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export const fileInputStyle = css`
  display: none;
`;

export const browseButtonContentStyle = css`
  display: flex;
  height: 100%;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  font-weight: ${fontWeight.semibold};
`;

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

  &:hover {
    background-color: rgb(243, 242, 241);
    color: rgb(32, 31, 30);
  }
`;
