import { conversionContainer, logsContainer, stepsContainer } from './conversion.style';
import UploadButton from './upload-button';
import UploadContent from './upload-content';

const Conversion = () => {
  return (
    <div className={conversionContainer}>
      <div className={stepsContainer}>
        <UploadButton selected />
      </div>
      <div className={logsContainer}>
        <UploadContent selected />
      </div>
    </div>
  );
};

export default Conversion;