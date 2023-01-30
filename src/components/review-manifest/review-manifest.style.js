import { css } from '@emotion/css';

import { color, fontSize } from 'common/styles';

export const reviewManifestFooter = css`
  border-top: 1px solid ${color.darkGray};
  padding: 1rem 1.25rem;
  background: white;
`;

export const buttonStyle = css`
  margin-right: 0.625rem;
  height: 1.5rem;
  font-size: ${fontSize.sm};
`;

export const panelStyle = {
  commands: {
    padding: 0,
    height: 50,
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    position: 'absolute!important',
    top: '0px!important',
    background: 'white',
  },
  content: {
    // 50px and 73px here at top and bottom are heights of header and footer+padding respectively
    padding: '50px 24px 73px',
  },
  footer: {
    position: 'absolute!important',
    width: '100%',
    bottom: '0px!important',
  },
  footerInner: {
    padding: 0,
    height: 57,
  },
  navigation: {
    width: '100%',
  }
};