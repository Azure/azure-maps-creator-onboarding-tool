import { PrimaryButton } from '@fluentui/react';
import { useReviewManifestStore } from 'common/store';
import { usePlacesReviewManifestJson } from 'common/store/review-manifest.store';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { primaryButtonStyle } from 'pages/create-manifest/create-manifest.style';
import { shallow } from 'zustand/shallow';

const reviewManifestSelector = s => [s.createPackageWithJson, s.getOriginalPackageName];

const DownloadConfigButton = props => {
  const [createPackageWithJson, getOriginalPackageName] = useReviewManifestStore(reviewManifestSelector);
  const placesJson = usePlacesReviewManifestJson();

  const handleDownload = () => {
    createPackageWithJson(placesJson).then(file => {
      saveAs(file, `buildingConfig_${getOriginalPackageName()}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`);
    });
  };

  return (
    <PrimaryButton className={primaryButtonStyle} onClick={handleDownload} {...props}>
      Download Configuration
    </PrimaryButton>
  );
};

export default DownloadConfigButton;
