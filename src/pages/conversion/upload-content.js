import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { useConversionStore } from 'common/store';

const conversionStoreSelector = (s) => [s.uploadOperationLog, s.uploadUdId, s.uploadOperationId];

const UploadContent = ({ selected }) => {
  const { t } = useTranslation();
  const [uploadOperationLog, uploadUdId, uploadOperationId] = useConversionStore(conversionStoreSelector, shallow);

  if (!selected) {
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
        <pre>{uploadOperationLog}</pre>
      </div>
    </div>
  );
};

export default UploadContent;