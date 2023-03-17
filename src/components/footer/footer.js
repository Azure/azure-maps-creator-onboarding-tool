import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { shallow } from 'zustand/shallow';

import { buttonStyle, footerContainerStyle } from './footer.style';
import { useCompletedSteps, progressBarSteps, useProgressBarStore } from 'common/store';
import { useReviewManifestStore } from 'common/store/review-manifest.store';

const reviewManifestSelector = (s) => s.showPane;
const progressBarStoreSelector = (s) => [s.showMissingDataError, s.hideMissingDataError];

export const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const completedSteps = useCompletedSteps();
  const [showMissingDataError, hideMissingDataError] = useProgressBarStore(progressBarStoreSelector, shallow);
  const showReviewManifestPane = useReviewManifestStore(reviewManifestSelector);
  const order = progressBarSteps.findIndex(route => route.href === pathname);

  const allStepsCompleted = useMemo(() => {
    return completedSteps.length === progressBarSteps.length;
  }, [completedSteps]);

  const nextScreenLink = progressBarSteps[order + 1] !== undefined ? progressBarSteps[order + 1].href : null;
  const prevScreenLink = progressBarSteps[order - 1] !== undefined ? progressBarSteps[order - 1].href : null;

  const goNext = useCallback(() => {
    navigate(nextScreenLink);
  }, [navigate, nextScreenLink]);
  const goPrev = useCallback(() => {
    navigate(prevScreenLink);
  }, [navigate, prevScreenLink]);
  const onReview = useCallback(() => {
    if (allStepsCompleted) {
      hideMissingDataError();
      showReviewManifestPane();
    } else {
      showMissingDataError();
    }
  }, [allStepsCompleted, hideMissingDataError, showReviewManifestPane, showMissingDataError]);

  if (order === -1) {
    return null;
  }

  return (
      <div className={footerContainerStyle}>
        <PrimaryButton className={buttonStyle} onClick={onReview}>
          {t('review.download')}
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