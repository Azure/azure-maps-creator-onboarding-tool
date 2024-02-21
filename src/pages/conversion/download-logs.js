import { cx } from '@emotion/css';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { saveAs } from 'file-saver';

import { downloadLogsContainer, failedLogsButton, logsButton } from './style';

const logTypes = {
  upload: 'Upload',
  conversion: 'Conversion',
  dataset: 'Dataset',
  tileset: 'Tileset',
};
const defaultFileName = 'WarningsAndErrors.json';

export const DownloadLogs = props => {
  const { isFailed, link, json, type, primaryButton = true } = props;

  const Button = primaryButton ? PrimaryButton : DefaultButton;

  if (link) {
    return (
      <a href={link} download target="_blank" rel="noreferrer">
        <Button className={cx(logsButton, { [failedLogsButton]: isFailed })}>Download logs</Button>
      </a>
    );
  }

  if (json) {
    const fileName = logTypes[type] ? `${logTypes[type]}${defaultFileName}` : defaultFileName;
    const fileToSave = new Blob([json], {
      type: 'application/json',
    });
    const saveLog = () => saveAs(fileToSave, fileName);
    return (
      <div className={downloadLogsContainer}>
        <Button onClick={saveLog} className={cx(logsButton, { [failedLogsButton]: isFailed })}>
          Download logs
        </Button>
      </div>
    );
  }

  return null;
};
