import { cx } from '@emotion/css';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useConversionStore } from 'common/store';
import { conversionStatuses, useIMDFConversionStatus } from 'common/store/conversion.store';
import { stepStyle } from 'components/progress-bar/progress-bar.style';
import { DownloadLogs } from 'pages/conversion/download-logs';
import { formatProgressTime } from 'pages/conversion/format-time';
import StepIcon from 'pages/conversion/icon';
import { stepTimer, stepTitle } from 'pages/conversion/style';
import { DownloadIMDF } from 'pages/convert/download-imdf';
import { sectionTitle } from 'pages/summary/summary.style';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import { shallow } from 'zustand/shallow';
import { actionButtonsContainer, convertWrapper, imdfStepStyle, messageWrapper } from './convert.style';

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
    if (startTime === null) {
      setElapsedTime('');
    } else if (startTime !== null && endTime !== null) {
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
    <div>
      <div className={cx(stepStyle, imdfStepStyle)}>
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

  const { isRunningIMDFConversion } = useIMDFConversionStatus();

  const errorList =
    useMemo(() => {
      const json = JSON.parse(conversionOperationLog);
      return (
        json?.details
          ?.map(item => {
            return item?.details?.map(detailItem => {
              return {
                key: nextId(),
                message: detailItem?.message || detailItem?.innererror?.exceptionText,
              };
            });
          })
          .flat() || []
      );
    }, [conversionOperationLog]) || [];

  return (
    <div className={convertWrapper}>
      <div className={sectionTitle}>{isRunningIMDFConversion ? 'Conversion in progress...' : 'Conversion done'}</div>
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
        <div>
          {errorList.map(error => (
            <div key={error.key} className={messageWrapper}>
              <MessageBar messageBarType={MessageBarType.error} isMultiline>
                {error.message}
              </MessageBar>
            </div>
          ))}
          <div className={actionButtonsContainer}>
            <DownloadLogs
              type="conversion"
              link={diagnosticPackageLocation}
              json={conversionOperationLog}
              primaryButton={false}
            />
            {conversionStepStatus === conversionStatuses.finishedSuccessfully && (
              <DownloadIMDF type="conversion" link={imdfPackageLocation} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConvertTab;
