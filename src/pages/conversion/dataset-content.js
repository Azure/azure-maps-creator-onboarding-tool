import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { conversionSteps, useConversionStore } from 'common/store';
import { logsContainer } from './style';

const conversionStoreSelector = (s) => [s.datasetOperationLog, s.datasetId, s.datasetOperationId, s.selectedStep];

const DatasetContent = () => {
  const { t } = useTranslation();
  const [datasetOperationLog, datasetId, datasetOperationId, selectedStep] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.dataset) {
    return null;
  }

  return (
    <div>
      <div>
        <h3>{t('meta.data')}</h3>
        <div>operationId: {datasetOperationId === null ? 'N/A' : datasetOperationId}</div>
        <div>datasetId: {datasetId === null ? 'N/A' : datasetId}</div>
      </div>
      <div>
        <h3>{t('operation.log')}</h3>
        <pre className={logsContainer}>{datasetOperationLog}</pre>
      </div>
    </div>
  );
};

export default DatasetContent;