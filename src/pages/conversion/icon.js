import { Icon } from '@fluentui/react/lib/Icon';
import { useTranslation } from 'react-i18next';

import { defaultIcon, failedIcon, inProgressIcon, successIcon } from './style';
import { conversionStatuses } from 'common/store/conversion.store';

const StepIcon = ({ status }) => {
  const { t } = useTranslation();

  if (status === conversionStatuses.finishedSuccessfully) {
    return <Icon iconName="SkypeCircleCheck" ariaLabel={t('package.conversion')} className={successIcon} />;
  }
  if (status === conversionStatuses.inProgress) {
    return <Icon iconName="SyncStatusSolid" ariaLabel={t('package.conversion')} className={inProgressIcon} />;
  }
  if (status === conversionStatuses.failed) {
    return <Icon iconName="StatusErrorFull" ariaLabel={t('package.conversion')} className={failedIcon} />;
  }
  return <Icon iconName="StatusCircleRing" ariaLabel={t('package.conversion')} className={defaultIcon} />;
};

export default StepIcon;
