import { TooltipHost } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { conversionStatuses } from 'common/store/conversion.store';
import { useTranslation } from 'react-i18next';
import { checkIcon, crossIcon, inProgressIcon } from './style';

export const StatusIcon = ({ item, deleted }) => {
  const { t } = useTranslation();

  if (deleted)
    return (
      <TooltipHost content={t('resource.deleted')}>
        <Icon aria-label="Tooltip" iconName="Unknown" />
      </TooltipHost>
    );

  if (!item) {
    return <Icon aria-label="Tooltip" iconName="CircleRing" />;
  }

  const status = item.uploadStatus ?? item.conversionStatus ?? item.datasetStatus ?? item.tilesetStatus;

  switch (status) {
    case conversionStatuses.empty:
      return <Icon iconName="CircleRing" />;
    case conversionStatuses.inProgress:
      return <Icon iconName="SyncStatusSolid" className={inProgressIcon} />;
    case conversionStatuses.failed:
      return <Icon iconName="StatusErrorFull" className={crossIcon} />;
    default:
      return <Icon iconName="SkypeCircleCheck" className={checkIcon} />;
  }
};
