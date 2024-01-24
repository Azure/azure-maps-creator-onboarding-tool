import { cx } from '@emotion/css';
import { PrimaryButton } from '@fluentui/react';
import { failedLogsButton, logsButton } from '../conversion/style';

export const DownloadIMDF = ({ isFailed, link, json, type }) => {
  return (
    <a href={link} download target="_blank" rel="noreferrer">
      <PrimaryButton className={cx(logsButton, { [failedLogsButton]: isFailed })}>Download IMDF</PrimaryButton>
    </a>
  );
};
