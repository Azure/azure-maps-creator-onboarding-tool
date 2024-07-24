import { Icon } from '@fluentui/react/lib/Icon';
import { Sticky, StickyPositionType } from '@fluentui/react/lib/Sticky';
// import { Link } from 'azure-devops-ui/Link';
import * as React from 'react';

export const RenderDetailsHeader = (headerProps, defaultRender) => (
  <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
    {defaultRender(headerProps)}
  </Sticky>
);

export const DetailedViewLink = props => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <div subtle onClick={() => props.onClick && props.onClick()}>
    <span style={{ color: '#005a9e', textDecoration: 'underline' }}>Details</span>{' '}
    <Icon iconName="NavigateExternalInline" />
  </div>
);
