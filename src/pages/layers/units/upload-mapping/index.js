import { Icon } from '@fluentui/react';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { browseButtonContentStyle, browseButtonStyle, fileInputStyle } from '../index.style';

const errors = {
  fileSizeExceeded: 'error.file.size.exceeded',
  fileTypeIncorrect: 'error.file.type.incorrect',
};
const maxFileSize = 1024 * 1024 * 100; // 100 MB
const fileTypes = {
  csv: ['text/csv'],
};

const fileType = 'csv';
const id = 'upload-mapping';

const UploadMapping = props => {
  const { fieldClassName, onFileSelect, onError, file } = props;

  const { t } = useTranslation();

  const fileInputRef = useRef(null);

  const clearFile = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFileSelect(null);
  }, [onFileSelect]);

  const pickFile = useCallback(
    e => {
      const { files } = e.target;

      if (files.length === 0) {
        return;
      }

      const { size, type } = files[0];

      if (size > maxFileSize) {
        clearFile();
        onError(t(errors.fileSizeExceeded));
        return;
      }
      if (!fileTypes[fileType].includes(type)) {
        clearFile();
        onError(t(errors.fileTypeIncorrect, { type: fileType.toUpperCase() }));
        return;
      }

      onFileSelect(files[0]);
    },
    [onError, onFileSelect, clearFile, t]
  );

  useEffect(() => {
    if (file?.name) {
      pickFile({ target: { files: [file] } });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={fieldClassName}>
      <label htmlFor={id} className={browseButtonStyle}>
        <span className={browseButtonContentStyle}>
          <Icon iconName="Upload" style={{ fontSize: 12 }} />
          <span style={{ paddingLeft: '0.5rem' }}>Import CSV</span>
        </span>
      </label>
      <input className={fileInputStyle} id={id} data-testid={id} onChange={pickFile} type="file" ref={fileInputRef} />
    </div>
  );
};

export default UploadMapping;
