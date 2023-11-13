import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cx } from '@emotion/css';
import { Icon } from '@fluentui/react/lib/Icon';

import { PATHS } from 'common';
import { container, content, enabledStep, step as stepStyle, stepsContainer, stepTitle } from './style';
import UploadContent from './upload-content';
import ConversionContent from './conversion-content';
import DatasetContent from './dataset-content';
import TilesetContent from './tileset-content';
import MapContent from './map-content';
import StepButton from './step-button';
import { conversionSteps } from 'common/store';
import { useConversionPastStore } from 'common/store/conversion-past.store';

import { conversionStatuses } from 'common/store/conversion.store';

const conversionStoreSelector = s => [
  s.uploadStepStatus,
  s.uploadStartTime,
  s.uploadEndTime,
  s.uploadOperationLog,
  s.uploadUdId,
  s.conversionStepStatus,
  s.conversionStartTime,
  s.conversionEndTime,
  s.conversionOperationLog,
  s.conversionId,
  s.diagnosticPackageLocation,
  s.datasetStepStatus,
  s.datasetStartTime,
  s.datasetEndTime,
  s.datasetOperationLog,
  s.datasetId,
  s.tilesetStepStatus,
  s.tilesetStartTime,
  s.tilesetEndTime,
  s.tilesetOperationLog,
  s.tilesetId,
  s.mapConfigurationId,
  s.bbox,
  s.setStep,
  s.selectedStep,
];

const Conversion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [
    uploadStepStatus,
    uploadStartTime,
    uploadEndTime,
    uploadOperationLog,
    uploadUdId,
    conversionStepStatus,
    conversionStartTime,
    conversionEndTime,
    conversionOperationLog,
    conversionId,
    diagnosticPackageLocation,
    datasetStepStatus,
    datasetStartTime,
    datasetEndTime,
    datasetOperationLog,
    datasetId,
    tilesetStepStatus,
    tilesetStartTime,
    tilesetEndTime,
    tilesetOperationLog,
    tilesetId,
    mapConfigurationId,
    bbox,
    setStep,
    selectedStep,
  ] = useConversionPastStore(conversionStoreSelector, shallow);

  return (
    <div className={container}>
      <div className={stepsContainer}>
        <button onClick={() => navigate(PATHS.CONVERSIONS)} className={cx(stepStyle, enabledStep)}>
          <div className={stepTitle}>
            <Icon iconName="SkypeArrow" style={{ marginRight: 8 }} />
            {t('view.all.conversions')}
          </div>
        </button>
        <div style={{ borderBottom: '2px solid' }}></div>
        <StepButton
          endTime={uploadEndTime}
          label={t('select.upload.step')}
          status={uploadStepStatus}
          startTime={uploadStartTime}
          step={conversionSteps.upload}
          title={t('package.upload')}
          setStep={setStep}
          selectedStep={selectedStep}
        />
        <StepButton
          endTime={conversionEndTime}
          label={t('select.conversion.step')}
          status={conversionStepStatus}
          startTime={conversionStartTime}
          step={conversionSteps.conversion}
          title={t('package.conversion')}
          setStep={setStep}
          selectedStep={selectedStep}
        />
        <StepButton
          endTime={datasetEndTime}
          label={t('select.dataset.step')}
          status={datasetStepStatus}
          startTime={datasetStartTime}
          step={conversionSteps.dataset}
          title={t('dataset.creation')}
          setStep={setStep}
          selectedStep={selectedStep}
        />
        <StepButton
          endTime={tilesetEndTime}
          label={t('select.tileset.step')}
          status={tilesetStepStatus}
          startTime={tilesetStartTime}
          step={conversionSteps.tileset}
          title={t('tileset.creation')}
          setStep={setStep}
          selectedStep={selectedStep}
        />
        <StepButton
          label={t('select.map')}
          status={tilesetStepStatus}
          step={conversionSteps.map}
          title={t('map')}
          disabled={tilesetStepStatus !== conversionStatuses.finishedSuccessfully}
          setStep={setStep}
          selectedStep={selectedStep}
        />
      </div>
      <div className={content}>
        <UploadContent
          uploadStepStatus={uploadStepStatus}
          uploadOperationLog={uploadOperationLog}
          uploadUdId={uploadUdId}
          selectedStep={selectedStep}
        />
        <ConversionContent
          conversionStepStatus={conversionStepStatus}
          conversionOperationLog={conversionOperationLog}
          selectedStep={selectedStep}
          conversionId={conversionId}
          diagnosticPackageLocation={diagnosticPackageLocation}
        />
        <DatasetContent
          datasetStepStatus={datasetStepStatus}
          datasetOperationLog={datasetOperationLog}
          datasetId={datasetId}
          selectedStep={selectedStep}
        />
        <TilesetContent
          tilesetStepStatus={tilesetStepStatus}
          tilesetOperationLog={tilesetOperationLog}
          selectedStep={selectedStep}
          mapConfigurationId={mapConfigurationId}
          tilesetId={tilesetId}
        />
        <MapContent selectedStep={selectedStep} mapConfigurationId={mapConfigurationId} bbox={bbox} />
      </div>
    </div>
  );
};

export default Conversion;
