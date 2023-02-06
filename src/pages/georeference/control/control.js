import { useState, useCallback } from 'react';
import { IconButton, Slider, TextField } from '@fluentui/react';
import { shallow } from 'zustand/shallow';
import { data } from 'azure-maps-control';
import { useTranslation } from 'react-i18next';
import { Icon } from '@fluentui/react/lib/Icon';
import { cx } from '@emotion/css';

import FieldError from 'components/field-error';
import NumberInput from 'components/number-input';

import {
  angleInputStyles,
  collapseButton,
  controlContainer,
  controlCoordinatesContainer,
  controlHeader,
  controlInputStyles,
  controls,
  controlSliderSection, hiddenControls,
  iconClass,
  searchAddressContainer,
  searchAddressInput,
  sectionTitle,
  sliderContainerInner,
  sliderContainerOuter,
  toggleButton,
} from './control.style';
import { useGeometryStore, useUserStore } from 'common/store';
import { fetchAddress } from 'common/api';

const anchorPointSelector = (state) => [state.anchorPoint.angle, state.updateAnchorPoint];
const userStoreSelector = (s) => [s.geography, s.subscriptionKey];

function Control({ map }) {
  const { t } = useTranslation();
  const [anchorPointAngle, updateAnchorPoint] = useGeometryStore(anchorPointSelector, shallow);
  const [geography, subscriptionKey] = useUserStore(userStoreSelector, shallow);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState('');
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isControlsShown, setIsControlsShown] = useState(true);
  const [searchAddressErrorMsg, setSearchAddressErrorMsg] = useState('');

  const sliderOnChange = useCallback((degrees) => {
    updateAnchorPoint({
      angle: degrees,
    });
  }, [updateAnchorPoint]);
  const onAngleChange = useCallback((angle) => {
    updateAnchorPoint({
      angle: angle !== null ? angle : 0,
    });
  }, [updateAnchorPoint]);
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
  const onAddressChange = useCallback((e) => setAddress(e.target.value), [setAddress]);
  const searchAddress = useCallback((e) => {
    if (e.code !== 'Enter' || !address) {
      return;
    }

    setLng(null);
    setLat(null);
    setIsFetchingAddress(true);

    fetchAddress(address, geography, subscriptionKey)
      .then((re) => {
        if (re.results.length) {
          const {position} = re.results[0];
          map.setCamera({
            center: new data.Position(parseFloat(position.lon), parseFloat(position.lat)),
            zoom: 16,
          });
          setSearchAddressErrorMsg('');
        }
    }).catch(() => {
      setSearchAddressErrorMsg(<FieldError text={t('request.failed')} />);
    }).finally(() => {
      setIsFetchingAddress(false);
    });
  }, [address, geography, map, setIsFetchingAddress, subscriptionKey, t]);

  return (
    <div className={controlContainer}>
      <IconButton className={toggleButton} onClick={toggle} ariaLabel={t('hide.control')}>
        <Icon iconName='Search' className={iconClass} ariaLabel={t('hide.control')} />
      </IconButton>
      <div className={cx(controls, { [hiddenControls]: !isControlsShown })}>
        <div className={controlHeader}>
          <span>{t('position.building.footprint')}</span>
          <IconButton className={collapseButton} onClick={toggle} ariaLabel={t('toggle.control')}>
            <Icon iconName='BackToWindow' className={iconClass} />
          </IconButton>
        </div>
        <div className={searchAddressContainer}>
          <div className={sectionTitle}>{t('search.by.building.address')}</div>
          <TextField placeholder={t('search.address')} styles={searchAddressInput} value={address}
                     onChange={onAddressChange} onKeyPress={searchAddress} disabled={isFetchingAddress}
                     errorMessage={searchAddressErrorMsg} />
        </div>
        <div className={searchAddressContainer}>
          <div className={sectionTitle}>{t('search.by.lon.lat')}</div>
          <div className={controlCoordinatesContainer}>
            <NumberInput placeholder={t('longitude')} value={lng} max={180} min={-180} precision={8}
                       onChange={setLng} onSubmit={updateCamera} className={controlInputStyles} />
            <NumberInput placeholder={t('latitude')} value={lat} max={90} min={-90} precision={8}
                       onChange={setLat} onSubmit={updateCamera} className={controlInputStyles} />
          </div>
        </div>
        <div className={controlSliderSection}>
          <div className={sectionTitle}>{t('rotation.in.degrees')}</div>
          <div className={sliderContainerOuter}>
            <div className={sliderContainerInner}>
              <Slider min={-360} max={360} step={1} showValue={false} snapToStep value={anchorPointAngle}
                      onChange={sliderOnChange} />
            </div>
            <NumberInput value={anchorPointAngle} className={angleInputStyles} max={360} min={-360}
                         align={'center'} onChange={onAngleChange} precision={2}
                         ariaLabel={t('rotation.in.degrees')} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Control;