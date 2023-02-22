import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { progressBarSteps, useCompletedSteps, useProgressBarStore } from 'common/store';
import { errorContainer, progressBarContainer } from './progress-bar.style';
import ProgressBarButton from './progress-bar-button';

const progressBarStoreSelector = (s) => [s.isErrorShown, s.hideError];

export const ProgressBar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const completedSteps = useCompletedSteps();
  const [isErrorShown, hideError] = useProgressBarStore(progressBarStoreSelector, shallow);

  const shouldShowProgressBar = useMemo(() => (
    progressBarSteps.some((step) => step.href === pathname)
  ), [pathname]);

  useEffect(() => {
    if (completedSteps.length === progressBarSteps.length && isErrorShown) {
      hideError();
    }
  }, [completedSteps, isErrorShown, hideError]);

  if (!shouldShowProgressBar) {
    return null;
  }

  return (
    <>
      <div className={errorContainer}>
        {isErrorShown && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
            {t('error.validation.failed.missing.info')}
          </MessageBar>
        )}
      </div>
      <div className={progressBarContainer}>
        {progressBarSteps.map((step) => <ProgressBarButton step={step} key={step.key} />)}
      </div>
    </>
  );
};

export default ProgressBar;