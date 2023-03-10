import { useTranslation } from 'react-i18next';

import { useLayersStore } from 'common/store';
import Layer from './layer';
import PageDescription from 'components/page-description/page-description';

const layersSelector = (s) => s.layers;

export const Layers = () => {
  const { t } = useTranslation();
  const layers = useLayersStore(layersSelector);

  return (
    <>
      <PageDescription description={t('page.description.layers')} />
      {layers.map(({id, name, props, value, required, isDraft}) => (
        <Layer id={id} name={name} props={props} value={value} key={id} required={required}
               isDraft={isDraft} />
      ))}
    </>
  );
};

export default Layers;