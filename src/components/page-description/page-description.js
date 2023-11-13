import { MessageBar, MessageBarType } from '@fluentui/react';
import PropTypes from 'prop-types';

import { infoContainer } from './page-description.style';

const PageDescription = ({ description }) => (
  <div className={infoContainer}>
    <MessageBar messageBarType={MessageBarType.info}>{description}</MessageBar>
  </div>
);

PageDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export default PageDescription;
