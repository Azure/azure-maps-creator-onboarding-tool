import { Combobox, Option } from '@fluentui/react-components';
import { imdfCategories } from 'common/imdf-categories';
import { useOutsideClick } from 'hooks';
import React, { useEffect, useRef } from 'react';

const ImdfCategorySelector = props => {
  const { onOptionSelect, onBlur, ...rest } = props;

  const comboboxRef = useRef();
  const listRef = useRef();

  useEffect(() => {
    if (comboboxRef.current) {
      comboboxRef.current.focus();
    }
  }, []);

  useOutsideClick(() => {
    onBlur();
  }, [comboboxRef, listRef]);

  return (
    <Combobox ref={comboboxRef} onOptionSelect={onOptionSelect} open {...rest}>
      <div ref={listRef} style={{ maxHeight: 400 }}>
        {imdfCategories.map(option => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </div>
    </Combobox>
  );
};

export default ImdfCategorySelector;
