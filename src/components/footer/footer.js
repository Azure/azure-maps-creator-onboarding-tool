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
  useCompletedSteps,
} from 'common/store';
import { PATHS } from 'common';
import featureFlags from 'common/feature-flags';

const reviewManifestSelector = (s) => [s.createPackageWithJson, s.getOriginalPackageName];
const progressBarStoreSelector = (s) => [s.showMissingDataError, s.hideMissingDataError];
const conversionSelector = (s) => [s.reset, s.uploadPackage];

export const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const json = useReviewManifestJson();
  const [showMissingDataError, hideMissingDataError] = useProgressBarStore(progressBarStoreSelector, shallow);
  const [createPackageWithJson, getOriginalPackageName] = useReviewManifestStore(reviewManifestSelector, shallow);
  const [resetConversion, uploadConversion] = useConversionStore(conversionSelector, shallow);
  const completedSteps = useCompletedSteps();

  const order = progressBarSteps.findIndex(route => route.href === pathname);

  const nextScreenLink = progressBarSteps[order + 1] !== undefined ? progressBarSteps[order + 1].href : null;
  const prevScreenLink = progressBarSteps[order - 1] !== undefined ? progressBarSteps[order - 1].href : null;

  const goNext = () => navigate(nextScreenLink);
  const goPrev = () => navigate(prevScreenLink);
  const onReview = () => {
    if (completedSteps.length === progressBarSteps.length) {
      resetConversion();
      hideMissingDataError();
      createPackageWithJson(json).then((file) => {
        saveAs(
          file,
          `drawingPackage_${getOriginalPackageName()}_${Date.now()}.zip`,
        );
        if (featureFlags.onboardingEnabled) {
          uploadConversion(file);
          navigate(PATHS.CONVERSION);
        }
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
          {featureFlags.onboardingEnabled ? t('create.download') : t('download')}
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