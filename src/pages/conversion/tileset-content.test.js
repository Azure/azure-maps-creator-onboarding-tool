import { screen, render, fireEvent } from '@testing-library/react';

import TilesetContent from './tileset-content';
import { useConversionStore } from 'common/store';

jest.mock('./tileset-map', () => () => 'Tileset map here');

describe('tileset content', () => {
  beforeEach(() => {
    useConversionStore.setState({
      selectedStep: 0,
      tilesetOperationLog: null,
    });
  });

  it('should render nothing by default', () => {
    const view = render(<TilesetContent />);
    expect(view).toMatchSnapshot();
  });

  it('should render tileset content', () => {
    useConversionStore.setState({
      selectedStep: 3,
      tilesetOperationLog: JSON.stringify({ foo: 'tileset-operation-log', baz: 'blee blue blah blueberry dee'}, null, 4),
    });
    const view = render(<TilesetContent />);
    expect(view).toMatchSnapshot();
  });

  it('should render tileset content logs tab', () => {
    useConversionStore.setState({
      selectedStep: 3,
      tilesetOperationLog: JSON.stringify({ foo: 'hop-hei-la-la-lei', baz: 'blee blue blah blueberry dee'}, null, 4),
    });
    const view = render(<TilesetContent />);
    expect(view).toMatchSnapshot();
  });
});