import featureFlags from 'common/feature-flags';
import { useFeatureFlags } from 'hooks';
import { useTranslation } from 'react-i18next';

const ButtonText = props => {
  const { isOnLastStep } = props;
  const { isPlacesPreview } = useFeatureFlags();
  const { t } = useTranslation();

  if (featureFlags.onboardingEnabled) {
    if (isPlacesPreview) {
      if (isOnLastStep) return t('convert.download');
      return t('review.plus.convert');
    } else {
      if (isOnLastStep) return t('convert.download');
      return t('review.plus.create');
    }
  } else {
    return t('download');
  }
};

export default ButtonText;
