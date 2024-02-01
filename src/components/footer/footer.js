import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { PATHS } from 'common';
import featureFlags from 'common/feature-flags';
import {
  useCompletedSteps,
  useConversionStore,
  useProgressBarSteps,
  useProgressBarStore,
  useReviewManifestJson,
  useReviewManifestStore,
} from 'common/store';
import { useIMDFConversionStatus } from 'common/store/conversion.store';
import { usePlacesReviewManifestJson } from 'common/store/review-manifest.store';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useCustomNavigate, useFeatureFlags } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { buttonStyle, footerContainerStyle } from './footer.style';

const reviewManifestSelector = s => [s.createPackageWithJson, s.getOriginalPackageName];
const progressBarStoreSelector = s => [s.showMissingDataError, s.hideMissingDataError];
const conversionSelector = s => [s.reset, s.uploadPackage];

export const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useCustomNavigate();
  const json = useReviewManifestJson();
  const placesJson = usePlacesReviewManifestJson();
  const [showMissingDataError, hideMissingDataError] = useProgressBarStore(progressBarStoreSelector, shallow);
  const [createPackageWithJson, getOriginalPackageName] = useReviewManifestStore(reviewManifestSelector, shallow);
  const [resetConversion, uploadConversion] = useConversionStore(conversionSelector, shallow);
  const completedSteps = useCompletedSteps();
  const progressBarSteps = useProgressBarSteps();
  const { isPlacesPreview } = useFeatureFlags();

  const order = progressBarSteps.findIndex(route => route.href === pathname);

  const nextScreenLink = progressBarSteps[order + 1] !== undefined ? progressBarSteps[order + 1].href : null;
  const prevScreenLink = progressBarSteps[order - 1] !== undefined ? progressBarSteps[order - 1].href : null;

  const { isRunningIMDFConversion } = useIMDFConversionStatus();

  const goNext = () => navigate(nextScreenLink);
  const goPrev = () => navigate(prevScreenLink);

  const regularReviewFlow = () => {
    if (completedSteps.length === progressBarSteps.length) {
      resetConversion();
      hideMissingDataError();
      createPackageWithJson(json).then(file => {
        saveAs(file, `drawingPackage_${getOriginalPackageName()}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`);
        if (featureFlags.onboardingEnabled) {
          uploadConversion(file);
          navigate(PATHS.CONVERSION);
        }
      });
    } else {
      showMissingDataError();
    }
  };

  const placesReviewFlow = () => {
    if (completedSteps.length === progressBarSteps.length) {
      resetConversion();
      hideMissingDataError();
      // TODO: remove this console.log for production
      console.log(placesJson);
      createPackageWithJson(placesJson).then(file => {
        saveAs(file, `drawingPackage_${getOriginalPackageName()}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`);
        if (featureFlags.onboardingEnabled) {
          uploadConversion(file, { isPlacesPreview: true });
          navigate(PATHS.IMDF_CONVERT);
        }
      });
    } else {
      showMissingDataError();
    }
  };

  const onReview = () => {
    if (isPlacesPreview) {
      placesReviewFlow();
    } else {
      regularReviewFlow();
    }
  };

  if (order === -1) {
    return null;
  }

  return (
    <div className={footerContainerStyle}>
      <PrimaryButton className={buttonStyle} onClick={onReview} disabled={isRunningIMDFConversion}>
        {featureFlags.onboardingEnabled
          ? isPlacesPreview
            ? t('convert.download')
            : t('create.download')
          : t('download')}
      </PrimaryButton>
      <DefaultButton
        className={buttonStyle}
        disabled={prevScreenLink === null || isRunningIMDFConversion}
        onClick={goPrev}
      >
        {t('previous')}
      </DefaultButton>
      <DefaultButton
        className={buttonStyle}
        disabled={nextScreenLink === null || isRunningIMDFConversion}
        onClick={goNext}
      >
        {t('next')}
      </DefaultButton>
    </div>
  );
};

export default Footer;
