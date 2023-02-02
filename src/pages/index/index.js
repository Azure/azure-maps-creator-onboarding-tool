import { Trans, useTranslation } from 'react-i18next';

import { containerStyle, mainDescriptionStyle, paneSectionStyle } from './index.style';
import Card from './card/card';
import LinkText from 'common/translations/link-text';

const linkToKnowledgeBase = 'https://aka.ms/howtoconversionv2drawingpackage';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className={containerStyle}>
      <h2>{t('maps.creator.manifest.tool')}</h2>
      <p className={mainDescriptionStyle}>
        <Trans i18nKey='home.page.description' components={[
          <LinkText href={linkToKnowledgeBase} />
        ]} />
      </p>
      <div className={paneSectionStyle}>
        <Card type='create' />
        <Card type='edit' />
      </div>
    </div>
  );
};

export default Index;