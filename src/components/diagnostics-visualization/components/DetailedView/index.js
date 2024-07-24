import * as React from 'react';
import ReactJson from 'react-json-view';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 25px 50px 25px 25px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  width: calc(100% - 25px);

  & > div {
    margin-bottom: 8px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > div {
    margin-bottom: 2px;
  }
`;

const HeaderTitle = styled.div`
  font-size: 1.3125rem;
  fon-weight: 600;
  letter-spacing: -0.02em;
`;

const HeaderDescription = styled.div`
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.55);
`;

const HeaderClose = styled.div`
  display: block;
  position: fixed;
  right: 25px;
`;

const CloseButton = styled.button`
  padding: 8px;
  font-weight: normal;
  background-color: transparent;
  height: auto;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
  align-items: center;
  border-radius: 2px;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  justify-content: center;
  line-height: 0px;
  outline: none;
  overflow: visible;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

const DetailedView = ({ json, texts, props, styles }) => {
  const wrapperStyle = styles && styles.wrapper;
  const headerStyle = styles && styles.header;
  const headerContentStyle = styles && styles.headerContent;
  const headerTitleStyle = styles && styles.headerTitle;
  const headerDescriptionStyle = styles && styles.headerDescription;
  const headerCloseStyle = styles && styles.headerClose;
  const closeButtonStyle = styles && styles.closeButton;

  const wrapperProps = props && props.wrapper;
  const headerProps = props && props.header;
  const headerContentProps = props && props.headerContent;
  const headerTitleProps = props && props.headerTitle;
  const headerDescriptionProps = props && props.headerDescription;
  const headerCloseProps = props && props.headerClose;
  const closeButtonProps = props && props.closeButton;

  const headerTitleText = texts && texts.title;
  const descriptionText = texts && texts.description;

  return (
    <Wrapper style={wrapperStyle} {...wrapperProps}>
      <Header style={headerStyle} {...headerProps}>
        <HeaderContent style={headerContentStyle} {...headerContentProps}>
          <HeaderTitle style={headerTitleStyle} {...headerTitleProps}>
            {headerTitleText}{' '}
          </HeaderTitle>
          <HeaderDescription style={headerDescriptionStyle} {...headerDescriptionProps}>
            {descriptionText}
          </HeaderDescription>
        </HeaderContent>
        <HeaderClose style={headerCloseStyle} {...headerCloseProps}>
          <CloseButton
            style={closeButtonStyle}
            {...closeButtonProps}
            aria-label="Close"
            aria-roledescription="button"
            role="button"
            tabindex="0"
            type="button"
          >
            <span aria-hidden="true" className="left-icon flex-noshrink fabric-icon ms-Icon--Clear medium" />
          </CloseButton>
        </HeaderClose>
      </Header>
      <ReactJson collapseStringsAfterLength={64} src={json} />
    </Wrapper>
  );
};

export default DetailedView;
