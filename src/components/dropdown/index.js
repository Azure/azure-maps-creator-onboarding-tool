import { Dropdown, Option, OptionGroup } from '@fluentui/react-components';

import { dropdownButton, dropdownOption, dropdownStyleObj } from './style';

const DropdownComponent = ({ children, options, optionGroups, ...attrs }) => (
  <Dropdown size='small' style={dropdownStyleObj} button={<div className={dropdownButton}>{children}</div>} {...attrs}>
    {options?.map((option) => (
      <Option key={option.key} value={option.key} style={dropdownOption}>
        {option.text}
      </Option>
    ))}
    {optionGroups?.map((group, i) => (
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

export default DropdownComponent;