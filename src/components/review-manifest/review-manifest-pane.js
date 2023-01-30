import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';

import { useReviewManifestJson, useReviewManifestStore } from 'common/store/review-manifest.store';
import { panelStyle } from './review-manifest.style';
import Footer from './review-manifest-pane-footer';

const reviewManifestSelector = (s) => s.hidePane;

const ReviewManifestPane = () => {
  const hidePane = useReviewManifestStore(reviewManifestSelector);
  const json = useReviewManifestJson();
  const { t } = useTranslation();

  const onRenderFooterContent = useCallback(
    () => <Footer />,
    [],
  );

  return (
    <Panel headerText={t('review.manifest')} isLightDismiss isOpen={true} onDismiss={hidePane}
           closeButtonAriaLabel={t('close')} type={PanelType.medium} styles={panelStyle}
           onRenderFooterContent={onRenderFooterContent} isFooterAtBottom={true}>
      <ReactJson src={json} iconStyle='square' indentWidth={2} displayDataTypes={false} name={false}
                 displayObjectSize={false} enableClipboard={false} displayArrayKey={false} />
    </Panel>
  );
};

export default ReviewManifestPane;