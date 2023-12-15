import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import { PATHS } from 'common';
import { progressBarStepsByKey, useCompletedSteps, useResponseStore, useUserStore } from 'common/store';
import { LRO_STATUS } from 'common/store/response.store';
import { useCustomNavigate } from 'hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { containerStyle, progressIndicatorLabel, progressIndicatorStyles } from './processing.style';
export const REFRESH_INTERVAL = 1;

const LABEL = {
  UPLOADING: 'processing.label.uploading',
  RUNNING: 'processing.label.processing',
};

const responseStoreSelector = s => [s.errorMessage, s.lroStatus, s.refreshStatus];
const subKeySelector = s => s.subscriptionKey;

const ProcessingPage = () => {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const completedSteps = useCompletedSteps();

  const [label, setLabel] = useState();

  const subscriptionKey = useUserStore(subKeySelector);
  const [errorMessage, lroStatus, refreshStatus] = useResponseStore(responseStoreSelector, shallow);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshStatus(subscriptionKey);
    }, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (lroStatus) {
      case LRO_STATUS.UPLOADING:
        setLabel(LABEL.UPLOADING);
        break;
      case LRO_STATUS.UPLOADED:
      case LRO_STATUS.ACCEPTED:
      case LRO_STATUS.RUNNING:
      case LRO_STATUS.FETCHING_DATA:
        setLabel(LABEL.RUNNING);
        break;
      case LRO_STATUS.SUCCEEDED:
        if (!completedSteps.includes(progressBarStepsByKey.levels)) {
          navigate(PATHS.LEVELS);
        } else if (!completedSteps.includes(progressBarStepsByKey.layers)) {
          navigate(PATHS.LAYERS);
        } else if (!completedSteps.includes(progressBarStepsByKey.createGeoreference)) {
          navigate(PATHS.CREATE_GEOREFERENCE);
        } else {
          navigate(PATHS.REVIEW_CREATE);
        }
        break;
      default:
        navigate(PATHS.INDEX);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lroStatus]);

  useEffect(() => {
    if (errorMessage === '') {
      return;
    }
    navigate(PATHS.INDEX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div className={containerStyle}>
      <ProgressIndicator label={t(label)} className={progressIndicatorStyles} styles={progressIndicatorLabel} />
    </div>
  );
};

export default ProcessingPage;
