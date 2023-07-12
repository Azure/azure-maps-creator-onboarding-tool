import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { container, content, stepsContainer } from './style';
import UploadContent from './upload-content';
import ConversionContent from './conversion-content';
import DatasetContent from './dataset-content';
import TilesetContent from './tileset-content';
import StepButton from './step-button';
import { conversionSteps, useConversionStore } from 'common/store';
import { deleteCreatedData } from 'common/api/conversion';

const unloadCallback = () => {
  deleteCreatedData();
};
const beforeUnload = (e) => {
  e.preventDefault();
  return (e.returnValue = '');
};

const conversionStoreSelector = (s) => [
  s.uploadStepStatus,
  s.uploadStartTime,
  s.uploadEndTime,
  s.conversionStepStatus,
  s.conversionStartTime,
  s.conversionEndTime,
  s.datasetStepStatus,
  s.datasetStartTime,
  s.datasetEndTime,
  s.tilesetStepStatus,
  s.tilesetStartTime,
  s.tilesetEndTime,
];

const Conversion = () => {
  const { t } = useTranslation();

  const [
    uploadStepStatus,
    uploadStartTime,
    uploadEndTime,
    conversionStepStatus,
    conversionStartTime,
    conversionEndTime,
    datasetStepStatus,
    datasetStartTime,
    datasetEndTime,
    tilesetStepStatus,
    tilesetStartTime,
    tilesetEndTime,
  ] = useConversionStore(conversionStoreSelector, shallow);

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('unload', unloadCallback);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('unload', unloadCallback);
    };
  }, []);

  return (
    <div className={container}>
      <div className={stepsContainer}>
        <StepButton endTime={uploadEndTime} label={t('select.upload.step')} status={uploadStepStatus}
                    startTime={uploadStartTime} step={conversionSteps.upload} title={t('package.upload')} />
        <StepButton endTime={conversionEndTime} label={t('select.conversion.step')} status={conversionStepStatus}
                    startTime={conversionStartTime} step={conversionSteps.conversion} title={t('package.conversion')} />
        <StepButton endTime={datasetEndTime} label={t('select.dataset.step')} status={datasetStepStatus}
                    startTime={datasetStartTime} step={conversionSteps.dataset} title={t('dataset.creation')} />
        <StepButton endTime={tilesetEndTime} label={t('select.tileset.step')} status={tilesetStepStatus}
                    startTime={tilesetStartTime} step={conversionSteps.tileset} title={t('tileset.creation')} />
      </div>
      <div className={content}>
        <UploadContent />
        <ConversionContent />
        <DatasetContent />
        <TilesetContent />
      </div>
    </div>
  );
};

export default Conversion;