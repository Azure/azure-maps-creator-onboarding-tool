import { cx } from '@emotion/css';
import { TextField } from '@fluentui/react';
import FieldError from 'components/field-error';
import FieldLabel from 'components/field-label';
import DeleteIcon from 'pages/layers/delete-icon';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TEST_ID } from '../../pages/create-manifest/create-manifest';
import {
  browseButtonContentStyle,
  browseButtonStyle,
  fieldStyle,
  fileInputStyle,
  formRowStyle,
  inputStyles,
  textFieldStyle,
} from '../../pages/create-manifest/create-manifest.style';

const errors = {
  fileSizeExceeded: 'error.file.size.exceeded',
  fileTypeIncorrect: 'error.file.type.incorrect',
};
const maxFileSize = 1024 * 1024 * 100; // 100 MB
const fileTypes = {
  zip: ['application/x-zip', 'application/x-zip-compressed', 'application/zip', 'application/zip-compressed'],
  json: ['application/json'],
  csv: ['text/csv'],
};

const FileField = props => {
  const {
    fieldClassName,
    id,
    label,
    onFileSelect,
    fileType,
    onError,
    tooltip,
    required = true,
    file,
    allowClear,
    showError = true,
    errorMessage,
  } = props;

  const { t } = useTranslation();
  const [filename, setFilename] = useState('');

  const onTextFieldClick = useCallback(() => {
    document.getElementById(id).click();
  }, [id]);
  const onTextFieldKeyPress = useCallback(
    e => {
      if (e.key === 'Enter') {
        document.getElementById(id).click();
      }
    },
    [id]
  );

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

  useEffect(() => {
    if (file?.name) {
      pickFile({ target: { files: [file] } });
    }
    // eslint-disable-next-line
  }, []);

  const message = useMemo(() => {
    if (typeof errorMessage === 'string') return errorMessage;
    if (typeof errorMessage === 'function') return errorMessage();
  }, [errorMessage]);

  const handleRemoveFile = () => {
    setFilename('');
    onFileSelect(null);
  };

  return (
    <div className={formRowStyle}>
      <div>
        <FieldLabel required={required} tooltip={tooltip}>
          {label}
        </FieldLabel>
      </div>
      <div className={cx(fieldStyle, fieldClassName)}>
        <TextField
          value={filename}
          className={textFieldStyle}
          data-testid={TEST_ID.FILE_NAME_FIELD}
          ariaLabel={label}
          aria-required={required}
          readOnly
          styles={inputStyles}
          onClick={onTextFieldClick}
          onKeyPress={onTextFieldKeyPress}
          errorMessage={showError && message && <FieldError text={message} />}
        />
        {allowClear && filename && <DeleteIcon onDelete={handleRemoveFile} />}
        <label htmlFor={id} className={browseButtonStyle}>
          <span className={browseButtonContentStyle}>{t('browse')}</span>
        </label>
        <input className={fileInputStyle} id={id} data-testid={id} onChange={pickFile} type="file" />
      </div>
    </div>
  );
};

FileField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  fileType: PropTypes.oneOf(['zip', 'json', 'csv']).isRequired,
  onError: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
};

export default FileField;
