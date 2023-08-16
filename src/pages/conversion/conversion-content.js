import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { conversionSteps, useConversionStore, conversionStatuses } from 'common/store/conversion.store';
import {
  boldHeader,
  contentContainer,
  logContainer,
  metaInfoContainer,
} from './style';
import { Log } from './log';
import { DownloadLogs } from './download-logs';
import CopyIcon from './copy-icon';

const conversionStoreSelector = (s) => [s.conversionStepStatus, s.conversionOperationLog, s.selectedStep, s.conversionId, s.diagnosticPackageLocation];

const ConversionContent = () => {
  const { t } = useTranslation();
  const [conversionStepStatus, operationLog, selectedStep, conversionId, diagnosticPackageLocation] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.conversion) {
    return null;
  }

  return (
    <div className={contentContainer}>
      <div className={metaInfoContainer}>
        <span className={boldHeader}>ConversionId</span>: {conversionId === null ? '' : conversionId}
        <CopyIcon textToCopy={conversionId} />
      </div>
      <div className={logContainer}>
        <h3>{t('operation.log')}</h3>
        <Log src={operationLog} />
      </div>
      {conversionStepStatus !== conversionStatuses.empty && conversionStepStatus !== conversionStatuses.inProgress &&
        <DownloadLogs type='conversion' isFailed={conversionStepStatus === conversionStatuses.failed}
                      link={diagnosticPackageLocation} json={operationLog} />}
    </div>
  );
};

export default ConversionContent;