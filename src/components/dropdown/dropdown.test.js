import { render } from '@testing-library/react';

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
    expect(view).toMatchSnapshot();
  });
});