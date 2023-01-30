import { useDissolvedExterior } from 'common/store/geometry.store';
import Map from './map';

const CheckedMap = () => {
  const [exteriorCenter, dissolvedExterior, centerToAnchorPointDestination] = useDissolvedExterior();

  if (!exteriorCenter || !dissolvedExterior || !centerToAnchorPointDestination) {
    return null;
  }

  return (
    <Map dissolvedExterior={dissolvedExterior} exteriorCenter={exteriorCenter}
         anchorPointDistance={centerToAnchorPointDestination[0]}
         anchorPointHeading={centerToAnchorPointDestination[1]} />
  );
};

export default CheckedMap;