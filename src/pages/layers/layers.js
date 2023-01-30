import { useLayersStore } from 'common/store';
import Layer from './layer';

const layersSelector = (s) => s.layers;

export const Layers = () => {
  const layers = useLayersStore(layersSelector);

  return (
    <>
      {layers.map(({id, name, props, value, required, isDraft}) => (
        <Layer id={id} name={name} props={props} value={value} key={id} required={required}
               isDraft={isDraft} />
      ))}
    </>
  );
};

export default Layers;