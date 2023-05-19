import { useTranslation } from 'react-i18next';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { saveAs } from 'file-saver';

import { buttonStyle, footerContainerStyle } from './footer.style';
import {
  progressBarSteps,
  useProgressBarStore,
  useReviewManifestJson,
  useReviewManifestStore,
  useConversionStore,
  useUserStore,
} from 'common/store';
import { createPackageWithJson } from './zip';
import { PATHS } from 'common';

const reviewManifestSelector = (s) => [s.canBeDownloaded, s.originalPackage];
const progressBarStoreSelector = (s) => [s.showMissingDataError, s.hideMissingDataError];
const conversionSelector = (s) => [s.reset, s.uploadPackage];
const userStoreSelector = (s) => [s.subscriptionKey, s.geography];

export const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const json = useReviewManifestJson();
  const [showMissingDataError, hideMissingDataError] = useProgressBarStore(progressBarStoreSelector, shallow);
  const [canBeDownloaded, originalPackage] = useReviewManifestStore(reviewManifestSelector, shallow);
  const [resetConversion, uploadConversion] = useConversionStore(conversionSelector, shallow);
  const [subscriptionKey, geography] = useUserStore(userStoreSelector, shallow);

  const order = progressBarSteps.findIndex(route => route.href === pathname);

  const nextScreenLink = progressBarSteps[order + 1] !== undefined ? progressBarSteps[order + 1].href : null;
  const prevScreenLink = progressBarSteps[order - 1] !== undefined ? progressBarSteps[order - 1].href : null;

  const goNext = () => navigate(nextScreenLink);
  const goPrev = () => navigate(prevScreenLink);
  const onReview = () => {
    if (canBeDownloaded) {
      resetConversion();
      hideMissingDataError();
      createPackageWithJson(originalPackage, json).then((file) => {
        uploadConversion(file, geography, subscriptionKey);
        saveAs(
          file,
          'manifest.zip',
        );
        navigate(PATHS.CONVERSION);
      });
    } else {
      showMissingDataError();
    }
  };

  if (order === -1) {
    return null;
  }

  return (
      <div className={footerContainerStyle}>
        <PrimaryButton className={buttonStyle} onClick={onReview}>
          {t('create.download')}
        </PrimaryButton>
        <DefaultButton className={buttonStyle} disabled={prevScreenLink === null} onClick={goPrev}>
          {t('previous')}
        </DefaultButton>
        <DefaultButton className={buttonStyle} disabled={nextScreenLink === null} onClick={goNext}>
          {t('next')}
        </DefaultButton>
      </div>
  );
};

export default Footer;