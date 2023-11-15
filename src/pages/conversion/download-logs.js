import { PrimaryButton } from '@fluentui/react';
import { cx } from '@emotion/css';
import { saveAs } from 'file-saver';

import { downloadLogsContainer, failedLogsButton, logsButton } from './style';

const logTypes = {
  upload: 'Upload',
  conversion: 'Conversion',
  dataset: 'Dataset',
  tileset: 'Tileset',
};
const defaultFileName = 'WarningsAndErrors.json';

export const DownloadLogs = ({ isFailed, link, json, type }) => {
  if (link) {
    return (
      <a href={link} download target="_blank" rel="noreferrer">
        <PrimaryButton className={cx(logsButton, { [failedLogsButton]: isFailed })}>Download logs</PrimaryButton>
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
        <PrimaryButton onClick={saveLog} className={cx(logsButton, { [failedLogsButton]: isFailed })}>
          Download logs
        </PrimaryButton>
      </div>
    );
  }

  return null;
};
