import { render, screen, fireEvent } from '@testing-library/react';

import Dropdown from './index';

describe('Dropdown', () => {
  it('should render component', () => {
    const options = [
      {
        key: 'key1',
        text: 'text1',
      },
      {
        key: 'key2',
        text: 'text2',
      },
      {
        key: 'key3',
        text: 'text3',
      }
    ];
    const view = render(
      <Dropdown options={options} anotherAttr={1} someOtherAttr={'hello'}>A shrimp's heart is in its head.</Dropdown>
    );
    const dropdown = screen.getByRole('combobox');
    fireEvent.click(dropdown);
    expect(view).toMatchSnapshot();
    const optionsList = screen.getAllByRole('option');
    expect(optionsList.length).toBe(3);
    expect(optionsList[0]).toHaveTextContent('text1');
    expect(optionsList[1]).toHaveTextContent('text2');
    expect(optionsList[2]).toHaveTextContent('text3');
  });


  it('should render component with option groups', () => {
    const groups = [
      [
        {
          key: 'key1',
          text: 'text1',
        },
      ],
      [
        {
          key: 'key2',
          text: 'text2',
        },
        {
          key: 'key3',
          text: 'text3',
        }
      ],
    ];
    const view = render(
      <Dropdown optionGroups={groups} anotherAttr={1} someOtherAttr={'hello'}>A shrimp's heart is in its head.</Dropdown>
    );
    const dropdown = screen.getByRole('combobox');
    fireEvent.click(dropdown);
    expect(view).toMatchSnapshot();
    const optionsList = screen.getAllByRole('option');
    expect(optionsList.length).toBe(3);
    expect(optionsList[0]).toHaveTextContent('text1');
    expect(optionsList[1]).toHaveTextContent('text2');
    expect(optionsList[2]).toHaveTextContent('text3');
  });
});