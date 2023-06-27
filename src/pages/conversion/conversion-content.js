import { shallow } from 'zustand/shallow';
import { Trans, useTranslation } from 'react-i18next';
import { Pivot, PivotItem, PrimaryButton } from '@fluentui/react';

import { conversionSteps, useConversionStore } from 'common/store';
import { diagnosticDescription, logsContainer } from './style';
import LinkText from 'common/translations/link-text';

const conversionStoreSelector = (s) => [s.conversionOperationLog, s.conversionOperationId, s.selectedStep, s.conversionId, s.diagnosticPackageLocation];
const diagnosticDocsUrl = 'https://docs.microsoft.com/en-us/azure/azure-maps/drawing-error-visualizer';

const ConversionContent = () => {
  const { t } = useTranslation();
  const [operationLog, operationId, selectedStep, conversionId, diagnosticPackageLocation] = useConversionStore(conversionStoreSelector, shallow);

  if (selectedStep !== conversionSteps.conversion) {
    return null;
  }

  return (
    <div>
      <Pivot>
        <PivotItem headerText={t('logs')} headerButtonProps={{ 'data-title': t('logs') }} >
          <div>
            <h3>{t('meta.data')}</h3>
            <div>operationId: {operationId === null ? 'N/A' : operationId}</div>
            <div>conversionId: {conversionId === null ? 'N/A' : conversionId}</div>
          </div>
          <div>
            <h3>{t('operation.log')}</h3>
            <pre className={logsContainer}>{operationLog}</pre>
          </div>
        </PivotItem>
        <PivotItem headerText={t('diagnostic.package')} headerButtonProps={{ 'data-title': t('diagnostic.package') }}>
          <div className={diagnosticDescription}>
            <Trans i18nKey='diagnostic.description.text' components={[
              <LinkText href={diagnosticDocsUrl} />
            ]} />
          </div>
          <a href={diagnosticPackageLocation} download>
            <PrimaryButton disabled={!diagnosticPackageLocation}>
              {t('download')}
            </PrimaryButton>
          </a>
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default ConversionContent;