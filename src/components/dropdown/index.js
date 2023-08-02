import { useState, useMemo, useRef } from 'react';
import { Dropdown, Option, OptionGroup } from '@fluentui/react-components';
import { dropdownButton, dropdownOption, dropdownStyleObj, filterInputStyle, hackInputStyle } from './style';

export const selectAllId = 'select-all';

const inputOnClick = (e) => { e.stopPropagation(); };

const DropdownComponent = ({ children, options, optionGroups, showFilter, onOpenChange, ...attrs }) => {
  const [optionsFilter, setOptionsFilter] = useState('');
  const ref = useRef(null);

  const filteredOptions = useMemo(() => {
    if (optionsFilter === '' || !options) {
      return options;
    }
    return options.filter(({ key, text }) => {
      if (key === selectAllId) {
        return true;
      }
      return text.toLowerCase().includes(optionsFilter.toLowerCase());
    });
  }, [options, optionsFilter]);
  const filteredGroups = useMemo(() => {
    if (optionsFilter === '' || !optionGroups) {
      return optionGroups;
    }
    return optionGroups.map((options) => (
      options.filter(({ key, text }) => {
        if (key === selectAllId) {
          return true;
        }
        return text.toLowerCase().includes(optionsFilter.toLowerCase());
      })
    ));
  }, [optionGroups, optionsFilter]);
  const inputOnBlur = () => {
    ref.current.click();
    ref.current.focus();
  };
  const onOpenChangeCallback = (_, state) => {
    if (!state.open) setOptionsFilter('');
    onOpenChange?.(_, state);
  };

  return (
    <Dropdown size='small' style={dropdownStyleObj} button={<div className={dropdownButton}>{children}</div>}
              onOpenChange={onOpenChangeCallback} {...attrs}>
      {showFilter && (
        <>
          <input value={optionsFilter} onBlur={inputOnBlur} className={filterInputStyle} onClick={inputOnClick}
                 onChange={(e) => setOptionsFilter(e.target.value)} type='text' placeholder='Search layers' />
          <input ref={ref} className={hackInputStyle} />
        </>
      )}
      {filteredOptions?.map((option) => (
        <Option key={option.key} value={option.key} style={dropdownOption}>
          {option.text}
        </Option>
      ))}
      {filteredGroups?.map((group, i) => (
        <OptionGroup key={i}>
          {group.map((option) => (
            <Option key={option.key} value={option.key} style={dropdownOption}>
              {option.text}
            </Option>
          ))}
        </OptionGroup>
      ))}
    </Dropdown>
  );
};

export default DropdownComponent;