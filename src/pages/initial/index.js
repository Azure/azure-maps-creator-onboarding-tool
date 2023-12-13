import { PrimaryButton } from '@fluentui/react';
import { PATHS } from 'common';
import createImage from 'common/assets/create.png';
import viewImage from 'common/assets/view.png';
import {
  containerStyle,
  descriptionStyle,
  headerStyle,
  primaryButtonDisabledStyles,
  primaryButtonStyle,
} from 'pages/create-manifest/create-manifest.style';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const TEST_ID = {
  UPLOAD_BUTTON: 'upload-button',
  VIEW_BUTTON: 'view-button',
};

const Card = props => {
  const { image, title, children } = props;
  return (
    <div>
      <img src={image} alt="card" style={{ borderRadius: 4, marginBottom: '0.5rem' }} />
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

const InitialView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreateButtonClick = () => navigate(PATHS.CREATE_UPLOAD);
  const handleViewButtonClick = () => navigate(PATHS.VIEW_CONVERSIONS);

  return (
    <div className={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <h1 className={headerStyle}>Azure Maps Creator</h1>
        <p className={descriptionStyle}>{t('initial.description')}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
        <Card title="Create" image={createImage}>
          <p>{t('create.description')}</p>
          <PrimaryButton
            onClick={handleCreateButtonClick}
            data-testid={TEST_ID.UPLOAD_BUTTON}
            className={primaryButtonStyle}
            text={t('create')}
            styles={primaryButtonDisabledStyles}
            style={{ marginTop: '2rem' }}
          />
        </Card>
        <Card title="View" image={viewImage}>
          <p>{t('view.existing.conversions')}</p>
          <PrimaryButton
            onClick={handleViewButtonClick}
            data-testid={TEST_ID.VIEW_BUTTON}
            className={primaryButtonStyle}
            text={t('view')}
            styles={primaryButtonDisabledStyles}
            style={{ marginTop: '2rem' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default InitialView;
