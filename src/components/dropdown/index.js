import { Dropdown, Option } from '@fluentui/react-components';

import { dropdownButton, dropdownOption, dropdownStyleObj } from './style';

const DropdownComponent = ({ children, options, ...attrs }) => (
  <Dropdown size='small' style={dropdownStyleObj} button={<div className={dropdownButton}>{children}</div>} {...attrs}>
    {options.map((option) => (
      <Option key={option.key} value={option.key} style={dropdownOption}>
        {option.text}
      </Option>
    ))}
  </Dropdown>
);

export default DropdownComponent;