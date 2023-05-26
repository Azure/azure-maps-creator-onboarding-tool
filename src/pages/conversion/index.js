import { container, content, stepsContainer } from './style';
import UploadButton from './upload-button';
import UploadContent from './upload-content';
import ConversionButton from './conversion-button';
import ConversionContent from './conversion-content';

const Conversion = () => (
  <div className={container}>
    <div className={stepsContainer}>
      <UploadButton />
      <ConversionButton />
    </div>
    <div className={content}>
      <UploadContent />
      <ConversionContent />
    </div>
  </div>
);

export default Conversion;