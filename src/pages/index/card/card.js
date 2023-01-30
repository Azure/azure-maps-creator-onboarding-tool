import PropTypes from 'prop-types';

import CreateCard from './create-card';
import EditCard from './edit-card';

const Card = ({ type }) => {
  if (type === 'create') {
    return <CreateCard />;
  }
  return <EditCard />;
};

Card.propTypes = {
  type: PropTypes.oneOf(['create', 'edit']).isRequired,
};

export default Card;