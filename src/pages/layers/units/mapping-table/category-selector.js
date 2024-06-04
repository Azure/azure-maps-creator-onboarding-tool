import { Combobox, Option } from '@fluentui/react-components';
import { imdfCategories } from 'common/imdf-categories';
import { useOutsideClick } from 'hooks';
import React, { useEffect, useRef } from 'react';

const unspecifiedCategory = 'unspecified';
const definedImdfCategories = imdfCategories.filter(category => category !== unspecifiedCategory);

const ImdfCategorySelector = props => {
  const { onOptionSelect, onBlur, ...rest } = props;

  const listRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0); // Delay of 0 ms to push to the end of the event queue
  }, [inputRef]);

  useOutsideClick(() => {
    onBlur();
  }, [inputRef, listRef]);

  const handleOptionSelect = (event, item) => {
    // Case when user clears the input field
    if (!item.optionValue) return;

    onOptionSelect(event, item);
    onBlur();
  };

  return (
    <Combobox
      onOptionSelect={handleOptionSelect}
      input={{ ref: inputRef }}
      listbox={{ ref: listRef, style: { maxHeight: 400 } }}
      open
      {...rest}
    >
      <Option key={unspecifiedCategory} value={unspecifiedCategory} text={unspecifiedCategory}>
        <span style={{ fontStyle: 'italic', fontWeight: 300 }}>{unspecifiedCategory}</span>
      </Option>
      {definedImdfCategories.map(option => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </Combobox>
  );
};

export default ImdfCategorySelector;
