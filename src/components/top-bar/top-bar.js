import { useFeatureFlags } from 'hooks';
import { useTranslation } from 'react-i18next';
import {
  azMapsCreatorTextStyle,
  barStyle,
  docLink,
  linksContainer,
  logoContainer,
  msftAzureTextStyle,
  splitterStyle,
} from './top-bar.style';

const docsLink = 'https://learn.microsoft.com/en-us/azure/azure-maps/drawing-package-guide?pivots=drawing-package-v2';
const feedbackLink =
  'https://feedback.azure.com/d365community/post/fc834083-0925-ec11-b6e6-000d3a4f09d0?page=1&sort=newest';

const TopBar = () => {
  const { t } = useTranslation();
  const { isPlacesPreview } = useFeatureFlags();

  return (
    <div className={barStyle}>
      <div className={logoContainer}>
        <span className={msftAzureTextStyle}>Microsoft Azure</span>
        <span className={splitterStyle} />
        <span className={azMapsCreatorTextStyle}>Azure Maps Creator</span>
      </div>
      <div className={linksContainer}>
        {!isPlacesPreview && (
          <a className={docLink} href={docsLink} target="_blank" rel="noreferrer" aria-label={t('docs.link')}>
            {t('docs')}
          </a>
        )}
        <a className={docLink} href={feedbackLink} target="_blank" rel="noreferrer" aria-label={t('feedback.link')}>
          {t('feedback')}
        </a>
      </div>
    </div>
  );
};

export default TopBar;
