import { render } from '@testing-library/react';
import { useLayersStore } from 'common/store';
import Layers from './layers';

jest.mock('./preview-map', () => () => 'Layer Preview');

const defaultLayers = [
  {
    id: 0,
    name: 'base layer',
    props: [{ id: 2, name: '', isDraft: false, value: [] }],
    value: ['this', 'is', 'my', 'fav', 'layer'],
    isDraft: false,
  },
  {
    id: 1,
    name: 'interior',
    props: [{ id: 4, name: '', isDraft: true, value: [] }],
    value: ['walls', 'ratatata'],
    isDraft: false,
  },
  { id: 3, name: '', props: [], value: [], isDraft: true },
];

jest.mock('./layer', () => props => <div>{JSON.stringify(props)}</div>);

describe('Layers', () => {
  beforeEach(() => {
    useLayersStore.setState({
      layers: [...defaultLayers],
    });
  });

  it('should render Layers component', () => {
    const view = render(<Layers />);
    expect(view).toMatchSnapshot();
  });
});
