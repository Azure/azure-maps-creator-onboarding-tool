import { useCallback } from 'react';
import { Image } from '@fluentui/react/lib/Image';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import EditSvg from 'common/assets/edit.svg';
import { buttonLabelStyle, buttonStyle, imageStyle, paneStyle } from './card.style';
import { strings } from 'common/styles';
import { PATHS } from 'common';

const EditCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onClick = useCallback(() => {
    navigate(PATHS.EDIT_MANIFEST);
  }, [navigate]);

  return (
    <div className={paneStyle}>
      <Image className={imageStyle} src={EditSvg} />
      <h3>{t('edit.existing.manifest')}</h3>
      <p>{strings.loremIpsum}</p>
      <PrimaryButton styles={buttonLabelStyle} className={buttonStyle} text={t('edit')}
                     onClick={onClick} />
    </div>
  );
};

export default EditCard;