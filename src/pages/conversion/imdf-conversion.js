import { cx } from '@emotion/css';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { PATHS } from 'common';
import { useConversionStore } from 'common/store';
import { conversionStatuses, useIMDFConversionStatus } from 'common/store/conversion.store';
import FillScreenContainer from 'components/fill-screen-container';
import { useAlert, useCustomNavigate } from 'hooks';
import { useTranslation } from 'react-i18next';
import { DownloadIMDF } from './download-imdf';
import { actionButtonsContainer, messageWrapper } from './imdf-conversion.style';
import { ImdfDiagnostics } from './imdf-diagnostics';
import PlacesPreviewMap from './places-preview-map';
import StepButton from './step-button';
import { container, content, enabledStep, step as stepStyle, stepTitle, stepsContainer } from './style';

const ImdfConversion = () => {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const [uploadStartTime, conversionEndTime, setStep, selectedStep, imdfPackageLocation, diagnosticPackageLocation] =
    useConversionStore(s => [
      s.uploadStartTime,
      s.conversionEndTime,
      s.setStep,
      s.selectedStep,
      s.imdfPackageLocation,
      s.diagnosticPackageLocation,
    ]);

  const { isRunningIMDFConversion, hasCompletedIMDFConversion, imdfConversionStatus, errorList } =
    useIMDFConversionStatus();

  const alert = useAlert({ onOk: () => navigate(PATHS.REVIEW_CREATE) });

  const handleBack = () => {
    alert.ask();
  };

  return (
    <div className={container}>
      <div className={stepsContainer}>
        <button
          onClick={handleBack}
          className={cx(stepStyle, { [enabledStep]: !isRunningIMDFConversion })}
          disabled={isRunningIMDFConversion}
        >
          <div className={stepTitle}>
            <Icon iconName="SkypeArrow" style={{ marginRight: 8 }} />
            Back to configuration
          </div>
        </button>
        <div style={{ borderBottom: '2px solid' }}></div>
        <StepButton
          endTime={conversionEndTime}
          label={t('select.upload.step')}
          status={imdfConversionStatus}
          startTime={uploadStartTime}
          step={-1}
          title="Conversion"
          setStep={setStep}
          selectedStep={selectedStep}
        />
      </div>
      <div className={content}>
        {hasCompletedIMDFConversion && (
          <div>
            {errorList.map(error => (
              <div key={error.key} className={messageWrapper}>
                <MessageBar messageBarType={MessageBarType.error} isMultiline>
                  {error.message}
                </MessageBar>
              </div>
            ))}
            <div className={actionButtonsContainer}>
              {imdfConversionStatus === conversionStatuses.finishedSuccessfully && (
                <DownloadIMDF link={imdfPackageLocation} />
              )}
              <ImdfDiagnostics link={diagnosticPackageLocation} />
            </div>
            {imdfConversionStatus === conversionStatuses.finishedSuccessfully && (
              <FillScreenContainer offsetBottom={110}>
                {({ height }) => <PlacesPreviewMap style={{ height }} />}
              </FillScreenContainer>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImdfConversion;
