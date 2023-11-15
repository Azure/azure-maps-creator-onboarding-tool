import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { progressBarSteps, useCompletedSteps, useProgressBarStore } from 'common/store';
import { errorContainer, progressBarContainer } from './progress-bar.style';
import ProgressBarButton from './progress-bar-button';

const progressBarStoreSelector = s => [
  s.isIncorrectManifestVersionErrorShown,
  s.hideIncorrectManifestVersionError,
  s.isInvalidManifestErrorShown,
  s.hideInvalidManifestError,
  s.isMissingDataErrorShown,
  s.hideMissingDataError,
];

export const ProgressBar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const completedSteps = useCompletedSteps();
  const [
    isIncorrectManifestVersionErrorShown,
    hideIncorrectManifestVersionError,
    isInvalidManifestErrorShown,
    hideInvalidManifestError,
    isMissingDataErrorShown,
    hideMissingDataError,
  ] = useProgressBarStore(progressBarStoreSelector, shallow);

  const shouldShowProgressBar = useMemo(() => progressBarSteps.some(step => step.href === pathname), [pathname]);

  useEffect(() => {
    if (completedSteps.length === progressBarSteps.length && isMissingDataErrorShown) {
      hideMissingDataError();
    }
  }, [completedSteps, isMissingDataErrorShown, hideMissingDataError]);

  if (!shouldShowProgressBar) {
    return null;
  }

  return (
    <>
      <div className={errorContainer}>
        {isIncorrectManifestVersionErrorShown && (
          <MessageBar messageBarType={MessageBarType.warning} isMultiline onDismiss={hideIncorrectManifestVersionError}>
            {t('error.manifest.incorrect.version')}
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
