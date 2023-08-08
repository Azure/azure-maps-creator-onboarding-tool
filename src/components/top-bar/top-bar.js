import { useTranslation } from 'react-i18next';
import { Icon } from '@fluentui/react/lib/Icon';

import {
  azMapsCreatorTextStyle,
  barStyle,
  docLink,
  logoContainer,
  msftAzureTextStyle,
  splitterStyle,
} from './top-bar.style';

const docsLink = 'https://learn.microsoft.com/en-us/azure/azure-maps/drawing-package-guide?pivots=drawing-package-v2';

const TopBar = () => {
  const { t } = useTranslation();

  return (
    <div className={barStyle}>
      <div className={logoContainer}>
        <span className={msftAzureTextStyle}>Microsoft Azure</span>
        <span className={splitterStyle}/>
        <span className={azMapsCreatorTextStyle}>Azure Maps Creator</span>
      </div>
      <a className={docLink} href={docsLink} target='_blank' rel='noreferrer' aria-label={t('docs.link')}>
        {t('docs')}&nbsp;
        <Icon iconName='NavigateExternalInline' />
      </a>
    </div>
  );
};

export default TopBar;