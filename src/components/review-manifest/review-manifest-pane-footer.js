import { useCallback } from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';

import { useReviewManifestJson, useReviewManifestStore } from 'common/store/review-manifest.store';
import { buttonStyle, reviewManifestFooter } from './review-manifest.style';

const reviewManifestSelector = (s) => s.hidePane;
export const filename = 'manifest.json';
export const fileType = 'application/json';

const Footer = () => {
  const hidePane = useReviewManifestStore(reviewManifestSelector);
  const json = useReviewManifestJson();
  const { t } = useTranslation();

  const saveFile = useCallback(() => {
    saveAs(
      new Blob([JSON.stringify(json, null, 2)], {
        type: fileType,
      }),
      filename,
    );
  }, [json]);

  return (
    <div className={reviewManifestFooter}>
      <PrimaryButton className={buttonStyle} onClick={saveFile} data-test-id='download-manifest-button'>
        {t('download')}
      </PrimaryButton>
      <DefaultButton className={buttonStyle} onClick={hidePane}>
        {t('cancel')}
      </DefaultButton>
    </div>
  );
};

export default Footer;