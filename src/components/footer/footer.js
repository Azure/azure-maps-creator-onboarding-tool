import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { PATHS } from 'common';
import featureFlags from 'common/feature-flags';
import { useConversionStore, useProgressBarSteps, useReviewManifestJson, useReviewManifestStore } from 'common/store';
import { useValidationStatus } from 'common/store/progress-bar-steps';
import { usePlacesReviewManifestJson } from 'common/store/review-manifest.store';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useCustomNavigate, useFeatureFlags } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ButtonText from './download-button';
import { buttonStyle, footerContainerStyle } from './footer.style';

export const TEST_ID = {
  CONVERT_BUTTON: 'convert-button',
  PREVIOUS_BUTTON: 'previous-button',
  NEXT_BUTTON: 'next-button',
};

const reviewManifestSelector = s => [s.createPackageWithJson, s.getOriginalPackageName];
const conversionSelector = s => [s.reset, s.uploadPackage];

export const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useCustomNavigate();
  const json = useReviewManifestJson();
  const placesJson = usePlacesReviewManifestJson();
  const [createPackageWithJson, getOriginalPackageName] = useReviewManifestStore(reviewManifestSelector);
  const [resetConversion, uploadConversion] = useConversionStore(conversionSelector);
  const progressBarSteps = useProgressBarSteps();
  const { isPlacesPreview } = useFeatureFlags();

  const order = progressBarSteps.findIndex(route => route.href === pathname);

  const nextScreenLink = progressBarSteps[order + 1] !== undefined ? progressBarSteps[order + 1].href : null;
  const prevScreenLink = progressBarSteps[order - 1] !== undefined ? progressBarSteps[order - 1].href : null;

  const { success: allStepsCompleted } = useValidationStatus();

  const isOnFirstStep = prevScreenLink === null;
  const isOnLastStep = nextScreenLink === null;

  const goNext = () => navigate(nextScreenLink);
  const goPrev = () => navigate(prevScreenLink);

  const onReview = () => {
    if (!isOnLastStep) {
      navigate(PATHS.REVIEW_CREATE);
      return;
    }

    if (allStepsCompleted) {
      resetConversion();
      const flowData = isPlacesPreview
        ? {
            json: placesJson,
            redirectTo: PATHS.IMDF_CONVERSION,
            saveFile: () => {},
          }
        : {
            json: json,
            redirectTo: PATHS.CONVERSION,
            saveFile: file =>
              saveAs(file, `drawingPackage_${getOriginalPackageName()}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`),
          };

      createPackageWithJson(flowData.json).then(file => {
        flowData.saveFile(file);
        if (featureFlags.onboardingEnabled) {
          uploadConversion(file, { isPlacesPreview });
          navigate(flowData.redirectTo);
        }
      });
    }
  };

  if (order === -1) {
    return null;
  }

  return (
    <div className={footerContainerStyle}>
      <PrimaryButton
        className={buttonStyle}
        disabled={!allStepsCompleted && isOnLastStep}
        onClick={onReview}
        data-testid={TEST_ID.CONVERT_BUTTON}
      >
        <ButtonText isOnLastStep={isOnLastStep} />
      </PrimaryButton>
      <DefaultButton
        className={buttonStyle}
        disabled={isOnFirstStep}
        onClick={goPrev}
        data-testid={TEST_ID.PREVIOUS_BUTTON}
      >
        {t('previous')}
      </DefaultButton>
      <DefaultButton className={buttonStyle} disabled={isOnLastStep} onClick={goNext} data-testid={TEST_ID.NEXT_BUTTON}>
        {t('next')}
      </DefaultButton>
    </div>
  );
};

export default Footer;
