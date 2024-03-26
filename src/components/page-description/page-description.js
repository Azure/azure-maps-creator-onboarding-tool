import { cx } from '@emotion/css';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { infoContainer } from './page-description.style';

const PageDescription = props => {
  const { description, className } = props;

  if (!description) return null;

  return (
    <div className={cx(infoContainer, className)}>
      <MessageBar messageBarType={MessageBarType.info}>{description}</MessageBar>
    </div>
  );
};

export default PageDescription;
