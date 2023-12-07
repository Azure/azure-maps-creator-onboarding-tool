import { Icon } from '@fluentui/react/lib/Icon';
import { conversionStatuses } from 'common/store/conversion.store';
import { useTranslation } from 'react-i18next';
import { defaultIcon, failedIcon, inProgressIcon, successIcon } from './style';

const StepIcon = ({ status }) => {
  const { t } = useTranslation();

  if (status === conversionStatuses.deleted) {
    return <Icon iconName="Unknown" aria-label={t('package.conversion')} className={defaultIcon} />;
  }
  if (status === conversionStatuses.finishedSuccessfully) {
    return <Icon iconName="SkypeCircleCheck" aria-label={t('package.conversion')} className={successIcon} />;
  }
  if (status === conversionStatuses.inProgress) {
    return <Icon iconName="SyncStatusSolid" aria-label={t('package.conversion')} className={inProgressIcon} />;
  }
  if (status === conversionStatuses.failed) {
    return <Icon iconName="StatusErrorFull" aria-label={t('package.conversion')} className={failedIcon} />;
  }
  return <Icon iconName="StatusCircleRing" aria-label={t('package.conversion')} className={defaultIcon} />;
};

export default StepIcon;
