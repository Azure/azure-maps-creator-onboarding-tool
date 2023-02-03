import { useCallback } from 'react';
import { Image } from '@fluentui/react/lib/Image';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CreateSvg from 'common/assets/create.svg';
import { buttonLabelStyle, buttonStyle, imageStyle, paneStyle } from './card.style';
import { PATHS } from 'common';

const CreateCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onClick = useCallback(() => {
    navigate(PATHS.CREATE_MANIFEST);
  }, [navigate]);

  return (
    <div className={paneStyle}>
      <Image className={imageStyle} src={CreateSvg} />
      <h3>{t('create.new.manifest')}</h3>
      <PrimaryButton styles={buttonLabelStyle} className={buttonStyle} text={t('create')}
                     onClick={onClick} />
    </div>
  );
};

export default CreateCard;