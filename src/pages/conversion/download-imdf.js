import { cx } from '@emotion/css';
import { PrimaryButton } from '@fluentui/react';
import { failedLogsButton, logsButton } from './style';

export const DownloadIMDF = ({ isFailed, link }) => {
  return (
    <a href={link} download target="_blank" rel="noreferrer">
      <PrimaryButton className={cx(logsButton, { [failedLogsButton]: isFailed })}>Download IMDF</PrimaryButton>
    </a>
  );
};
