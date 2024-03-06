import { cx } from '@emotion/css';
import { Dropdown, Option, OptionGroup } from '@fluentui/react-components';
import FieldError from 'components/field-error';
import { useMemo, useRef, useState } from 'react';
import {
  dropdownButton,
  dropdownOption,
  dropdownStyleObj,
  dropdownWithError,
  errorContainer,
  filterInputStyle,
  hackInputStyle,
} from './style';

export const selectAllId = 'select-all';

const inputOnClick = e => {
  e.stopPropagation();
};

const DropdownComponent = props => {
  const {
    className,
    children,
    options,
    optionGroups,
    showFilter,
    onOpenChange,
    showError = true,
    errorMessage,
    ...attrs
  } = props;
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
    return optionGroups.map(options =>
      options.filter(({ key, text }) => {
        if (key === selectAllId) {
          return true;
        }
        return text.toLowerCase().includes(optionsFilter.toLowerCase());
      })
    );
  }, [optionGroups, optionsFilter]);
  const inputOnBlur = () => {
    ref.current.click();
    ref.current.focus();
  };
  const onOpenChangeCallback = (_, state) => {
    if (!state.open) setOptionsFilter('');
    onOpenChange?.(_, state);
  };

  const message = useMemo(() => {
    if (typeof errorMessage === 'string') return errorMessage;
    if (typeof errorMessage === 'function') return errorMessage();
  }, [errorMessage]);

  return (
    <div className={className}>
      <Dropdown
        size="small"
        className={cx({ [dropdownWithError]: showError && message })}
        style={dropdownStyleObj}
        button={<div className={dropdownButton}>{children}</div>}
        onOpenChange={onOpenChangeCallback}
        {...attrs}
      >
        {showFilter && (
          <>
            <input
              value={optionsFilter}
              onBlur={inputOnBlur}
              className={filterInputStyle}
              onClick={inputOnClick}
              onChange={e => setOptionsFilter(e.target.value)}
              type="text"
              placeholder="Search..."
            />
            <input ref={ref} className={hackInputStyle} />
          </>
        )}
        {filteredOptions?.map(option => (
          <Option {...option} key={option.key} value={option.key} style={dropdownOption}>
            {option.text}
          </Option>
        ))}
        {filteredGroups?.map((group, i) => (
          <OptionGroup key={i}>
            {group.map(option => (
              <Option {...option} key={option.key} value={option.key} style={dropdownOption}>
                {option.text}
              </Option>
            ))}
          </OptionGroup>
        ))}
      </Dropdown>
      {showError && message && (
        <div className={errorContainer}>
          <FieldError text={message} />
        </div>
      )}
    </div>
  );
};

export default DropdownComponent;
