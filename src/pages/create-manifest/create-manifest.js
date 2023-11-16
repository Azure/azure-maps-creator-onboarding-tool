import { cx } from '@emotion/css';
import { DefaultButton, MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react';
import { PATHS } from 'common';
import { getEnvs } from 'common/functions';
import { useResponseStore, useUserStore } from 'common/store';
import Dropdown from 'components/dropdown';
import FieldLabel from 'components/field-label';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import FileUploader from './FileUploader';
import {
  actionPanelStyle,
  containerStyle,
  conversionsLink,
  descriptionStyle,
  disabledConversionsLinks,
  dropdownStyle,
  errorBannerHidden,
  errorBannerStyle,
  fieldStyle,
  formRowStyle,
  headerStyle,
  inputStyles,
  primaryButtonDisabledStyles,
  primaryButtonStyle,
  textFieldStyle,
} from './create-manifest.style';
import FileField from './file-field';

export const TEST_ID = {
  ERROR_BAR: 'error-bar',
  FILE_NAME_FIELD: 'file-name-field',
  FILE_UPLOAD_FIELD: 'file-upload-field',
  MANIFEST_UPLOAD_FIELD: 'manifest-upload-field',
  SUBSCRIPTION_KEY_FIELD: 'subscription-key-field',
  UPLOAD_BUTTON: 'upload-button',
};

const userStoreSelector = s => [s.setGeography, s.geography, s.setSubscriptionKey, s.subscriptionKey];
const responseStoreSelector = s => [s.acknowledgeError, s.errorMessage, s.uploadFile];

const CreateManifestPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState(null);

  const [setGeo, geo, setSubKey, subKey] = useUserStore(userStoreSelector, shallow);
  const [acknowledgeApiError, apiErrorMessage, uploadFile] = useResponseStore(responseStoreSelector, shallow);

  const environmentOptions = useMemo(
    () =>
      Object.keys(getEnvs()).map(geography => ({
        key: geography,
        text: t(getEnvs()[geography].TEXT),
      })),
    [t]
  );

  useEffect(() => acknowledgeApiError, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (apiErrorMessage) {
      setErrorMessage(apiErrorMessage);
    }
  }, [apiErrorMessage]);

  const uploadButtonOnClick = useCallback(() => {
    if (file === null || subKey === '') {
      return;
    }

    uploadFile(file);
    navigate(PATHS.PROCESSING);
  }, [file, navigate, subKey, uploadFile]);

  const updateSubKey = useCallback(e => setSubKey(e.target.value), [setSubKey]);
  const updateGeo = useCallback(
    (_, option) => {
      setGeo(option.optionValue);
      localStorage.setItem('geography', option.optionValue);
    },
    [setGeo]
  );

  const allFieldsFilled = useMemo(() => {
    return file !== null && subKey !== '';
  }, [file, subKey]);

  return (
    <div className={containerStyle}>
      <MessageBar
        className={cx(errorBannerStyle, { [errorBannerHidden]: errorMessage === '' })}
        messageBarType={MessageBarType.error}
        onDismiss={() => setErrorMessage('')}
        dismissButtonAriaLabel={t('close')}
        data-testid={TEST_ID.ERROR_BAR}
      >
        {errorMessage}
      </MessageBar>
      <h2 className={headerStyle}>{t('process.file')}</h2>
      <p className={descriptionStyle}>{t('create.new.manifest.page.description')}</p>
      <div className={formRowStyle}>
        <FieldLabel tooltip={t('tooltip.geography')}>{t('geography')}</FieldLabel>
        <div className={fieldStyle}>
          <Dropdown
            placeholder={t('geography')}
            onOptionSelect={updateGeo}
            className={dropdownStyle}
            options={environmentOptions}
            defaultSelectedKey={geo}
          >
            {t(getEnvs()[geo].TEXT)}
          </Dropdown>
        </div>
      </div>
      <div className={formRowStyle}>
        <FieldLabel required tooltip={t('tooltip.subKey')}>
          {t('subscription.key')}
        </FieldLabel>
        <div className={fieldStyle}>
          <TextField
            className={textFieldStyle}
            ariaLabel={t('subscription.key')}
            value={subKey}
            type={'password'}
            data-testid={TEST_ID.SUBSCRIPTION_KEY_FIELD}
            aria-required
            canRevealPassword={true}
            onChange={updateSubKey}
            styles={inputStyles}
          />
        </div>
      </div>
      {false && (
        <>
          <FileField
            label={t('dwg.zip.package')}
            id={TEST_ID.FILE_UPLOAD_FIELD}
            onFileSelect={setFile}
            fileType="zip"
            onError={setErrorMessage}
            tooltip={t('tooltip.dwg.zip.package')}
          />
          <PrimaryButton
            disabled={!allFieldsFilled}
            onClick={uploadButtonOnClick}
            data-testid={TEST_ID.UPLOAD_BUTTON}
            className={primaryButtonStyle}
            text={t('process')}
            styles={primaryButtonDisabledStyles}
          />
          <Link
            to={subKey ? PATHS.CONVERSIONS : ''}
            className={cx({ [conversionsLink]: subKey, [disabledConversionsLinks]: !subKey })}
          >
            {t('view.existing.conversions')}
          </Link>
        </>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 15, marginTop: 30 }}>
        <div className={actionPanelStyle}>
          <div>
            <h3>Previous conversions</h3>
            <div>View all your previous conversions</div>
          </div>
          <div>
            <DefaultButton
              to={subKey ? PATHS.CONVERSIONS : ''}
              onClick={() => navigate(PATHS.CONVERSIONS)}
              disabled={!subKey}
              // className={cx({ [conversionsLink]: subKey, [disabledConversionsLinks]: !subKey })}
              style={{ height: '1.5rem' }}
              text="View"
            />
          </div>
        </div>
        <div className={actionPanelStyle}>
          <div>
            <h3>New conversion</h3>
            <div>Start by uploading your DWG files</div>
          </div>
          <div>
            <FileUploader
              id={TEST_ID.FILE_UPLOAD_FIELD}
              onFileSelect={setFile}
              fileType="zip"
              onError={setErrorMessage}
              tooltip={t('tooltip.dwg.zip.package')}
            />
            {file && (
              <PrimaryButton
                disabled={!allFieldsFilled}
                onClick={uploadButtonOnClick}
                data-testid={TEST_ID.UPLOAD_BUTTON}
                className={primaryButtonStyle}
                text={t('process')}
                styles={primaryButtonDisabledStyles}
                style={{ marginTop: 6 }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateManifestPage;
