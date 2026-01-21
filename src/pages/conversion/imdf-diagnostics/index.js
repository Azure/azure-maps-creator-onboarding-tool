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
import { useReviewManifestStore } from 'common/store';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import nextId from 'react-id-generator';
import { failedLogsButton, logsButton } from '../style';
import { extractMessages, processZip } from './utils';

export const ImdfDiagnostics = ({ isFailed, link }) => {
  const [getOriginalPackageName] = useReviewManifestStore(s => [s.getOriginalPackageName]);
  const [diagnosticsMessages, setDiagnosticsMessages] = useState({ errors: [], warnings: [] });

  useEffect(() => {
    if (!link) return;

    processZip(link).then(files => {
      const diagnosticsFile = files.find(file => file.filename === 'ConversionWarningsAndErrors.json');

      if (!diagnosticsFile) return;

      const { content } = diagnosticsFile;
      const messages = extractMessages(content);

      const messageGroups = {
        errors: messages.errors.map(message => ({ id: nextId(), message })),
        warnings: messages.warnings.map(message => ({ id: nextId(), message })),
      };

      setDiagnosticsMessages(messageGroups);
    });
  }, [link]);

  const handleDownload = async () => {
    if (!link) {
      toast.error('No diagnostics available');
      return;
    }

    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error('Bad Network Response');
      }
      const blob = await response.blob();

      const fileName = `conversionDiagnostics_${getOriginalPackageName()}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`;
      saveAs(blob, fileName);
      toast.success('The download has started');
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <DefaultButton className={cx(logsButton, { [failedLogsButton]: isFailed })}>Show Diagnostics</DefaultButton>
      </DialogTrigger>
      <DialogSurface style={{ borderRadius: 2 }}>
        <DialogBody style={{ maxHeight: 600 }}>
          <DialogTitle>Conversion Issues</DialogTitle>
          <DialogContent style={{ margin: '1rem 0' }}>
            {diagnosticsMessages.errors.length === 0 && diagnosticsMessages.warnings.length === 0 ? (
              <i>No messages</i>
            ) : (
              <>
                {diagnosticsMessages.errors.map(message => (
                  <div key={message.id} style={{ marginBottom: '0.5rem' }}>
                    <MessageBar messageBarType={MessageBarType.error} isMultiline>
                      {message.message}
                    </MessageBar>
                  </div>
                ))}
                {diagnosticsMessages.warnings.map(message => (
                  <div key={message.id} style={{ marginBottom: '0.5rem' }}>
                    <MessageBar messageBarType={MessageBarType.warning} isMultiline>
                      {message.message}
                    </MessageBar>
                  </div>
                ))}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <DefaultButton>Close</DefaultButton>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <PrimaryButton onClick={handleDownload}>Download Full Report</PrimaryButton>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
