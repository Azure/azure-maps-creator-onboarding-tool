import { useConversionStore } from 'common/store';
import { conversionStatuses } from 'common/store/conversion.store';
import { stepStyle } from 'components/progress-bar/progress-bar.style';
import { DownloadLogs } from 'pages/conversion/download-logs';
import { formatProgressTime } from 'pages/conversion/format-time';
import StepIcon from 'pages/conversion/icon';
import { actionButtonsContainer, stepTimer, stepTitle } from 'pages/conversion/style';
import { DownloadIMDF } from 'pages/convert/download-imdf';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

const conversionStoreSelector = s => [
  s.uploadStepStatus,
  s.uploadStartTime,
  s.uploadEndTime,
  s.conversionStepStatus,
  s.conversionStartTime,
  s.conversionEndTime,
  s.conversionOperationLog,
  s.diagnosticPackageLocation,
  s.imdfPackageLocation,
];

const StepEntry = props => {
  const { title, stepStatus, startTime, endTime } = props;

  const [elapsedTime, setElapsedTime] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (startTime !== null && endTime !== null) {
      setElapsedTime(formatProgressTime(startTime, endTime));
      clearInterval(intervalRef.current);
    } else if (startTime !== null && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(formatProgressTime(startTime, endTime));
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [startTime, endTime]);

  return (
    <div style={{ width: '30rem' }}>
      <div className={stepStyle}>
        <div className={stepTitle}>
          <StepIcon status={stepStatus} />
          {title}
        </div>
        <span className={stepTimer}>{elapsedTime}</span>
      </div>
    </div>
  );
};

const ConvertTab = () => {
  const [
    uploadStepStatus,
    uploadStartTime,
    uploadEndTime,
    conversionStepStatus,
    conversionStartTime,
    conversionEndTime,
    conversionOperationLog,
    diagnosticPackageLocation,
    imdfPackageLocation,
  ] = useConversionStore(conversionStoreSelector, shallow);

  const { t } = useTranslation();

  return (
    <div>
      <StepEntry
        stepStatus={uploadStepStatus}
        startTime={uploadStartTime}
        endTime={uploadEndTime}
        title={t('package.upload')}
      />
      <StepEntry
        stepStatus={conversionStepStatus}
        startTime={conversionStartTime}
        endTime={conversionEndTime}
        title={t('package.conversion')}
      />

      {conversionStepStatus !== conversionStatuses.empty && conversionStepStatus !== conversionStatuses.inProgress && (
        <div className={actionButtonsContainer}>
          <DownloadLogs
            type="conversion"
            isFailed={conversionStepStatus === conversionStatuses.failed}
            link={diagnosticPackageLocation}
            json={conversionOperationLog}
          />
          {conversionStepStatus !== conversionStatuses.finishedSuccessfully && (
            <DownloadIMDF type="conversion" link={imdfPackageLocation} />
          )}
        </div>
      )}
    </div>
  );
};

export default ConvertTab;
