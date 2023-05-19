import { cx } from '@emotion/css';
import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { selectedStep, step, stepTimer, stepTitle } from './conversion.style';
import Icon from './icon';
import { useConversionStore } from 'common/store';
import { formatProgressTime } from './format-time';

const conversionStoreSelector = (s) => [s.uploadStepStatus, s.uploadOperationLog, s.uploadStartTime, s.uploadEndTime, s.uploadUdId, s.uploadOperationId];

const UploadButton = ({ selected }) => {
  const { t } = useTranslation();
  const [uploadStepStatus, uploadStartTime, uploadEndTime] = useConversionStore(conversionStoreSelector, shallow);

  return (
    <div className={cx(step, { [selectedStep]: selected })}>
      <div className={stepTitle}>
        <Icon status={uploadStepStatus} />
        {t('package.upload')}
      </div>
      <span className={stepTimer}>{formatProgressTime(uploadStartTime, uploadEndTime)}</span>
    </div>
  );
};

export default UploadButton;