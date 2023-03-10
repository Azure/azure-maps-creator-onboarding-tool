import { render } from '@testing-library/react';

import { useLayersStore } from 'common/store';

import Layers from './layers';

const defaultLayers = [
  { id: 0, name: 'exterior', props: [{ id: 2, name: '', isDraft: false, value: [], }], value: ['this','is','my','fav','exterior'], required: true, isDraft: false },
  { id: 1, name: 'interior', props: [{ id: 4, name: '', isDraft: true, value: [], }], value: ['walls','ratatata'], required: false, isDraft: false },
  { id: 3, name: '', props: [], value: [], required: false, isDraft: true },
];

jest.mock('./layer', () => (props) => (
  <div>{JSON.stringify(props)}</div>
));

describe('Layers', () => {
  beforeEach(() => {
    useLayersStore.setState({
      layers: [...defaultLayers],
      newLayerIdCounter: 5,
    });
  });

  it('should render Layers component', () => {
    const view = render(<Layers />);
    expect(view).toMatchSnapshot();
  });
});