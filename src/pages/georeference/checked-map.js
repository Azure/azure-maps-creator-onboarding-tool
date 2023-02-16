import { useDissolvedExterior } from 'common/store/geometry.store';
import Map from './map';

const CheckedMap = () => {
  const [exteriorCenter, dissolvedExterior] = useDissolvedExterior();

  if (!exteriorCenter || !dissolvedExterior) {
    return null;
  }

  return (
    <Map dissolvedExterior={dissolvedExterior} exteriorCenter={exteriorCenter} />
  );
};

export default CheckedMap;