import { MessageBar, MessageBarType } from '@fluentui/react';
import { useCompletedSteps, useProgressBarSteps, useProgressBarStore, useReviewManifestStore } from 'common/store';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getFeatureFlags } from 'utils';
import ProgressBarButton from './progress-bar-button';
import { errorContainer, progressBarContainer } from './progress-bar.style';

export const ProgressBar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isPlacesPreview } = getFeatureFlags();
  const completedSteps = useCompletedSteps();
  const [
    isIncorrectManifestVersionErrorShown,
    hideIncorrectManifestVersionError,
    isInvalidManifestErrorShown,
    hideInvalidManifestError,
    isMissingDataErrorShown,
    hideMissingDataError,
  ] = useProgressBarStore(s => [
    s.isIncorrectManifestVersionErrorShown,
    s.hideIncorrectManifestVersionError,
    s.isInvalidManifestErrorShown,
    s.hideInvalidManifestError,
    s.isMissingDataErrorShown,
    s.hideMissingDataError,
  ]);

  const [manifestImported] = useReviewManifestStore(s => [s.manifestImported]);

  const progressBarSteps = useProgressBarSteps();

  const shouldShowProgressBar = useMemo(
    () => progressBarSteps.some(step => step.href === pathname),
    [pathname, progressBarSteps]
  );

  useEffect(() => {
    if (completedSteps.length === progressBarSteps.length && isMissingDataErrorShown) {
      hideMissingDataError();
    }
  }, [completedSteps, isMissingDataErrorShown, hideMissingDataError, progressBarSteps]);

  if (!shouldShowProgressBar) {
    return null;
  }

  return (
    <>
      <div className={errorContainer}>
        {manifestImported && (
          <MessageBar messageBarType={MessageBarType.success} isMultiline onDismiss={hideIncorrectManifestVersionError}>
            {t('success.manifest.uploaded')}
          </MessageBar>
        )}
        {isIncorrectManifestVersionErrorShown && !isPlacesPreview && (
          <MessageBar messageBarType={MessageBarType.warning} isMultiline onDismiss={hideIncorrectManifestVersionError}>
            {t('error.manifest.incorrect.version')}
          </MessageBar>
        )}
        {isIncorrectManifestVersionErrorShown && isPlacesPreview && (
          <MessageBar messageBarType={MessageBarType.warning} isMultiline onDismiss={hideIncorrectManifestVersionError}>
            {t('error.manifest.places.incorrect.version')}
          </MessageBar>
        )}
        {isInvalidManifestErrorShown && (
          <MessageBar messageBarType={MessageBarType.warning} isMultiline onDismiss={hideInvalidManifestError}>
            {t('error.manifest.invalid')}
          </MessageBar>
        )}
        {isMissingDataErrorShown && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {t('error.validation.failed.missing.info')}
          </MessageBar>
        )}
      </div>
      <div className={progressBarContainer}>
        {progressBarSteps.map(step => (
          <ProgressBarButton step={step} key={step.key} />
        ))}
      </div>
    </>
  );
};

export default ProgressBar;
