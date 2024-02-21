import { useDissolvedExterior } from 'common/store/geometry.store';
import Map from './map';

const CheckedMap = props => {
  const [exteriorCenter, dissolvedExterior] = useDissolvedExterior();

  if (!exteriorCenter) {
    return null;
  }

  return <Map dissolvedExterior={dissolvedExterior} exteriorCenter={exteriorCenter} {...props} />;
};

export default CheckedMap;
