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
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import nextId from 'react-id-generator';
import { failedLogsButton, logsButton } from '../style';
import { extractMessages, processZip } from './utils';

export const ImdfDiagnostics = ({ isFailed, link }) => {
  const [diagnosticsMessages, setDiagnosticsMessages] = useState([]);

  useEffect(() => {
    if (!link) return;

    processZip(link).then(files => {
      const diagnosticsFile = files.find(file => file.filename === 'ConversionWarningsAndErrors.json');

      if (!diagnosticsFile) return;

      const { content } = diagnosticsFile;
      const messages = extractMessages(content);
      setDiagnosticsMessages(messages.map(message => ({ id: nextId(), message })));
    });
  }, [link]);

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
      <DialogSurface style={{ borderRadius: 2 }}>
        <DialogBody style={{ maxHeight: 600 }}>
          <DialogTitle>Conversion Warnings</DialogTitle>
          <DialogContent style={{ margin: '1rem 0' }}>
            {diagnosticsMessages.length === 0 ? (
              <i>No messages</i>
            ) : (
              diagnosticsMessages.map(message => (
                <div key={message.id} style={{ marginBottom: '0.5rem' }}>
                  <MessageBar messageBarType={MessageBarType.warning} isMultiline>
                    {message.message}
                  </MessageBar>
                </div>
              ))
            )}
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
