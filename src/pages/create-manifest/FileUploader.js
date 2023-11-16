import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TEST_ID } from './create-manifest';
import { browseButtonContentStyle, fileInputStyle, selectFileButtonClassName } from './create-manifest.style';

const errors = {
  fileSizeExceeded: 'error.file.size.exceeded',
  fileTypeIncorrect: 'error.file.type.incorrect',
};

const maxFileSize = 1024 * 1024 * 100; // 100 MB
const fileTypes = {
  zip: ['application/x-zip', 'application/x-zip-compressed', 'application/zip', 'application/zip-compressed'],
  json: ['application/json'],
};

const FileUploader = ({ id, onFileSelect, fileType, onError }) => {
  const { t } = useTranslation();
  const [filename, setFilename] = useState('');

  const onTextFieldClick = useCallback(() => {
    document.getElementById(id).click();
  }, [id]);

  const pickFile = useCallback(
    e => {
      const { files } = e.target;

      if (files.length === 0) {
        // the only way to upload no files is to click Cancel button in browse menu, so no action required.
        return;
      }

      const { name, size, type } = files[0];

      if (size > maxFileSize) {
        setFilename('');
        onFileSelect(null);
        onError(t(errors.fileSizeExceeded));
        return;
      }
      if (!fileTypes[fileType].includes(type)) {
        setFilename('');
        onFileSelect(null);
        onError(t(errors.fileTypeIncorrect, { type: fileType.toUpperCase() }));
        return;
      }

      setFilename(name);
      onFileSelect(files[0]);
    },
    [fileType, onError, onFileSelect, setFilename, t]
  );

  return (
    <div>
      {filename && (
        <div
          data-testid={TEST_ID.FILE_NAME_FIELD}
          onClick={onTextFieldClick}
          style={{
            cursor: 'pointer',
            maxWidth: 300,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            opacity: 0.7,
          }}
        >
          {filename}
        </div>
      )}
      {!filename && (
        <label htmlFor={id} className={selectFileButtonClassName}>
          <span className={browseButtonContentStyle}>Select File</span>
        </label>
      )}
      <input className={fileInputStyle} id={id} data-testid={id} onChange={pickFile} type="file" />
    </div>
  );
};

export default FileUploader;
