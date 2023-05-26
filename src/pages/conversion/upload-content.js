import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { conversionSteps, useConversionStore } from 'common/store';
import { logsContainer } from './style';

const conversionStoreSelector = (s) => [s.uploadOperationLog, s.uploadUdId, s.uploadOperationId, s.selectedStep];

const UploadContent = () => {
  const { t } = useTranslation();
  const [uploadOperationLog, uploadUdId, uploadOperationId, selectedStep] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.upload) {
    return null;
  }

  return (
    <div>
      <div>
        <h3>{t('meta.data')}</h3>
        <div>operationId: {uploadOperationId === null ? 'N/A' : uploadOperationId}</div>
        <div>udid: {uploadUdId === null ? 'N/A' : uploadUdId}</div>
      </div>
      <div>
        <h3>{t('operation.log')}</h3>
        <pre className={logsContainer}>{uploadOperationLog}</pre>
      </div>
    </div>
  );
};

export default UploadContent;