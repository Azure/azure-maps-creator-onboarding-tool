import { cx } from '@emotion/css';
import { MessageBar, MessageBarType, PrimaryButton, TextField } from '@fluentui/react';
import { PATHS } from 'common';
import { getEnvs } from 'common/functions';
import { resetAllStores, useResponseStore, useUserStore } from 'common/store';
import Dropdown from 'components/dropdown';
import FieldLabel from 'components/field-label';
import FileField from 'components/file-field/file-field';
import { useCustomNavigate, useFeatureFlags } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  containerStyle,
  descriptionStyle,
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

export const TEST_ID = {
  ERROR_BAR: 'error-bar',
  FILE_NAME_FIELD: 'file-name-field',
  FILE_UPLOAD_FIELD: 'file-upload-field',
  MANIFEST_UPLOAD_FIELD: 'manifest-upload-field',
  SUBSCRIPTION_KEY_FIELD: 'subscription-key-field',
  UPLOAD_BUTTON: 'upload-button',
};

const userStoreSelector = s => [s.setGeography, s.geography, s.setSubscriptionKey, s.subscriptionKey];
const responseStoreSelector = s => [s.errorMessage, s.uploadFile];

const CreateManifestPage = () => {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState(null);

  const [setGeo, geo, setSubKey, subKey] = useUserStore(userStoreSelector);
  const [apiErrorMessage, uploadFile] = useResponseStore(responseStoreSelector);
  const { isPlacesPreview } = useFeatureFlags();

  const environmentOptions = useMemo(
    () =>
      Object.keys(getEnvs()).map(geography => ({
        key: geography,
        text: t(getEnvs()[geography].TEXT),
      })),
    [t]
  );

  useEffect(() => {
    resetAllStores();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <p className={descriptionStyle}>
        {isPlacesPreview ? t('create.new.manifest.page.description.places') : t('create.new.manifest.page.description')}
      </p>
      <div className={formRowStyle}>
        <FieldLabel tooltip={t('tooltip.geography')}>{t('geography')}</FieldLabel>
        <div className={fieldStyle}>
          <Dropdown
            placeholder={t('geography')}
            onOptionSelect={updateGeo}
            className={dropdownStyle}
            options={environmentOptions}
            selectedKey={geo}
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
            type="password"
            data-testid={TEST_ID.SUBSCRIPTION_KEY_FIELD}
            aria-required
            canRevealPassword
            onChange={updateSubKey}
            styles={inputStyles}
          />
        </div>
      </div>
      <FileField
        label={t('dwg.zip.package')}
        id={TEST_ID.FILE_UPLOAD_FIELD}
        onFileSelect={setFile}
        fileType="zip"
        onError={setErrorMessage}
        tooltip={isPlacesPreview ? t('tooltip.dwg.zip.package.places') : t('tooltip.dwg.zip.package')}
      />
      <PrimaryButton
        disabled={!allFieldsFilled}
        onClick={uploadButtonOnClick}
        data-testid={TEST_ID.UPLOAD_BUTTON}
        className={primaryButtonStyle}
        text={t('process')}
        styles={primaryButtonDisabledStyles}
      />
    </div>
  );
};

export default CreateManifestPage;
