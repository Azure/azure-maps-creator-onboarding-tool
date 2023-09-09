import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cx } from '@emotion/css';
import { Icon } from '@fluentui/react/lib/Icon';

import { PATHS } from 'common';
import {
  container,
  content,
  enabledStep,
  step as stepStyle,
  stepsContainer,
  stepTitle,
} from './style';
import UploadContent from './upload-content';
import ConversionContent from './conversion-content';
import DatasetContent from './dataset-content';
import TilesetContent from './tileset-content';
import MapContent from './map-content';
import StepButton from './step-button';
import { conversionSteps, useConversionStore } from 'common/store';
import { conversionStatuses } from 'common/store/conversion.store';

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
  const navigate = useNavigate();

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

  return (
    <div className={container}>
      <div className={stepsContainer}>
        <button onClick={() => navigate(PATHS.CONVERSIONS)} className={cx(stepStyle, enabledStep)}>
          <div className={stepTitle}>
            <Icon iconName='SkypeArrow' style={{marginRight: 8}} />
            {t('view.all.conversions')}
          </div>
        </button>
        <div style={{borderBottom: '2px solid'}}></div>
        <StepButton endTime={uploadEndTime} label={t('select.upload.step')} status={uploadStepStatus}
                    startTime={uploadStartTime} step={conversionSteps.upload} title={t('package.upload')} />
        <StepButton endTime={conversionEndTime} label={t('select.conversion.step')} status={conversionStepStatus}
                    startTime={conversionStartTime} step={conversionSteps.conversion} title={t('package.conversion')} />
        <StepButton endTime={datasetEndTime} label={t('select.dataset.step')} status={datasetStepStatus}
                    startTime={datasetStartTime} step={conversionSteps.dataset} title={t('dataset.creation')} />
        <StepButton endTime={tilesetEndTime} label={t('select.tileset.step')} status={tilesetStepStatus}
                    startTime={tilesetStartTime} step={conversionSteps.tileset} title={t('tileset.creation')} />
        <StepButton label={t('select.map')} status={tilesetStepStatus} step={conversionSteps.map} title={t('map')}
                    disabled={tilesetStepStatus !== conversionStatuses.finishedSuccessfully} />
      </div>
      <div className={content}>
        <UploadContent />
        <ConversionContent />
        <DatasetContent />
        <TilesetContent />
        <MapContent />
      </div>
    </div>
  );
};

export default Conversion;