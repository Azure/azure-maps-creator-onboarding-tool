import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useLayersStore } from 'common/store';
import Layer from './layer';
import PageDescription from 'components/page-description/page-description';
import Preview from './preview';
import { layersContainer, layersWithPreview } from './layers.style';

const layersSelector = s => [s.layers, s.setVisited];

export const Layers = () => {
  const { t } = useTranslation();
  const [layers, setVisited] = useLayersStore(layersSelector, shallow);

  useEffect(() => {
    // this page does not have any required fields, so the only requirement is to visit it once.
    setVisited();
  }, [setVisited]);

  return (
    <>
      <PageDescription description={t('page.description.layers')} />
      <div className={layersWithPreview}>
        <div className={layersContainer}>
          {layers.map(({ id, name, props, value, isDraft }) => (
            <Layer id={id} name={name} props={props} value={value} key={id} isDraft={isDraft} />
          ))}
        </div>
        <Preview />
      </div>
    </>
  );
};

export default Layers;
