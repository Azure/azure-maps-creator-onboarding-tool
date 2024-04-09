import { css } from '@emotion/css';

export const floatingButtonWrapper = css`
  padding: 4rem 1rem;
  position: absolute;
  right: 0;
  bottom: 0;
`;

export const toggleButton = css`
  width: 32px;
  height: 32px;
  position: relative;
  display: inline-block;
  overflow: hidden;
  margin: 0;
  background-color: #f3f2f1;
  transition: background-color 0.25s;

  // border: 2px solid #ddd;
  border-radius: 50%;
  padding: 7px;

  &:hover {
    background-color: #d3eaf8;
  }
`;

export const iconImage = css`
  width: 100%;
  height: 100%;
`;

export const iconWrapper = css`
  width: 26px;
  height: 26px;
`;

export const actionWrapper = css`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;
