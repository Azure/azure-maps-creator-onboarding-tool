import { useTranslation } from 'react-i18next';

import { containerStyle, mainDescriptionStyle, paneSectionStyle } from './index.style';
import Card from './card/card';
import { strings } from 'common/styles';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className={containerStyle}>
      <h2>{t('maps.creator.manifest.tool')}</h2>
      <p className={mainDescriptionStyle}>{strings.loremIpsum}</p>
      <div className={paneSectionStyle}>
        <Card type='create' />
        <Card type='edit' />
      </div>
    </div>
  );
};

export default Index;