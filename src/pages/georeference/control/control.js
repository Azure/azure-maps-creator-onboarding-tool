import { cx } from '@emotion/css';
import { ChoiceGroup, IconButton, PrimaryButton, Slider, TextField } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { data } from 'azure-maps-control';
import { fetchAddress } from 'common/api';
import { useGeometryStore } from 'common/store';
import FieldError from 'components/field-error';
import NumberInput from 'components/number-input';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  angleInputStyles,
  buttonDisabledStyles,
  buttonStyle,
  collapseButton,
  controlContainer,
  controlCoordinatesContainer,
  controlHeader,
  controlInputStyles,
  controlSliderSection,
  controls,
  hiddenControls,
  iconClass,
  radioButtonsContainer,
  searchAddressContainer,
  searchAddressInput,
  sectionTitle,
  sliderContainerInner,
  sliderContainerOuter,
  toggleButton,
} from './control.style';

const anchorPointSelector = s => [s.anchorPoint.angle, s.updateAngle];

export const TEST_ID = {
  MAP_CONTROL: 'map-control',
};

const radioKeys = {
  address: 'address',
  coordinates: 'coordinates',
};

function Control({ map }) {
  const { t } = useTranslation();
  const [anchorPointAngle, updateAngle] = useGeometryStore(anchorPointSelector);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState('');
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isControlsShown, setIsControlsShown] = useState(true);
  const [searchAddressErrorMsg, setSearchAddressErrorMsg] = useState('');
  const [selectedRadioKey, setSelectedRadioKey] = useState(radioKeys.address);

  const sliderOnChange = useCallback(
    degrees => {
      updateAngle(degrees);
    },
    [updateAngle]
  );
  const onAngleChange = useCallback(
    angle => {
      updateAngle(angle !== null ? angle : 0);
    },
    [updateAngle]
  );
  const updateCamera = useCallback(() => {
    if (lat !== null && lng !== null) {
      setAddress('');
      setSearchAddressErrorMsg('');
      map.setCamera({
        center: [lng, lat],
      });
    }
  }, [map, lat, lng]);
  const toggle = useCallback(() => {
    setIsControlsShown(!isControlsShown);
  }, [setIsControlsShown, isControlsShown]);
  const onAddressChange = useCallback(e => setAddress(e.target.value), [setAddress]);
  const searchAddress = useCallback(() => {
    if (!address) {
      return;
    }

    setLng(null);
    setLat(null);
    setIsFetchingAddress(true);

    fetchAddress(address)
      .then(re => {
        if (re.results.length) {
          const { position } = re.results[0];
          map.setCamera({
            center: new data.Position(parseFloat(position.lon), parseFloat(position.lat)),
            zoom: 16,
          });
          setSearchAddressErrorMsg('');
        }
      })
      .catch(() => {
        setSearchAddressErrorMsg(<FieldError text={t('request.failed')} />);
      })
      .finally(() => {
        setIsFetchingAddress(false);
      });
  }, [address, map, setIsFetchingAddress, t]);
  const onAddressKeyPress = useCallback(
    e => {
      if (e.code === 'Enter') {
        searchAddress();
      }
    },
    [searchAddress]
  );
  const radioOptions = useMemo(
    () => [
      { key: radioKeys.address, text: t('search.by.building.address') },
      { key: radioKeys.coordinates, text: t('search.by.lon.lat') },
    ],
    [t]
  );
  const onRadioChange = useCallback((e, option) => {
    setSelectedRadioKey(option.key);
  }, []);

  return (
    <div data-testid={TEST_ID.MAP_CONTROL} className={controlContainer}>
      <IconButton
        className={cx(toggleButton, { [hiddenControls]: isControlsShown })}
        onClick={toggle}
        ariaLabel={t('hide.control')}
      >
        <Icon iconName="Search" className={iconClass} ariaLabel={t('hide.control')} />
      </IconButton>
      <div className={cx(controls, { [hiddenControls]: !isControlsShown })}>
        <div className={controlHeader}>
          <span>{t('position.building.footprint')}</span>
          <IconButton className={collapseButton} onClick={toggle} ariaLabel={t('toggle.control')}>
            <Icon iconName="BackToWindow" className={iconClass} />
          </IconButton>
        </div>
        <div className={cx(searchAddressContainer, radioButtonsContainer)}>
          <ChoiceGroup selectedKey={selectedRadioKey} options={radioOptions} onChange={onRadioChange} />
        </div>
        {selectedRadioKey === radioKeys.address && (
          <div className={searchAddressContainer}>
            <TextField
              placeholder={t('search.address')}
              styles={searchAddressInput}
              value={address}
              onChange={onAddressChange}
              onKeyPress={onAddressKeyPress}
              disabled={isFetchingAddress}
              errorMessage={searchAddressErrorMsg}
            />
            <PrimaryButton
              className={buttonStyle}
              onClick={searchAddress}
              styles={buttonDisabledStyles}
              disabled={address.length === 0}
            >
              {t('search')}
            </PrimaryButton>
          </div>
        )}
        {selectedRadioKey === radioKeys.coordinates && (
          <div className={searchAddressContainer}>
            <div className={controlCoordinatesContainer}>
              <NumberInput
                placeholder={t('longitude')}
                value={lng}
                max={180}
                min={-180}
                precision={8}
                onChange={setLng}
                onSubmit={updateCamera}
                className={controlInputStyles}
              />
              <NumberInput
                placeholder={t('latitude')}
                value={lat}
                max={90}
                min={-90}
                precision={8}
                onChange={setLat}
                onSubmit={updateCamera}
                className={controlInputStyles}
              />
            </div>
            <PrimaryButton
              className={buttonStyle}
              onClick={updateCamera}
              styles={buttonDisabledStyles}
              disabled={lat === null || lng === null}
            >
              {t('search')}
            </PrimaryButton>
          </div>
        )}
        <div className={controlSliderSection}>
          <div className={sectionTitle}>{t('rotation.in.degrees')}</div>
          <div className={sliderContainerOuter}>
            <div className={sliderContainerInner}>
              <Slider
                min={-360}
                max={360}
                step={1}
                showValue={false}
                snapToStep
                value={anchorPointAngle}
                onChange={sliderOnChange}
              />
            </div>
            <NumberInput
              value={anchorPointAngle}
              className={angleInputStyles}
              max={360}
              min={-360}
              align={'center'}
              onChange={onAngleChange}
              precision={2}
              ariaLabel={t('rotation.in.degrees')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Control;
