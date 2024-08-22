import React from 'react';
import { placeholderStyle } from './index.style';

const DropdownText = props => {
  const { selectedOptions, placeholder } = props;
  if (selectedOptions.length === 1) {
    return selectedOptions;
  } else if (selectedOptions.length > 1) {
    return `${selectedOptions[0]} (+${selectedOptions.length - 1})`;
  }
  return <span className={placeholderStyle}>{placeholder}</span>;
};

export default DropdownText;
