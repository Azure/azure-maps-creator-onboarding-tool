import { badge } from './index.style';

const NumericBadge = props => {
  const { value, color = '#ebebeb' } = props;

  return (
    <div className={badge} style={{ backgroundColor: color }}>
      {value}
    </div>
  );
};

export default NumericBadge;
