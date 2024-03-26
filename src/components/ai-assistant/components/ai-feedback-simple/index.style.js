import { css } from '@emotion/css';
import { color } from 'common/styles';

export const feedbackWrapper = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${color.grayBg};
  padding: 4px 16px;
  border-radius: 4px;
`;

export const likeIcon = css`
  color: ${color.greenIcon};

  &:hover {
    color: ${color.greenIcon};
  }
`;

export const dislikeIcon = css`
  color: ${color.redError};

  &:hover {
    color: ${color.redError};
  }
`;
