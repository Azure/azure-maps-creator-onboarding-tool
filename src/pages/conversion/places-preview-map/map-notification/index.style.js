const { css } = require('@emotion/css');

export const mapNotificationWrapper = css`
  position: absolute;
  padding: 10px;
  justify-content: center;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 100;
`;

export const mapNotificationContent = css`
  color: #525252;
  background-color: #fff;
  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.1),
    0 3px 3px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 4px;

  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const mapNotificationIcon = css`
  padding-top: 0.1rem;
`;
