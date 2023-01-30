import { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cx } from '@emotion/css';
import { DefaultButton, Dropdown, MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react';
import { shallow } from'zustand/shallow';

import FieldLabel from 'components/field-label';
import { CONSTANTS, PATHS } from 'common';
import { useUserStore, useResponseStore } from 'common/store';
import FileField from './file-field';
import {
  buttonLabelStyle,
  containerStyle,
  defaultButtonStyle,
  dropdownStyle,
  errorBannerHidden,
  errorBannerStyle,
  fieldStyle,
  formRowStyle,
  headerStyle,
  inputStyles,
  primaryButtonStyle,
  textFieldStyle,
} from './create-manifest.style';

export const TEST_ID = {
  CANCEL_BUTTON: 'cancel-button',
  ERROR_BAR: 'error-bar',
  FILE_NAME_FIELD: 'file-name-field',
  FILE_UPLOAD_FIELD: 'file-upload-field',
  MANIFEST_UPLOAD_FIELD: 'manifest-upload-field',
  SUBSCRIPTION_KEY_FIELD: 'subscription-key-field',
  UPLOAD_BUTTON: 'upload-button',
};

const userStoreSelector = (s) => [s.setGeography, s.geography, s.setSubscriptionKey, s.subscriptionKey];
const responseStoreSelector = (s) => [s.acknowledgeError, s.errorMessage, s.uploadFile, s.setExistingManifestJson];

const CreateManifestPage = ({ allowEdit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState(null);
  const [manifestFileChosen, setManifestFileChosen] = useState(false);

  const [setGeo, geo, setSubKey, subKey] = useUserStore(userStoreSelector, shallow);
  const [acknowledgeApiError, apiErrorMessage, uploadFile, setExistingManifestJson] = useResponseStore(responseStoreSelector, shallow);

  const environmentOptions = useMemo(() => (
    Object.keys(CONSTANTS.GEO).map((geography) => ({
      key: geography,
      text: t(CONSTANTS.GEO[geography].TEXT),
    }))
  ), [t]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => acknowledgeApiError, []);

  useEffect(() => {
    if (apiErrorMessage) {
      setErrorMessage(apiErrorMessage);
    }
  }, [apiErrorMessage]);

  const uploadButtonOnClick = useCallback(() => {
    if (file === null || subKey === '') {
      return;
    }

    if (!allowEdit) {
      setExistingManifestJson(null);
    }

    uploadFile(file, geo, subKey);
    navigate(PATHS.PROCESSING);
  }, [allowEdit, file, geo, navigate, subKey, setExistingManifestJson, uploadFile]);

  const navigateHome = useCallback(() => navigate(PATHS.INDEX), [navigate]);
  const updateSubKey = useCallback((e) => setSubKey(e.target.value), [setSubKey]);
  const updateGeo = useCallback((_, option) => setGeo(option.key), [setGeo]);

  const allFieldsFilled = useMemo(() => {
    const createManifestFieldsFilled = file !== null && subKey !== '';
    if (allowEdit) {
      return manifestFileChosen && createManifestFieldsFilled;
    }
    return createManifestFieldsFilled;
  }, [allowEdit, file, manifestFileChosen, subKey]);

  const saveManifestFileData = (file) => {
    new Response(file).json().then(json => {
      setManifestFileChosen(true);
      setExistingManifestJson(json);
    }, () => {
      setManifestFileChosen(false);
      setExistingManifestJson(null);
    });
  };

  return (
    <div className={containerStyle}>
      <MessageBar className={cx(errorBannerStyle, { [errorBannerHidden]: errorMessage === '' })}
                  messageBarType={MessageBarType.error} onDismiss={() => setErrorMessage('')}
                  isMultiline={false} dismissButtonAriaLabel={t('close')}
                  data-testid={TEST_ID.ERROR_BAR}>
        {errorMessage}
      </MessageBar>
      <h2 className={headerStyle}>{t('upload.file')}</h2>
      <div className={formRowStyle}>
        <FieldLabel>{t('geography')}</FieldLabel>
        <div className={fieldStyle}>
          <Dropdown className={textFieldStyle} ariaLabel={t('upload.geography')}
                    options={environmentOptions} styles={dropdownStyle} onChange={updateGeo}
                    defaultSelectedKey={geo} />
        </div>
      </div>
      <div className={formRowStyle}>
        <FieldLabel required>{t('subscription.key')}</FieldLabel>
        <div className={fieldStyle}>
          <TextField className={textFieldStyle} ariaLabel={t('subscription.key')} value={subKey}
                     type={'password'} data-testid={TEST_ID.SUBSCRIPTION_KEY_FIELD} aria-required
                     canRevealPassword={true} onChange={updateSubKey} styles={inputStyles} />
        </div>
      </div>
      <FileField label={t('dwg.zip.package')} id={TEST_ID.FILE_UPLOAD_FIELD} onFileSelect={setFile}
                 fileType='zip' onError={setErrorMessage} />
      {allowEdit && <FileField label={t('manifest.file')} id={TEST_ID.MANIFEST_UPLOAD_FIELD}
                               onFileSelect={saveManifestFileData} fileType='json'
                               onError={setErrorMessage} />}
      <PrimaryButton disabled={!allFieldsFilled} onClick={uploadButtonOnClick} text={t('upload')}
                     className={primaryButtonStyle} data-testid={TEST_ID.UPLOAD_BUTTON} />
      <DefaultButton styles={buttonLabelStyle} className={defaultButtonStyle} text={t('cancel')}
                     onClick={navigateHome} data-testid={TEST_ID.CANCEL_BUTTON} />
    </div>
  );
};

CreateManifestPage.propTypes = {
  allowEdit: PropTypes.bool,
};

CreateManifestPage.defaultProps = {
  allowEdit: false,
};

export default CreateManifestPage;