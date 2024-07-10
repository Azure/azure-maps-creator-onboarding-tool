import { cx } from '@emotion/css';
import { DefaultButton, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components';
import { useConversionStore } from 'common/store';
import DiagnosticsVisualization from 'components/diagnostics-visualization';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import nextId from 'react-id-generator';
import { failedLogsButton, logsButton } from '../style';
import { extractMessages, processZip } from './utils';

export const ImdfDiagnostics = ({ isFailed, link }) => {
  const [diagnosticsMessages, setDiagnosticsMessages] = useState({ errors: [], warnings: [] });
  const [setDiagnosticData] = useConversionStore(s => [s.setDiagnosticData]);

  useEffect(() => {
    if (!link) return;

    processZip(link).then(files => {
      const diagnosticsFile = files.find(file => file.filename === 'ConversionWarningsAndErrors.json');

      if (!diagnosticsFile) return;

      const { content } = diagnosticsFile;
      const messages = extractMessages(content);
      setDiagnosticData(content);

      const messageGroups = {
        errors: messages.errors.map(message => ({ id: nextId(), message })),
        warnings: messages.warnings.map(message => ({ id: nextId(), message })),
      };

      setDiagnosticsMessages(messageGroups);
    });
  }, [link, setDiagnosticData]);

  const handleDownload = () => {
    if (!link) {
      toast.error('No diagnostics available');
      return;
    }

    const linkUrl = link;
    const anchor = document.createElement('a');
    anchor.href = linkUrl;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <DefaultButton className={cx(logsButton, { [failedLogsButton]: isFailed })}>Show Diagnostics</DefaultButton>
      </DialogTrigger>
      <DialogSurface style={{ borderRadius: 2, maxWidth: 'calc(100vw - 20px)' }}>
        <DialogBody style={{ maxHeight: 'calc(100vh - 100px)', height: 'calc(100vh - 100px)' }}>
          <DialogTitle>Conversion Issues</DialogTitle>
          <DialogContent style={{ margin: '1rem 0' }}>
            <DiagnosticsVisualization />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <DefaultButton>Close</DefaultButton>
            </DialogTrigger>
            <PrimaryButton onClick={handleDownload}>Download Full Report</PrimaryButton>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
