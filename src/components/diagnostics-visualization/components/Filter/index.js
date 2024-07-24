import { SearchBox } from '@fluentui/react/lib/SearchBox';
import Dropdown from 'components/dropdown';
import React, { useEffect, useState } from 'react';
import { dropdownStyle, filterBarStyle, placeholderStyle, textBoxStyle } from './index.style';

const DropdownText = props => {
  const { selectedOptions, placeholder } = props;
  if (selectedOptions.length === 1) {
    return selectedOptions;
  } else if (selectedOptions.length > 1) {
    return `${selectedOptions[0]} (+${selectedOptions.length - 1})`;
  }
  return <span className={placeholderStyle}>{placeholder}</span>;
};

const genericCompare = (a, b) => {
  if (Number.isNaN(a) && Number.isNaN(b)) {
    if (typeof a === 'string' && b === 'string') {
      return a.localeCompare(b);
    }
    return a - b;
  }

  if (Number.isNaN(a)) {
    return 1;
  }
  if (Number.isNaN(b)) {
    return -1;
  }
  return a - b;
};

const Filter = ({ resultItems, setExcludedIds }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [selectedOrdinals, setSelectedOrdinals] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [codeOptions, setCodeOptions] = useState([]);
  const [ordinalOptions, setOrdinalOptions] = useState([]);
  const [layerOptions, setLayerOptions] = useState([]);

  const applyFilters = () => {
    if (!resultItems) return;

    const codeSet = selectedCodes.length ? new Set(selectedCodes) : undefined;
    const ordinalSet = selectedOrdinals.length ? new Set(selectedOrdinals) : undefined;
    const layerSet = selectedLayers.length ? new Set(selectedLayers) : undefined;
    const filterKeyword = keyword && keyword.toLowerCase();

    const { errors, levelOutlines } = resultItems;
    const errorsExcludedIds = (errors || [])
      .filter(
        error =>
          (codeSet && !codeSet.has(error.code)) ||
          (ordinalSet && !ordinalSet.has(String(error.levelOrdinal))) ||
          (layerSet && !layerSet.has(error.layerName)) ||
          (filterKeyword &&
            (!error.code || error.code.toLowerCase().indexOf(filterKeyword) === -1) &&
            (!error.message || error.message.toLowerCase().indexOf(filterKeyword) === -1) &&
            (!error.layerName || error.layerName.toLowerCase().indexOf(filterKeyword) === -1) &&
            (!error.geometry || error.geometry.toLowerCase().indexOf(filterKeyword) === -1) &&
            String(error.levelOrdinal || '')
              .toLowerCase()
              .indexOf(filterKeyword) === -1)
      )
      .map(error => error.key);
    const levelOutlinesExcludedIds = (levelOutlines || [])
      .filter(
        levelOutline =>
          (ordinalSet && !ordinalSet.has(String(levelOutline.levelOrdinal))) ||
          (filterKeyword &&
            String(levelOutline.levelOrdinal || '')
              .toLowerCase()
              .indexOf(filterKeyword) === -1)
      )
      .map(levelOutline => levelOutline.key);

    setExcludedIds({
      errors: new Set(errorsExcludedIds),
      levelOutlines: new Set(levelOutlinesExcludedIds),
    });
  };

  const [firstRender, setFirstRender] = useState(true);

  // INITIALIZE FILTERS
  useEffect(() => {
    if (!resultItems) return;
    if (!firstRender) return;

    const { errors: nxtErrors, levelOutlines: nxtLevelOutlines } = resultItems;

    const uniqueCodes = [...new Set((nxtErrors || []).map(error => error.code))].sort();
    const uniqueOrdinals = [
      ...new Set([
        ...(nxtErrors || []).map(error => error.levelOrdinal),
        ...(nxtLevelOutlines || []).map(levelOutline => levelOutline.levelOrdinal),
      ]),
    ].sort(genericCompare);
    const uniqueLayers = [...new Set((nxtErrors || []).map(error => error.layerName))].sort();

    setCodeOptions(uniqueCodes.map(code => ({ key: String(code), text: String(code) })));
    setOrdinalOptions(uniqueOrdinals.map(ordinal => ({ key: String(ordinal), text: String(ordinal) })));
    setLayerOptions(uniqueLayers.map(layer => ({ key: String(layer), text: String(layer) })));

    let firstNonNegativeOrdinalOrZero = uniqueOrdinals.findIndex(ordinal => ordinal > -1);
    if (firstNonNegativeOrdinalOrZero < 0) {
      firstNonNegativeOrdinalOrZero = 0;
    }
    // IDs are strings, so we need to convert them
    setSelectedOrdinals([`${uniqueOrdinals[firstNonNegativeOrdinalOrZero]}`]);
    if (uniqueOrdinals.length === 0) {
      setSelectedOrdinals([]);
    }

    // applyFilters();
    setFirstRender(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultItems]);

  useEffect(() => {
    if (!resultItems) return;

    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, selectedCodes, selectedOrdinals, selectedLayers]);

  const handleSelectionChange = (option, setSelected) => {
    setSelected(option.selectedOptions);
  };

  if (!resultItems) {
    return null;
  }

  return (
    <div className={filterBarStyle}>
      <SearchBox className={textBoxStyle} placeholder="Keyword" onChange={(_, newValue) => setKeyword(newValue)} />
      <Dropdown
        className={dropdownStyle}
        options={codeOptions}
        selectedOptions={selectedCodes}
        onOptionSelect={(event, option) => handleSelectionChange(option, setSelectedCodes)}
        multiselect
      >
        <DropdownText selectedOptions={selectedCodes} placeholder="Code" />
      </Dropdown>
      <Dropdown
        className={dropdownStyle}
        options={ordinalOptions}
        selectedOptions={selectedOrdinals}
        onOptionSelect={(event, option) => handleSelectionChange(option, setSelectedOrdinals)}
      >
        <DropdownText selectedOptions={selectedOrdinals} placeholder="Level" />
      </Dropdown>
      <Dropdown
        className={dropdownStyle}
        options={layerOptions}
        selectedOptions={selectedLayers}
        onOptionSelect={(event, option) => handleSelectionChange(option, setSelectedLayers)}
        multiselect
      >
        <DropdownText selectedOptions={selectedLayers} placeholder="Layer" />
      </Dropdown>
    </div>
  );
};

export default Filter;
